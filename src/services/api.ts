import { QuizQuestion, QAPair, AnalysisResult, HistoryItem } from '../types';

export async function generateQuizQuestions(idea: string): Promise<QuizQuestion[]> {
  const response = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea })
  });

  if (!response.ok) {
    throw new Error('Failed to generate questions');
  }

  const data = await response.json();
  return data.questions;
}

export async function analyzeIdea(idea: string, answers: QAPair[]): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, answers })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze plan');
  }

  return response.json();
}

export async function getHistory(): Promise<HistoryItem[]> {
  const response = await fetch('/api/history');

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.history || [];
}
