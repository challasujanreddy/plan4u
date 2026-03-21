import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Loader2, ArrowLeft, Eye, Calendar } from 'lucide-react';
import { HistoryItem, AnalysisResult } from '../types';
import { getHistory } from '../services/api';

interface HistoryProps {
  onBack: () => void;
  onViewResult: (result: AnalysisResult, idea: string) => void;
}

export default function History({ onBack, onViewResult }: HistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <HistoryIcon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Analysis History</h1>
            <p className="text-gray-400 text-sm">View your previous plan analyses</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={loadHistory}
              className="text-purple-400 hover:text-purple-300"
            >
              Try again
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20">
            <HistoryIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No analyses yet. Start by creating your first plan!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2 line-clamp-2">{item.idea}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span className={`font-semibold ${getScoreColor(item.analysis.clarityScore.total)}`}>
                        Score: {item.analysis.clarityScore.total}/100
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onViewResult(item.analysis, item.idea)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
