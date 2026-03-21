import { useState } from 'react';
import { AppPhase, QuizQuestion, QAPair, AnalysisResult } from './types';
import { generateQuizQuestions, analyzeIdea } from './services/api';
import Landing from './components/Landing';
import IdeaInput from './components/IdeaInput';
import QuizChat from './components/QuizChat';
import AnalyzingScreen from './components/AnalyzingScreen';
import AnalysisDashboard from './components/AnalysisDashboard';
import History from './components/History';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('landing');
  const [idea, setIdea] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetStarted = () => {
    setPhase('input');
  };

  const handleViewHistory = () => {
    setPhase('history');
  };

  const handleIdeaSubmit = async (userIdea: string) => {
    setIdea(userIdea);
    setError(null);
    
    try {
      // Generate quiz questions
      const quizQuestions = await generateQuizQuestions(userIdea);
      setQuestions(quizQuestions);
      setPhase('quiz');
    } catch (err) {
      console.error('Failed to generate questions:', err);
      // Use fallback questions
      setQuestions([
        { id: 1, category: 'goal', question: 'What specific outcome do you want to achieve? How will you measure success?' },
        { id: 2, category: 'method', question: 'What approach or strategy do you plan to use?' },
        { id: 3, category: 'steps', question: 'What are the first 3-5 concrete actions you need to take?' },
        { id: 4, category: 'timeline', question: 'When do you want to start, and what\'s your target completion date?' },
        { id: 5, category: 'resources', question: 'What resources (money, skills, tools, people) do you need?' }
      ]);
      setPhase('quiz');
    }
  };

  const handleQuizComplete = async (answers: QAPair[]) => {
    setPhase('analyzing');
    setError(null);

    try {
      const analysisResult = await analyzeIdea(idea, answers);
      setResult(analysisResult);
      setPhase('results');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze your plan. Please try again.');
      setPhase('input');
    }
  };

  const handleModify = () => {
    setPhase('input');
  };

  const handleStartOver = () => {
    setIdea('');
    setQuestions([]);
    setResult(null);
    setError(null);
    setPhase('landing');
  };

  const handleViewResult = (analysisResult: AnalysisResult, originalIdea: string) => {
    setResult(analysisResult);
    setIdea(originalIdea);
    setPhase('results');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {phase === 'landing' && (
        <Landing 
          onGetStarted={handleGetStarted} 
          onViewHistory={handleViewHistory}
        />
      )}

      {phase === 'input' && (
        <IdeaInput 
          onSubmit={handleIdeaSubmit}
          onBack={handleStartOver}
        />
      )}

      {phase === 'quiz' && questions.length > 0 && (
        <QuizChat
          idea={idea}
          questions={questions}
          onComplete={handleQuizComplete}
          onBack={() => setPhase('input')}
        />
      )}

      {phase === 'analyzing' && (
        <AnalyzingScreen />
      )}

      {phase === 'results' && result && (
        <AnalysisDashboard
          result={result}
          originalIdea={idea}
          onModify={handleModify}
        />
      )}

      {phase === 'history' && (
        <History
          onBack={handleStartOver}
          onViewResult={handleViewResult}
        />
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
