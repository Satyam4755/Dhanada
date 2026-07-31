'use strict';

const knowledgeService = require('./knowledgeService');
const leadManager = require('./leadManager');
const { GoogleGenAI } = require('@google/genai');

let aiClient = null;
try {
  if (process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (error) {
  console.warn("Failed to initialize Gemini Client:", error);
}

const LEAD_STEPS = {
  NONE: 'none',
  NAME: 'name',
  CONTACT_PREF: 'contact_pref',
  PHONE: 'phone',
  EMAIL: 'email',
  PHONE_THEN_EMAIL: 'phone_then_email',
  DONE: 'done',
};

const GREETINGS = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon', 'namaste'];
const THANKS = ['thanks', 'thank you', 'thx', 'appreciate it'];
const AFFIRMATIVE = ['yes', 'yeah', 'sure', 'okay', 'ok', 'please do', 'go ahead', 'sounds good', 'yes please'];
const NEGATIVE = ['no', 'not now', 'no thanks', 'maybe later', 'not interested'];

const TOPIC_PATTERNS = [
  { type: 'recommendation', patterns: ['recommend', 'suggest', 'best fund', 'which fund', 'where should i invest'] },
  { type: 'comparison', patterns: ['compare', 'vs', 'difference between'] },
  { type: 'nav', patterns: ['nav', 'net asset value'] },
  { type: 'performance', patterns: ['performance', 'return', 'returns', 'cagr'] },
  { type: 'marketNews', patterns: ['market news', 'market update', 'market today', 'news'] },
  { type: 'fundDetails', patterns: ['fund details', 'scheme details'] },
  { type: 'amc', patterns: ['amc', 'fund house', 'asset management company'] },
  { type: 'risk', patterns: ['risk', 'risky', 'riskometer', 'volatility'] },
  { type: 'category', patterns: ['category', 'categories', 'large cap', 'flexi cap', 'hybrid', 'debt fund', 'elss'] },
  { type: 'sip', patterns: ['sip', 'systematic investment'] },
  { type: 'lumpsum', patterns: ['lumpsum', 'lump sum', 'one time investment'] },
  { type: 'taxation', patterns: ['tax', 'taxation', 'capital gains'] },
  { type: 'assetAllocation', patterns: ['asset allocation', 'allocation'] },
  { type: 'portfolio', patterns: ['portfolio', 'holdings'] },
  { type: 'exitLoad', patterns: ['exit load'] },
  { type: 'expenseRatio', patterns: ['expense ratio', 'fund fee'] },
  { type: 'kyc', patterns: ['kyc', 'know your customer'] },
  { type: 'distributors', patterns: ['distributor', 'advisor near me', 'agent near me'] },
  { type: 'dhanadaServices', patterns: ['dhanada', 'your services', 'what do you offer', 'services'] },
  { type: 'sif', patterns: ['sif', 'specialised investment fund', 'specialized investment fund'] },
  { type: 'mutualFunds', patterns: ['mutual fund', 'mutual funds'] },
  { type: 'advisorRequest', patterns: ['call me', 'contact me', 'advisor', 'reach out', 'connect me'] },
];

const DEFAULT_QUICK_REPLIES = [
  'Explain SIP vs lumpsum',
  'Compare two funds',
  'Show sample NAV',
  'Help me choose a fund',
];

function normalizeText(value) {
  return String(value || '').toLowerCase().trim();
}

function matchesShortReply(text, phrases) {
  const cleanText = text.replace(/[^a-z0-9]+/g, ' ').trim();
  return phrases.some((phrase) => cleanText === phrase);
}

function extractProfile(state, message) {
  const text = normalizeText(message);
  const profile = { ...state.profile };

  if (text.includes('retirement')) profile.goal = 'retirement';
  if (text.includes('education')) profile.goal = 'education';
  if (text.includes('tax')) profile.goal = 'tax saving';
  if (text.includes('wealth')) profile.goal = 'wealth creation';
  if (text.includes('house')) profile.goal = 'house purchase';

  if (text.includes('conservative') || text.includes('low risk')) profile.risk = 'conservative';
  if (text.includes('moderate') || text.includes('balanced')) profile.risk = 'moderate';
  if (text.includes('aggressive') || text.includes('high risk')) profile.risk = 'aggressive';

  if (text.includes('sip')) profile.mode = 'sip';
  if (text.includes('lumpsum') || text.includes('lump sum')) profile.mode = 'lumpsum';

  const yearsMatch = text.match(/(\d+)\s*(year|years|yr|yrs)/);
  if (yearsMatch) {
    profile.horizonYears = Number(yearsMatch[1]);
  }

  const hasAmountCue =
    /(?:rs\.?|inr|₹|lakh|lakhs|thousand|amount|invest|investment|monthly|month)/.test(text);
  const amountMatch = text.match(/(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]+)?)\s*(lakh|lakhs|k|thousand)?/);
  if (hasAmountCue && amountMatch) {
    const base = Number(amountMatch[1]);
    const unit = amountMatch[2];

    if (unit === 'lakh' || unit === 'lakhs') profile.amount = base * 100000;
    else if (unit === 'k' || unit === 'thousand') profile.amount = base * 1000;
    else if (base >= 500) profile.amount = base;
  }

  state.profile = profile;
}

function formatComparison(result) {
  const [first, second] = result.funds;

  return [
    `${first.name} vs ${second.name}:`,
    `Category: ${first.category} vs ${second.category}`,
    `Risk: ${first.risk} vs ${second.risk}`,
    `Expense ratio: ${first.expenseRatio} vs ${second.expenseRatio}`,
    `1Y return: ${first.performance.oneYear} vs ${second.performance.oneYear}`,
    `Exit load: ${first.exitLoad} vs ${second.exitLoad}`,
    result.summary,
  ].join('\n');
}

function formatRecommendation(result, profile) {
  const profileLineParts = [];

  if (profile.goal) profileLineParts.push(`goal: ${profile.goal}`);
  if (profile.risk) profileLineParts.push(`risk: ${profile.risk}`);
  if (profile.horizonYears) profileLineParts.push(`horizon: ${profile.horizonYears} years`);
  if (profile.mode) profileLineParts.push(`mode: ${profile.mode}`);

  const heading = profileLineParts.length
    ? `Based on your ${profileLineParts.join(', ')}, here is a good starting point:`
    : 'Here is a good sample starting point:';

  const fundLines = result.suggestions
    .map((fund) => `• ${fund.name} - ${fund.category}, ${fund.risk} risk, suitable for ${fund.suitableFor.toLowerCase()}`)
    .join('\n');

  const rationale = result.rationale.map((item) => `• ${item}`).join('\n');

  return [heading, fundLines, '', rationale, '', result.summary].join('\n');
}

function chooseOffer(state) {
  return {
    id: 'advisor_connect',
    prompt: "Hey wait a minute😯! An advisor is available.\n\nWould you like me to connect you with them for personalized guidance?",
  };
}

function getQuickReplies(state) {
  if (state.leadStep === LEAD_STEPS.NAME || state.leadStep === LEAD_STEPS.PHONE || state.leadStep === LEAD_STEPS.EMAIL || state.leadStep === LEAD_STEPS.PHONE_THEN_EMAIL) {
    return [];
  }

  if (state.leadStep === LEAD_STEPS.CONTACT_PREF) {
    return ['📞 Phone', '📧 Email', '📞📧 Both'];
  }

  if (state.awaitingRecommendationDetails) {
    return ['Moderate risk', '5 year horizon', 'Monthly SIP'];
  }

  if (state.pendingOffer) {
    return ['Yes, please', 'Not now'];
  }

  if (state.currentTopic === 'comparison') {
    return ['Compare Horizon vs Cedar', 'Compare Zenith vs Prism', 'Show sample NAV'];
  }

  if (state.currentTopic === 'sip') {
    return ['How SIP works', 'SIP vs lumpsum', 'Best fund for SIP'];
  }

  return DEFAULT_QUICK_REPLIES;
}

class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  get(sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        history: [],
        helpfulTurns: 0,
        turnCount: 0,
        currentTopic: null,
        pendingOffer: null,
        advisorOffered: false,
        advisorDeclined: false,
        lastOfferTurn: 0,
        leadStep: LEAD_STEPS.NONE,
        leadCaptured: false,
        collected: {
          name: null,
          phone: null,
          email: null,
        },
        profile: {
          goal: null,
          risk: null,
          horizonYears: null,
          amount: null,
          mode: null,
        },
        awaitingRecommendationDetails: false,
      });
    }

    return this.sessions.get(sessionId);
  }
}

class Chatbot {
  constructor({ sessionStore = new SessionStore() } = {}) {
    this.sessionStore = sessionStore;
    this.sessionQueue = new Map();
  }

  async processMessage(sessionId, message) {
    const previousTask = this.sessionQueue.get(sessionId) || Promise.resolve();
    const currentTask = previousTask.catch(() => { }).then(() => this.processMessageInternal(sessionId, message));

    this.sessionQueue.set(sessionId, currentTask);

    try {
      return await currentTask;
    } finally {
      if (this.sessionQueue.get(sessionId) === currentTask) {
        this.sessionQueue.delete(sessionId);
      }
    }
  }

  async processMessageInternal(sessionId, message) {
    const state = this.sessionStore.get(sessionId);
    const cleanMessage = String(message || '').trim();

    state.turnCount += 1;
    state.history.push({
      role: 'user',
      text: cleanMessage,
      at: new Date().toISOString(),
    });

    const intent = this.detectIntent(cleanMessage);
    const isNewTopic = !['unknown', 'affirmative', 'negative', 'thanks'].includes(intent);

    if (state.pendingOffer && isNewTopic) {
      state.pendingOffer = null;
    }

    if (state.leadStep !== LEAD_STEPS.NONE && state.leadStep !== LEAD_STEPS.DONE) {
      if (isNewTopic || intent === 'negative') {
        state.leadStep = LEAD_STEPS.NONE;
        if (intent === 'negative') state.advisorDeclined = true;
      }
    }

    if (state.awaitingRecommendationDetails && isNewTopic) {
      state.awaitingRecommendationDetails = false;
    }

    let reply;

    if (!cleanMessage) {
      reply = 'Please type your question and I will help.';
    } else if (state.leadStep !== LEAD_STEPS.NONE && state.leadStep !== LEAD_STEPS.DONE) {
      reply = await this.continueLeadFlow(state, cleanMessage);
    } else if (state.pendingOffer && matchesShortReply(normalizeText(cleanMessage), AFFIRMATIVE)) {
      reply = this.startLeadFlow(state);
    } else if (state.pendingOffer && matchesShortReply(normalizeText(cleanMessage), NEGATIVE)) {
      state.pendingOffer = null;
      state.advisorDeclined = true;
      reply = "No worries 😊\n\nKeep learning.\nKeep investing wisely.\n\nWhenever you need help, I'm here.";
    } else if (state.awaitingRecommendationDetails) {
      extractProfile(state, cleanMessage);
      reply = this.handleRecommendation(state);
    } else {
      extractProfile(state, cleanMessage);
      reply = await this.handleIntent(state, cleanMessage);
    }

    state.history.push({
      role: 'bot',
      text: reply,
      at: new Date().toISOString(),
    });

    if (state.history.length > 40) {
      state.history = state.history.slice(-40);
    }

    return {
      reply,
      history: state.history,
      state: this.publicState(state),
      quickReplies: getQuickReplies(state),
    };
  }

  publicState(state) {
    return {
      helpfulTurns: state.helpfulTurns,
      currentTopic: state.currentTopic,
      leadStep: state.leadStep,
      leadCaptured: state.leadCaptured,
      collected: {
        name: state.collected.name,
        phone: state.collected.phone,
        email: state.collected.email,
      },
      profile: state.profile,
      pendingOffer: state.pendingOffer ? state.pendingOffer.id : null,
    };
  }

  detectIntent(message) {
    const text = normalizeText(message);

    if (matchesShortReply(text, GREETINGS)) return 'greeting';
    if (matchesShortReply(text, THANKS)) return 'thanks';
    if (matchesShortReply(text, AFFIRMATIVE)) return 'affirmative';
    if (matchesShortReply(text, NEGATIVE)) return 'negative';

    for (const item of TOPIC_PATTERNS) {
      if (item.patterns.some((pattern) => text.includes(pattern))) {
        return item.type;
      }
    }

    if (knowledgeService.getFundDetails(message).status === 'ok') {
      return 'fundDetails';
    }

    return 'unknown';
  }

  async handleIntent(state, message) {
    const intent = this.detectIntent(message);

    if (intent !== 'unknown') {
      console.log(`[LOCAL] Responding to intent: ${intent}`);
    }

    switch (intent) {
      case 'greeting':
        return 'Hi! I am Dhanada, your investment assistant. How can I help you today?';

      case 'thanks':
        return 'Happy to help 😊';

      case 'affirmative':
        return 'Great! What would you like to explore next?';

      case 'negative':
        return 'No problem 😊';

      case 'recommendation':
        state.currentTopic = 'recommendation';
        return this.handleRecommendation(state);

      case 'comparison':
        state.currentTopic = 'comparison';
        return this.answerAndMaybeOffer(state, this.handleComparison(message), true);

      case 'nav':
        state.currentTopic = 'nav';
        return this.answerAndMaybeOffer(state, this.handleNAV(message), true);

      case 'performance':
        state.currentTopic = 'performance';
        return this.answerAndMaybeOffer(state, this.handlePerformance(message), true);

      case 'marketNews':
        state.currentTopic = 'marketNews';
        return this.answerAndMaybeOffer(state, this.handleMarketNews(), true);

      case 'fundDetails':
        state.currentTopic = 'fundDetails';
        return this.answerAndMaybeOffer(state, this.handleFundDetails(message), true);

      case 'amc':
        state.currentTopic = 'amc';
        return this.answerAndMaybeOffer(state, this.handleAMC(message), true);

      case 'risk':
        state.currentTopic = 'risk';
        return this.answerAndMaybeOffer(state, this.handleRisk(message), true);

      case 'category':
        state.currentTopic = 'category';
        return this.answerAndMaybeOffer(state, this.handleCategory(message), true);

      case 'sip':
        state.currentTopic = 'sip';
        return this.answerAndMaybeOffer(state, this.handleGuide('sip'), true);

      case 'lumpsum':
        state.currentTopic = 'lumpsum';
        return this.answerAndMaybeOffer(state, this.handleGuide('lumpsum'), true);

      case 'taxation':
        state.currentTopic = 'taxation';
        return this.answerAndMaybeOffer(state, this.handleGuide('taxation'), true);

      case 'assetAllocation':
        state.currentTopic = 'assetAllocation';
        return this.answerAndMaybeOffer(state, this.handleGuide('assetAllocation'), true);

      case 'portfolio':
        state.currentTopic = 'portfolio';
        return this.answerAndMaybeOffer(state, this.handleGuide('portfolio'), true);

      case 'exitLoad':
        state.currentTopic = 'exitLoad';
        return this.answerAndMaybeOffer(state, this.handleGuide('exitLoad'), true);

      case 'expenseRatio':
        state.currentTopic = 'expenseRatio';
        return this.answerAndMaybeOffer(state, this.handleGuide('expenseRatio'), true);

      case 'kyc':
        state.currentTopic = 'kyc';
        return this.answerAndMaybeOffer(state, this.handleGuide('kyc'), true);

      case 'distributors':
        state.currentTopic = 'distributors';
        return this.answerAndMaybeOffer(state, this.handleDistributors(message), true);

      case 'dhanadaServices':
        state.currentTopic = 'dhanadaServices';
        return this.answerAndMaybeOffer(state, this.handleServices(), true);

      case 'sif':
        state.currentTopic = 'sif';
        return this.answerAndMaybeOffer(state, this.handleGuide('sif'), true);

      case 'mutualFunds':
        state.currentTopic = 'mutualFunds';
        return this.answerAndMaybeOffer(state, this.handleGuide('mutualFunds'), true);

      case 'advisorRequest':
        state.currentTopic = 'dhanadaServices';
        state.pendingOffer = { id: 'advisor_connect', prompt: '' };
        return this.startLeadFlow(state, 'I can arrange that. ');

      default:
        return await this.handleUnknown(state, message);
    }
  }

  answerAndMaybeOffer(state, answer, helpful) {
    if (helpful) {
      state.helpfulTurns += 1;
    }

    if (!this.shouldOfferLead(state)) {
      return answer;
    }

    const offer = chooseOffer(state);
    state.pendingOffer = offer;
    state.advisorOffered = true;
    state.lastOfferTurn = state.turnCount;

    return `${answer}\n\n${offer.prompt}`;
  }

  shouldOfferLead(state) {
    if (state.leadCaptured) return false;
    if (state.advisorDeclined) return false;
    if (state.advisorOffered) return false;
    if (state.pendingOffer) return false;
    if (state.leadStep !== LEAD_STEPS.NONE && state.leadStep !== LEAD_STEPS.DONE) return false;
    if (state.helpfulTurns < 1) return false;
    return true;
  }

  handleGuide(key) {
    const guide = knowledgeService.getGuideByKey(key);

    if (!guide) {
      return 'I can explain that topic in simple terms if you tell me the exact area.';
    }

    return `${guide.title}: ${guide.summary}`;
  }

  handleFundDetails(message) {
    const result = knowledgeService.getFundDetails(message);

    if (result.status !== 'ok') {
      return `${result.message}\nSample schemes: ${result.availableFunds.join(', ')}`;
    }

    const { fund } = result;
    return [
      `${fund.name}:`,
      `Category: ${fund.category}`,
      `AMC: ${fund.amc}`,
      `Risk: ${fund.risk}`,
      `Expense ratio: ${fund.expenseRatio}`,
      `Exit load: ${fund.exitLoad}`,
      `Best fit: ${fund.suitableFor}`,
      result.note,
    ].join('\n');
  }

  handleNAV(message) {
    const result = knowledgeService.getNAV(message);

    if (result.status !== 'ok') {
      return `${result.message}\nSample schemes: ${result.availableFunds.join(', ')}`;
    }

    return `${result.fundName} has a sample NAV of ${result.nav} as of ${result.asOf}. ${result.note}`;
  }

  handleAMC(message) {
    const result = knowledgeService.getAMC(message);

    if (result.status !== 'ok') {
      return `${result.message}\nSample AMCs: ${result.availableAMCs.join(', ')}`;
    }

    return [
      `${result.amc.name}: ${result.amc.summary}`,
      `Strengths: ${result.amc.strengths.join(', ')}`,
    ].join('\n');
  }

  handleRisk(message) {
    const result = knowledgeService.getRisk(message);

    if (result.mode === 'fund') {
      return result.summary;
    }

    return `A simple risk view:\n${result.bands.map((item) => `• ${item}`).join('\n')}`;
  }

  handleCategory(message) {
    const result = knowledgeService.getCategory(message);

    if (result.category) {
      return `${String(result.category).toUpperCase()}: ${result.summary}`;
    }

    return `${result.summary}\nCommon options: ${result.categories.join(', ')}`;
  }

  handlePerformance(message) {
    const result = knowledgeService.getPerformance(message);

    if (result.status !== 'ok') {
      return `${result.message}\nSample schemes: ${result.availableFunds.join(', ')}`;
    }

    return [
      `${result.fundName} sample performance:`,
      `1Y: ${result.performance.oneYear}`,
      `3Y: ${result.performance.threeYear}`,
      `5Y: ${result.performance.fiveYear}`,
      result.note,
    ].join('\n');
  }

  handleMarketNews() {
    const result = knowledgeService.getMarketNews();
    const items = result.items.map((item) => `• ${item.headline}: ${item.summary}`).join('\n');
    return `Sample market snapshot as of ${result.asOf}:\n${items}\n${result.note}`;
  }

  handleDistributors(message) {
    const result = knowledgeService.getDistributor(message);
    return `Here are sample Dhanada advisor options for ${result.city}:\n${result.options.map((item) => `• ${item}`).join('\n')}`;
  }

  handleServices() {
    const result = knowledgeService.getPlatformOverview();
    return `${result.summary}\nServices:\n${result.services.map((item) => `• ${item}`).join('\n')}`;
  }

  handleComparison(message) {
    const result = knowledgeService.compareFunds(message);

    if (result.status !== 'ok') {
      return `${result.message}\nSample schemes: ${result.availableFunds.join(', ')}`;
    }

    return formatComparison(result);
  }

  handleRecommendation(state) {
    const profile = state.profile;

    if (!profile.risk || !profile.horizonYears) {
      state.awaitingRecommendationDetails = true;
      return 'I can help with that. Please share your risk level and time horizon, for example: moderate risk, 5 years, SIP.';
    }

    state.awaitingRecommendationDetails = false;
    const result = knowledgeService.getRecommendation(profile);
    return this.answerAndMaybeOffer(state, formatRecommendation(result, profile), true);
  }

  async handleUnknown(state, message) {
    if (state.currentTopic === 'recommendation') {
      return 'Please share your risk level and horizon so I can make a good suggestion 😊';
    }

    const localFallback = 'I can help with SIP, mutual funds, risk, tax, and more. What would you like to know?';

    if (!aiClient) {
      console.log('[FALLBACK] Gemini client not initialized.');
      return localFallback;
    }

    try {
      const systemInstruction = `You are Dhanada, a friendly, professional investment assistant for Dhanada Specialized Investment Fund.
Answer questions about Mutual Funds, SIP, NAV, Tax, Risk, Asset Allocation, Retirement, Investing, Wealth Creation, Financial Planning, and General Finance.
Keep answers short, friendly, professional, and easy to understand.
NEVER mention AI, Gemini, or that you are a large language model.
If the user asks something completely unrelated to finance, politely steer them back.`;

      const contents = state.history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const requestTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 10000)
      );

      const apiCall = aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: { parts: [{ text: systemInstruction }] },
          temperature: 0.3,
        }
      });

      const response = await Promise.race([apiCall, requestTimeout]);

      if (response && response.text && response.text.trim().length > 0) {
        console.log('[GEMINI] Answered successfully.');
        return this.answerAndMaybeOffer(state, response.text.trim(), true);
      } else {
        console.log('[FALLBACK] Gemini returned empty response.');
        return localFallback;
      }
    } catch (error) {
      console.log('[FALLBACK] Gemini failed:', error.message);
      return "I'm unable to fetch that information right now. Please try again in a moment.";
    }
  }

  startLeadFlow(state, prefix = '') {
    state.pendingOffer = null;

    if (!state.collected.name) {
      state.leadStep = LEAD_STEPS.NAME;
      return `${prefix}Awesome 😊\n\nWhat name should I tell our advisor?`;
    }

    state.leadStep = LEAD_STEPS.CONTACT_PREF;
    return `${prefix}Nice to meet you ${state.collected.name}! 😊\n\nHow would you like our advisor to reach you?`;
  }

  async continueLeadFlow(state, message) {
    const text = normalizeText(message);

    if (state.leadStep === LEAD_STEPS.NAME) {
      const check = leadManager.validateName(message);
      if (!check.valid) return check.message;

      state.collected.name = check.value;
      state.leadStep = LEAD_STEPS.CONTACT_PREF;
      return `Nice to meet you ${check.value}! 😊\n\nHow would you like our advisor to reach you?`;
    }

    if (state.leadStep === LEAD_STEPS.CONTACT_PREF) {
      if (text.includes('both')) {
        state.leadStep = LEAD_STEPS.PHONE_THEN_EMAIL;
        return 'Please enter your phone number first 📞';
      } else if (text.includes('phone')) {
        state.leadStep = LEAD_STEPS.PHONE;
        return 'Please enter your phone number 📞';
      } else if (text.includes('email')) {
        state.leadStep = LEAD_STEPS.EMAIL;
        return 'Please enter your email address 📧';
      } else {
        return 'Please select an option below.';
      }
    }

    if (state.leadStep === LEAD_STEPS.PHONE) {
      const check = leadManager.validatePhone(message);
      if (!check.valid) return check.message;

      state.collected.phone = check.value;
      return await this.saveCompletedLead(state);
    }

    if (state.leadStep === LEAD_STEPS.EMAIL) {
      const check = leadManager.validateEmail(message);
      if (!check.valid) return check.message;

      state.collected.email = check.value;
      return await this.saveCompletedLead(state);
    }

    if (state.leadStep === LEAD_STEPS.PHONE_THEN_EMAIL) {
      const check = leadManager.validatePhone(message);
      if (!check.valid) return check.message;

      state.collected.phone = check.value;
      state.leadStep = LEAD_STEPS.EMAIL;
      return 'Got it 👍 Now, please enter your email address 📧';
    }

    return 'Please continue.';
  }

  async saveCompletedLead(state) {
    console.log("Received lead:", state.collected);
    const saveResult = await leadManager.saveLead({
      phone: state.collected.phone,
      name: state.collected.name,
      email: state.collected.email,
      source: 'Website Chatbot',
      interest: state.currentTopic,
      notes: ['Lead completed from chatbot conversation'],
    });

    if (!saveResult.success) {
      console.error('Lead saving failed:', saveResult.message);
      return 'Oops! Something went wrong saving your contact info. Please try again.';
    }

    state.leadStep = LEAD_STEPS.DONE;
    state.leadCaptured = true;

    return `Awesome ${state.collected.name}! 😊\n\nOur advisor will connect with you shortly.\n\nMeanwhile, I'm always here if you have more questions.`;
  }
}

module.exports = {
  Chatbot,
  SessionStore,
  LEAD_STEPS,
};
