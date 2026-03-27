import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Target, 
  FileText, 
  Wand2, 
  CheckCircle, 
  TrendingUp 
} from 'lucide-react';

const PipelineRail = ({ currentStep, steps }) => {
  const pipelineSteps = [
    { id: 'keyword', label: 'Keyword Analysis', icon: Search },
    { id: 'serp', label: 'SERP Gaps', icon: Target },
    { id: 'outline', label: 'Outline', icon: FileText },
    { id: 'content', label: 'Content Gen', icon: Wand2 },
    { id: 'seo', label: 'SEO Validation', icon: CheckCircle },
    { id: 'metrics', label: 'Analytics', icon: TrendingUp },
  ];

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-30">
      <div className="glass rounded-3xl p-6 space-y-6">
        {pipelineSteps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(index);
          
          return (
            <div key={step.id} className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: status === 'active' ? 1.1 : 1,
                  opacity: 1 
                }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div
                  className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center
                    transition-all duration-300
                    ${status === 'completed' 
                      ? 'bg-gradient-to-br from-cyber-blue to-neon-green shadow-green-glow' 
                      : status === 'active'
                      ? 'bg-gradient-to-br from-cyber-blue to-cyber-purple shadow-neon-strong animate-pulse-glow'
                      : 'bg-cyber-darker border border-cyber-blue/30'
                    }
                  `}
                >
                  <Icon 
                    size={28} 
                    className={`
                      ${status === 'completed' || status === 'active' 
                        ? 'text-white' 
                        : 'text-cyber-blue/50'
                      }
                    `}
                  />
                </div>

                {/* Active indicator */}
                {status === 'active' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-cyber-blue"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>

              {/* Connecting line */}
              {index < pipelineSteps.length - 1 && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-cyber-blue/50 to-transparent" />
              )}

              {/* Label tooltip */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: status === 'active' ? 1 : 0, x: 0 }}
                className="absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
              >
                <div className="glass px-4 py-2 rounded-xl">
                  <p className="text-sm font-medium text-cyber-blue">{step.label}</p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineRail;
