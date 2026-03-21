import { motion } from 'framer-motion';
import { Sparkles, Target, ListChecks, Clock, ArrowRight, History } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
  onViewHistory: () => void;
}

export default function Landing({ onGetStarted, onViewHistory }: LandingProps) {
  const features = [
    {
      icon: Target,
      title: 'Clarify Your Goal',
      description: 'Transform vague ideas into crystal-clear objectives'
    },
    {
      icon: ListChecks,
      title: 'Structure Your Plan',
      description: 'Get actionable steps organized by priority'
    },
    {
      icon: Clock,
      title: 'Identify Gaps',
      description: 'Discover what\'s missing in your plan before you start'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Plan4U
          </h1>
        </div>
        
        <p className="text-xl text-gray-400 mb-4">
          AI-Powered Clarity & Structuring Tool
        </p>
        
        <p className="text-gray-500 mb-12 max-w-xl mx-auto">
          Have a vague idea or unstructured plan? Our AI chatbot will ask you the right questions 
          to help clarify, structure, and identify gaps in your thinking.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-left"
            >
              <div className="p-2 bg-purple-500/20 rounded-lg w-fit mb-4">
                <feature.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewHistory}
            className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl font-semibold text-gray-300 flex items-center gap-2 hover:bg-gray-700 transition-colors"
          >
            <History className="w-5 h-5" />
            View History
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
