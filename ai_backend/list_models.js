const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function listModels() {
  const response = await ai.models.list();
  for (const model of response) {
    if (model.supportedActions && model.supportedActions.includes('generateContent')) {
      console.log(model.name);
    }
  }
}

listModels().catch(console.error);
