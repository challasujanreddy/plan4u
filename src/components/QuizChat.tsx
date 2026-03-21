import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { QuizQuestion, QAPair } from '../types';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  category?: string;
}

interface QuizChatProps {
  idea: string;
  questions: QuizQuestion[];
  onComplete: (answers: QAPair[]) => void;
  onBack: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  goal: '🎯 Goal',
  method: '🛠️ Method',
  steps: '📋 Steps',
  timeline: '⏰ Timeline',
  resources: '💰 Resources'
};

export default function QuizChat({ idea, questions, onComplete, onBack }: QuizChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState<QAPair[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Create variables to hold our timer IDs
    let introTimeout: NodeJS.Timeout;
    let questionTimeout: NodeJS.Timeout;

    setIsTyping(true);
    
    introTimeout = setTimeout(() => {
      setMessages([
        {
          id: 'intro',
          type: 'bot',
          content: `Great! I see you want to work on: "${idea}"\n\nI'll ask you 5 quick questions to help clarify your plan. Ready? Let's go! 🚀`
        }
      ]);
      setIsTyping(false);
      
      questionTimeout = setTimeout(() => {
        askQuestion(0);
      }, 1000);
    }, 1000);

    return () => {
      clearTimeout(introTimeout);
      clearTimeout(questionTimeout);
    };
  }, [idea]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const askQuestion = (index: number) => {
    if (index >= questions.length) return;
    
    setIsTyping(true);
    setTimeout(() => {
      const question = questions[index];
      setMessages(prev => [...prev, {
        id: `q-${index}`,
        type: 'bot',
        content: question.question,
        category: question.category
      }]);
      setIsTyping(false);
    }, 800);
  };

  const handleSendAnswer = () => {
    if (!inputValue.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    setMessages(prev => [...prev, {
      id: `a-${currentQuestionIndex}`,
      type: 'user',
      content: inputValue
    }]);

    const newAnswer: QAPair = {
      question: currentQuestion.question,
      answer: inputValue,
      category: currentQuestion.category
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setInputValue('');

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: 'complete',
          type: 'bot',
          content: "Perfect! I've got all the information I need. Let me analyze your plan and generate a comprehensive breakdown... 🔍"
        }]);
        setIsTyping(false);
        
        setTimeout(() => {
          onComplete(newAnswers);
        }, 1500);
      }, 800);
    } else {
      setIsTyping(true);
      const encouragements = ["Got it!", "Nice!", "Great!", "Thanks!", "Perfect!"];
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `enc-${currentQuestionIndex}`,
          type: 'bot',
          content: encouragements[currentQuestionIndex % encouragements.length]
        }]);
        setCurrentQuestionIndex(nextIndex);
        setTimeout(() => askQuestion(nextIndex), 500);
      }, 500);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4 transition-colors"
          >
            ← Back
          </button>
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">Clarity Quiz</h2>
            <span className="text-sm text-gray-400">
              Question {Math.min(currentQuestionIndex + 1, questions.length)} of {questions.length}
            </span>
          </div>
          
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="flex-1 bg-gray-800/50 border border-gray-700 rounded-2xl p-4 overflow-y-auto mb-4 max-h-[60vh]">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 mb-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`p-2 rounded-full h-fit ${
                  message.type === 'bot' 
                    ? 'bg-purple-500/20' 
                    : 'bg-blue-500/20'
                }`}>
                  {message.type === 'bot' 
                    ? <Bot className="w-5 h-5 text-purple-400" />
                    : <User className="w-5 h-5 text-blue-400" />
                  }
                </div>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                  {message.category && (
                    <span className="text-xs text-gray-500 mb-1 block">
                      {CATEGORY_LABELS[message.category] || message.category}
                    </span>
                  )}
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.type === 'bot'
                      ? 'bg-gray-700 text-white'
                      : 'bg-purple-500 text-white'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="p-2 bg-purple-500/20 rounded-full h-fit">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <div className="bg-gray-700 p-4 rounded-2xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendAnswer()}
            placeholder="Type your answer..."
            disabled={isTyping || currentQuestionIndex >= questions.length}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none disabled:opacity-50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendAnswer}
            disabled={!inputValue.trim() || isTyping || currentQuestionIndex >= questions.length}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
