import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

const KeywordInput = ({ onGenerate, isLoading }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim() && !isLoading) {
      onGenerate(keyword.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-strong rounded-3xl p-2 shadow-neon-strong">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4">
            <Sparkles className="text-cyber-blue" size={24} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter your keyword to generate SEO-optimized blog..."
              className="w-full sm:flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 py-4 text-lg font-light"
              disabled={isLoading}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !keyword.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-full sm:w-auto px-6 py-3 rounded-2xl font-heading font-semibold
                transition-all duration-300
                ${isLoading || !keyword.trim()
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyber-blue to-cyber-purple text-white shadow-neon hover:shadow-neon-strong'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Generating...
                </span>
              ) : (
                'Generate'
              )}
            </motion.button>
          </div>
        </div>

        {/* Animated glow effect */}
        {!isLoading && (
          <motion.div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 -z-10"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </form>

      {/* Loading status */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <div className="glass rounded-2xl px-6 py-3 inline-block">
            <p className="text-sm text-cyber-blue font-medium">
              AI is analyzing and generating your content...
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default KeywordInput;
