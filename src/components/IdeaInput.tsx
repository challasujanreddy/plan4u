import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
  onBack: () => void;
}

const EXAMPLE_IDEAS = [
  "I want to start a YouTube channel and earn money quickly",
  "I'm thinking of launching an online course about coding",
  "I want to get healthier and lose weight this year",
  "I have an app idea that could help students study better",
  "I want to switch careers and become a data scientist"
];

export default function IdeaInput({ onSubmit, onBack }: IdeaInputProps) {
  const [idea, setIdea] = useState('');

  const handleSubmit = () => {
    if (idea.trim()) {
      onSubmit(idea.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setIdea(example);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white mb-8 transition-colors"
        >
          ← Back to home
        </button>

        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">What's your idea or plan?</h2>
          </div>

          <p className="text-gray-400 mb-6">
            Don't worry about being perfect — just describe your idea in your own words. 
            Our AI will help you clarify and structure it.
          </p>

          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., I want to start a YouTube channel and earn money quickly..."
            className="w-full h-40 bg-gray-900 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none mb-6"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!idea.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5" />
            Start Clarity Quiz
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-500 mb-3">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_IDEAS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-lg transition-colors"
                >
                  {example.slice(0, 40)}...
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
