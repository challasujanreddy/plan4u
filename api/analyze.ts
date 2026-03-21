import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiModel, ANALYSIS_PROMPT } from './lib/gemini.js';
import { connectToDatabase } from './lib/mongodb.js';

interface QAPair {
  question: string;
  answer: string;
  category: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idea, answers } = req.body;

    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'Idea is required' });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers are required' });
    }

    // Format Q&A for prompt
    const qaFormatted = answers
      .map((qa: QAPair, i: number) => `Q${i + 1} (${qa.category}): ${qa.question}\nA${i + 1}: ${qa.answer}`)
      .join('\n\n');

    const model = getGeminiModel();
    const prompt = ANALYSIS_PROMPT
      .replace('{idea}', idea)
      .replace('{qa}', qaFormatted);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);

    // Save to MongoDB
    try {
      const { db } = await connectToDatabase();
      await db.collection('analyses').insertOne({
        idea,
        answers,
        analysis,
        createdAt: new Date()
      });
    } catch (dbError) {
      console.error('MongoDB save error:', dbError);
      // Continue even if DB save fails
    }
    
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze plan' });
  }
}
