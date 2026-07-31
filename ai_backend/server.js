'use strict';

const crypto = require('crypto');
const path = require('path');
const express = require('express');

const { Chatbot, SessionStore } = require('./chatbot');
const leadManager = require('./leadManager');

const PORT = Number(process.env.PORT) || 3405;

const app = express();
const sessionStore = new SessionStore();
const chatbot = new Chatbot({ sessionStore });

app.disable('x-powered-by');
app.use(express.json({ limit: '200kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'dhanada-chatbot',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/leads', async (req, res, next) => {
  try {
    const leads = await leadManager.getAllLeads();
    res.json({
      count: Object.keys(leads).length,
      leads,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/lead', async (req, res) => {
  const payload = {
    phone: req.body?.phone,
    name: req.body?.name,
    email: req.body?.email,
    source: req.body?.source || 'Website Chatbot',
    interest: req.body?.interest || null,
    notes: Array.isArray(req.body?.notes) ? req.body.notes : [],
  };

  const result = await leadManager.saveLead(payload);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
});

app.post('/api/chat', async (req, res, next) => {
  try {
    const message = String(req.body?.message || '').trim();
    const incomingSessionId = String(req.body?.sessionId || '').trim();
    const sessionId = incomingSessionId || crypto.randomUUID();

    const result = await chatbot.processMessage(sessionId, message);
    res.json({
      sessionId,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message =
    statusCode >= 500 ? 'Something went wrong on the server.' : error.message || 'Request failed.';

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Dhanada chatbot running at http://localhost:${PORT}`);
});
