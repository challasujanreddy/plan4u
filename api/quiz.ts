import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiModel, QUIZ_PROMPT } from './lib/gemini.js';

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
    const { idea } = req.body;

    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'Idea is required' });
    }

    const model = getGeminiModel();
    const prompt = QUIZ_PROMPT.replace('{idea}', idea);
    
    // 1. Create an 8-second timeout safeguard
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API timeout exceeded')), 8000);
    });

    // 2. Race the Gemini API call against our timeout
    // If Gemini takes longer than 8 seconds, it throws an error and jumps to the catch block
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]) as any; 
    
    const response = await result.response;
    let text = response.text();
    
    // 3. Clean up the text just in case Gemini wrapped it in markdown code blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const data = JSON.parse(jsonMatch[0]);
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Quiz generation error:', error);
    
    // Return fallback questions if AI fails OR if it times out
    return res.status(200).json({
      questions: [
        { id: 1, category: 'goal', question: 'What specific outcome do you want to achieve? How will you know when you\'ve succeeded?' },
        { id: 2, category: 'method', question: 'What approach or strategy do you plan to use to achieve this?' },
        { id: 3, category: 'steps', question: 'What are the first 3-5 concrete actions you need to take?' },
        { id: 4, category: 'timeline', question: 'When do you want to start, and what\'s your target completion date?' },
        { id: 5, category: 'resources', question: 'What resources (money, skills, tools, people) do you need?' }
      ]
    });
  }
}