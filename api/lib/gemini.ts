import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export function getGeminiModel() {
  if (!GEMINI_API_KEY) {
    throw new Error('Please define the GEMINI_API_KEY environment variable');
  }
  
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
}

export const QUIZ_PROMPT = `You are an AI assistant helping users clarify their ideas and plans. 
The user has shared a raw, potentially vague idea. Your job is to generate exactly 5 targeted clarifying questions that will help extract structured information.

Each question should focus on one of these categories (one question per category):
1. GOAL - What exactly do they want to achieve? What does success look like?
2. METHOD - How do they plan to accomplish this? What approach?
3. STEPS - What specific actions will they take? In what order?
4. TIMELINE - When do they want to start/finish? Any deadlines?
5. RESOURCES - What do they need? Money, skills, tools, people?

USER'S RAW IDEA:
"{idea}"

Respond with ONLY valid JSON in this exact format:
{
  "questions": [
    {"id": 1, "category": "goal", "question": "Your question here"},
    {"id": 2, "category": "method", "question": "Your question here"},
    {"id": 3, "category": "steps", "question": "Your question here"},
    {"id": 4, "category": "timeline", "question": "Your question here"},
    {"id": 5, "category": "resources", "question": "Your question here"}
  ]
}`;

export const ANALYSIS_PROMPT = `You are an expert plan analyst and clarity coach. Analyze the user's idea along with their answers to clarifying questions.

ORIGINAL IDEA:
"{idea}"

CLARIFYING Q&A:
{qa}

Based on this information, provide a comprehensive analysis. Be specific and actionable.

SCORING LOGIC (explain to user):
- Goal Clarity (0-25): Is the goal specific, measurable, and well-defined?
- Steps Definition (0-25): Are there clear, actionable steps identified?
- Timeline Presence (0-25): Is there a realistic timeline or deadlines?
- Plan Completeness (0-25): Are resources, methods, and contingencies addressed?

Respond with ONLY valid JSON in this exact format:
{
  "structuredPlan": {
    "goal": "Clear, specific goal statement",
    "method": "The approach/strategy they will use",
    "steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
    "timeline": "Specific timeline or 'Not defined' if missing"
  },
  "missingElements": [
    {"category": "Category name", "description": "What's missing", "severity": "high|medium|low"}
  ],
  "simplifiedVersion": "A clear, concise 2-3 sentence version of their plan",
  "actionableSteps": [
    {"step": "Specific action to take", "priority": "high|medium|low", "timeframe": "When to do it"}
  ],
  "clarityScore": {
    "total": 65,
    "breakdown": {
      "goalClarity": 20,
      "stepsDefinition": 15,
      "timelinePresence": 10,
      "planCompleteness": 20
    },
    "explanation": "Brief explanation of the score"
  },
  "beforeAfter": {
    "before": "The original vague idea",
    "after": "The clarified, structured version"
  }
}`;
