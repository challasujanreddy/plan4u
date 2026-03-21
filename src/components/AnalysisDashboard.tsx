import { motion } from 'framer-motion';
import { 
  Target, 
  Route, 
  ListChecks, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Sparkles,
  FileText,
  ArrowLeftRight
} from 'lucide-react';
import { AnalysisResult, ActionableStep, MissingElement } from '../types';
import ClarityScore from './ClarityScore';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  originalIdea: string;
  onModify: () => void;
}

const SEVERITY_STYLES = {
  high: 'bg-red-500/20 text-red-400 border-red-500/50',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/50'
};

const PRIORITY_STYLES = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400'
};

export default function AnalysisDashboard({ result, originalIdea, onModify }: AnalysisDashboardProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Your Plan Analysis</h1>
              <p className="text-gray-400 text-sm">Here's your structured plan breakdown</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onModify}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Modify & Re-run
          </motion.button>
        </motion.div>

        {/* Before vs After */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <ArrowLeftRight className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Before vs After</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <span className="text-xs text-red-400 font-semibold uppercase tracking-wide">Before (Original)</span>
              <p className="mt-2 text-gray-300">{result.beforeAfter?.before || originalIdea}</p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <span className="text-xs text-green-400 font-semibold uppercase tracking-wide">After (Clarified)</span>
              <p className="mt-2 text-gray-300">{result.beforeAfter?.after || result.simplifiedVersion}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Structured Plan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Structured Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Structured Plan</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Target className="w-5 h-5" />
                    <span className="font-semibold">Goal</span>
                  </div>
                  <p className="text-gray-300">{result.structuredPlan.goal}</p>
                </div>
                
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Route className="w-5 h-5" />
                    <span className="font-semibold">Method</span>
                  </div>
                  <p className="text-gray-300">{result.structuredPlan.method}</p>
                </div>
                
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <ListChecks className="w-5 h-5" />
                    <span className="font-semibold">Steps</span>
                  </div>
                  <ul className="space-y-1">
                    {result.structuredPlan.steps.map((step, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-gray-900/50 rounded-xl">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Timeline</span>
                  </div>
                  <p className="text-gray-300">{result.structuredPlan.timeline}</p>
                </div>
              </div>
            </motion.div>

            {/* Missing Elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Missing Elements</h3>
              </div>
              
              {result.missingElements.length === 0 ? (
                <p className="text-gray-400">No critical missing elements detected! 🎉</p>
              ) : (
                <div className="space-y-3">
                  {result.missingElements.map((element: MissingElement, i: number) => (
                    <div 
                      key={i}
                      className={`p-3 rounded-lg border ${SEVERITY_STYLES[element.severity]}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{element.category}</span>
                        <span className="text-xs uppercase">{element.severity}</span>
                      </div>
                      <p className="text-sm opacity-80">{element.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Actionable Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <h3 className="text-xl font-bold text-white">Actionable Next Steps</h3>
              </div>
              
              <div className="space-y-3">
                {result.actionableSteps.map((step: ActionableStep, i: number) => (
                  <div 
                    key={i}
                    className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300">{step.step}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${PRIORITY_STYLES[step.priority]}`}>
                          {step.priority} priority
                        </span>
                        <span className="text-xs text-gray-500">{step.timeframe}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Score & Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ClarityScore score={result.clarityScore} />
            </motion.div>

            {/* Simplified Version */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Simplified Version</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">{result.simplifiedVersion}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
