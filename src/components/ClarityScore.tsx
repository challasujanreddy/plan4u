import { motion } from 'framer-motion';
import { ClarityScoreData } from '../types';

interface ClarityScoreProps {
  score: ClarityScoreData;
}

export default function ClarityScore({ score }: ClarityScoreProps) {
  const getScoreColor = (value: number, max: number = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 70) return 'text-green-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (value: number) => {
    if (value >= 70) return 'from-green-500 to-emerald-500';
    if (value >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score.total / 100) * circumference;

  const categories = [
    { key: 'goalClarity', label: 'Goal Clarity', value: score.breakdown.goalClarity },
    { key: 'stepsDefinition', label: 'Steps Definition', value: score.breakdown.stepsDefinition },
    { key: 'timelinePresence', label: 'Timeline', value: score.breakdown.timelinePresence },
    { key: 'planCompleteness', label: 'Completeness', value: score.breakdown.planCompleteness }
  ];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6">Clarity Score</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Circular Score */}
        <div className="relative">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-700"
            />
            <motion.circle
              cx="72"
              cy="72"
              r="45"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={score.total >= 70 ? '#22c55e' : score.total >= 40 ? '#eab308' : '#ef4444'} />
                <stop offset="100%" stopColor={score.total >= 70 ? '#10b981' : score.total >= 40 ? '#f97316' : '#ec4899'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-4xl font-bold ${getScoreColor(score.total)}`}
            >
              {score.total}
            </motion.span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-4 w-full">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{cat.label}</span>
                <span className={getScoreColor(cat.value, 25)}>{cat.value}/25</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getScoreGradient((cat.value / 25) * 100)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.value / 25) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 * index }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 p-4 bg-gray-900/50 rounded-xl"
      >
        <p className="text-sm text-gray-400">
          <span className="text-white font-medium">Score Explanation:</span> {score.explanation}
        </p>
      </motion.div>

      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <p className="text-xs text-purple-300">
          <strong>Scoring Logic:</strong> Goal Clarity (0-25) + Steps Definition (0-25) + Timeline Presence (0-25) + Plan Completeness (0-25) = Total Score (0-100)
        </p>
      </div>
    </div>
  );
}
