import { motion } from 'framer-motion';
import { Loader2, Brain, Target, ListChecks, Clock, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const steps = [
  { icon: Brain, label: 'Analyzing your responses...' },
  { icon: Target, label: 'Extracting goal & method...' },
  { icon: ListChecks, label: 'Identifying action steps...' },
  { icon: Clock, label: 'Calculating clarity score...' },
  { icon: CheckCircle2, label: 'Generating recommendations...' }
];

export default function AnalyzingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
        >
          <Loader2 className="w-10 h-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-4">
          Analyzing Your Plan
        </h2>
        <p className="text-gray-400 mb-8">
          Our AI is structuring your idea into actionable insights...
        </p>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.3,
                x: 0 
              }}
              transition={{ delay: index * 0.2 }}
              className={`flex items-center gap-3 text-left p-3 rounded-lg ${
                index === currentStep 
                  ? 'bg-purple-500/20 border border-purple-500/50' 
                  : index < currentStep 
                    ? 'bg-green-500/10' 
                    : 'bg-gray-800/50'
              }`}
            >
              <step.icon className={`w-5 h-5 ${
                index === currentStep 
                  ? 'text-purple-400' 
                  : index < currentStep 
                    ? 'text-green-400' 
                    : 'text-gray-500'
              }`} />
              <span className={
                index <= currentStep ? 'text-white' : 'text-gray-500'
              }>
                {step.label}
              </span>
              {index < currentStep && (
                <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
