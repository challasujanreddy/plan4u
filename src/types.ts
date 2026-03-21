export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
}

export interface QAPair {
  question: string;
  answer: string;
  category: string;
}

export interface StructuredPlan {
  goal: string;
  method: string;
  steps: string[];
  timeline: string;
}

export interface MissingElement {
  category: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ActionableStep {
  step: string;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
}

export interface ClarityScoreData {
  total: number;
  breakdown: {
    goalClarity: number;
    stepsDefinition: number;
    timelinePresence: number;
    planCompleteness: number;
  };
  explanation: string;
}

export interface BeforeAfter {
  before: string;
  after: string;
}

export interface AnalysisResult {
  structuredPlan: StructuredPlan;
  missingElements: MissingElement[];
  simplifiedVersion: string;
  actionableSteps: ActionableStep[];
  clarityScore: ClarityScoreData;
  beforeAfter: BeforeAfter;
}

export interface HistoryItem {
  _id: string;
  idea: string;
  answers: QAPair[];
  analysis: AnalysisResult;
  createdAt: string;
}

export type AppPhase = 'landing' | 'input' | 'quiz' | 'analyzing' | 'results' | 'history';
