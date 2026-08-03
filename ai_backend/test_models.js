const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const candidateModels = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.5-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-3-flash',
  'gemini-3.1-flash-lite'
];

async function testModels() {
  const validModels = [];
  for (const model of candidateModels) {
    try {
      console.log(`Testing model: ${model}...`);
      const response = await aiClient.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
        config: { maxOutputTokens: 10 }
      });
      if (response && response.text) {
        console.log(`Success: ${model} -> ${response.text.replace(/\n/g, ' ')}`);
        validModels.push(model);
      }
    } catch (e) {
      console.log(`Failed: ${model} -> ${e.message}`);
    }
  }
  console.log('\nValid Models:', validModels);
}

testModels().catch(console.error);
