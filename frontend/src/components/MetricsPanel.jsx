import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, Target, Zap } from 'lucide-react';

const MetricsPanel = ({ data }) => {
  if (!data) return null;

  const { seo_analysis, traffic_potential, keywords, word_count } = data;

  const ScoreRing = ({ score, size = 120 }) => {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getScoreColor = (score) => {
      if (score >= 80) return '#00ff88';
      if (score >= 60) return '#00d4ff';
      if (score >= 40) return '#fbbf24';
      return '#ef4444';
    };

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(0, 212, 255, 0.2)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getScoreColor(score)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 10px ${getScoreColor(score)})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-3xl font-bold font-heading"
            style={{ color: getScoreColor(score) }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-gray-400 uppercase tracking-wider">Score</span>
        </div>
      </div>
    );
  };

  const metrics = [
    {
      icon: Eye,
      label: 'Est. Monthly Views',
      value: traffic_potential?.estimated_monthly_visits?.toLocaleString() || '0',
      color: 'text-cyber-blue',
      glow: 'shadow-neon'
    },
    {
      icon: Target,
      label: 'Keyword Density',
      value: `${seo_analysis?.metrics?.keyword_density || 0}%`,
      color: 'text-neon-green',
      glow: 'shadow-green-glow'
    },
    {
      icon: Zap,
      label: 'Word Count',
      value: word_count?.toLocaleString() || '0',
      color: 'text-cyber-purple',
      glow: 'shadow-purple-glow'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed right-8 top-24 z-30 space-y-6"
    >
      {/* SEO Score */}
      <div className="glass-strong rounded-3xl p-6 text-center">
        <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">SEO Score</p>
        <ScoreRing score={seo_analysis?.score || 0} />
        
        {/* Confidence indicator */}
        {traffic_potential?.confidence && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-4"
          >
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                traffic_potential.confidence === 'high' ? 'bg-neon-green' :
                traffic_potential.confidence === 'medium' ? 'bg-cyber-blue' :
                'bg-yellow-500'
              } animate-pulse`} />
              <span className="text-xs text-gray-400 capitalize">
                {traffic_potential.confidence} Confidence
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.5 }}
              className="glass-strong rounded-2xl p-4 hover-glow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 ${metric.glow}`}>
                  <Icon size={20} className={metric.color} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{metric.label}</p>
                  <p className={`text-lg font-bold font-mono ${metric.color}`}>
                    {metric.value}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search Intent */}
      {data.search_intent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-strong rounded-2xl p-4"
        >
          <p className="text-xs text-gray-400 mb-2">Search Intent</p>
          <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-cyber-blue/30 to-cyber-purple/30 border border-cyber-blue/50">
            <span className="text-sm font-medium text-cyber-blue capitalize">
              {data.search_intent}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MetricsPanel;
