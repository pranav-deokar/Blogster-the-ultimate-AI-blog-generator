import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './components/ParticleBackground';
import KeywordInput from './components/KeywordInput';
import PipelineRail from './components/PipelineRail';
import MetricsPanel from './components/MetricsPanel';
import BlogContent from './components/BlogContent';
import { blogAPI } from './services/api';
import { AlertCircle, Sparkles } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [blogData, setBlogData] = useState(null);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const steps = [
    'Analyzing keyword intelligence...',
    'Identifying SERP gaps...',
    'Structuring content outline...',
    'Generating humanized content...',
    'Validating SEO metrics...',
    'Calculating traffic potential...'
  ];

  useEffect(() => {
    // Check backend health on mount
    const checkHealth = async () => {
      try {
        await blogAPI.checkHealth();
        console.log('✅ Backend connection established');
      } catch (err) {
        console.error('⚠️ Backend connection failed:', err.message);
      }
    };
    checkHealth();
  }, []);

  const simulateSteps = async (totalDuration) => {
    const stepDuration = totalDuration / steps.length;
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setStatusMessage(steps[i]);
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  };

  const handleGenerate = async (keyword) => {
    setIsLoading(true);
    setCurrentStep(0);
    setError(null);
    setBlogData(null);
    setStatusMessage(steps[0]);

    try {
      // Start step simulation
      const stepPromise = simulateSteps(30000); // 30 seconds for visual feedback
      
      // Actual API call
      const result = await blogAPI.generateBlog(keyword);
      
      // Wait for step simulation to complete if API finishes early
      await stepPromise;

      if (result.success) {
        setBlogData(result.data);
        setCurrentStep(steps.length);
        setStatusMessage('✨ Blog generated successfully!');
        
        // Scroll to content
        setTimeout(() => {
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }, 500);
      } else {
        throw new Error(result.message || 'Generation failed');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate blog. Please try again.');
      setCurrentStep(-1);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setStatusMessage('');
      }, 1000);
    }
  };

  const handleRegenerateSection = async (sectionTitle) => {
    if (!blogData) return;
    
    try {
      setStatusMessage(`Regenerating ${sectionTitle}...`);
      const result = await blogAPI.regenerateSection(
        sectionTitle,
        { 
          primary_keyword: blogData.keywords.primary,
          secondary_keywords: blogData.keywords.secondary 
        },
        blogData.content.substring(0, 500) // Context
      );

      if (result.success) {
        // Update the content with regenerated section
        // This is a simplified version - you'd want more sophisticated merging
        setBlogData(prev => ({
          ...prev,
          content: prev.content.replace(
            new RegExp(`<h2>.*?${sectionTitle}.*?</h2>.*?(?=<h2>|$)`, 's'),
            result.data.content
          )
        }));
        setStatusMessage('Section regenerated!');
      }
    } catch (err) {
      console.error('Regeneration error:', err);
      setError('Failed to regenerate section');
    } finally {
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Animated Background */}
      <ParticleBackground />

      {/* Grid overlay */}
      <div className="fixed inset-0 grid-bg opacity-30 -z-5" />

      {/* Keyword Input */}
      <KeywordInput onGenerate={handleGenerate} isLoading={isLoading} />

      {/* Pipeline Rail */}
      <AnimatePresence>
        {(isLoading || blogData) && (
          <PipelineRail currentStep={currentStep} steps={steps} />
        )}
      </AnimatePresence>

      {/* Metrics Panel */}
      <AnimatePresence>
        {blogData && (
          <MetricsPanel data={blogData} />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="pt-32 relative z-10">
        {/* Welcome State */}
        {!isLoading && !blogData && !error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center px-4 max-w-3xl mx-auto"
          >
            <motion.div
              animate={{ 
                rotateY: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-6"
            >
              <Sparkles size={64} className="text-cyber-blue" />
            </motion.div>
            
            <h1 className="text-6xl font-heading font-black mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-purple to-neon-green">
                AI Blog Generator
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transform keywords into SEO-optimized, human-like blog content
              <br />
              <span className="text-cyber-blue">Powered by advanced AI pipeline</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[
                { title: 'Smart Analysis', desc: 'Intent detection & keyword clustering' },
                { title: 'SERP Intelligence', desc: 'Identify content gaps & opportunities' },
                { title: 'Human-like Writing', desc: 'Natural, conversational content' }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="glass rounded-2xl p-6 hover-glow"
                >
                  <h3 className="font-heading text-lg font-bold text-cyber-blue mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center px-4 max-w-2xl mx-auto"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 rounded-full border-4 border-cyber-blue/30 border-t-cyber-blue loading-spinner" />
            </motion.div>
            
            <motion.p
              key={statusMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl text-cyber-blue font-medium mb-4"
            >
              {statusMessage}
            </motion.p>

            <div className="glass rounded-2xl p-6 mt-8">
              <div className="space-y-3 text-left">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                      opacity: index <= currentStep ? 1 : 0.3,
                      x: index === currentStep ? 5 : 0
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      index < currentStep ? 'bg-neon-green' :
                      index === currentStep ? 'bg-cyber-blue animate-pulse' :
                      'bg-gray-600'
                    }`} />
                    <span className={`text-sm ${
                      index <= currentStep ? 'text-white' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto px-4"
          >
            <div className="glass-strong rounded-2xl p-6 border-2 border-red-500/50">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-heading text-xl font-bold text-red-500 mb-2">
                    Generation Failed
                  </h3>
                  <p className="text-gray-300 mb-4">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-xl text-white font-medium hover:shadow-neon transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Content */}
        {blogData && !isLoading && (
          <BlogContent 
            data={blogData} 
            onRegenerateSection={handleRegenerateSection}
          />
        )}
        {/* Extra Product Section */}
<motion.div 
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="mt-32 px-6 max-w-6xl mx-auto"
>
  <h2 className="text-4xl font-heading text-center mb-12 text-cyber-blue">
    Why This AI Engine is Different
  </h2>

  <div className="grid md:grid-cols-3 gap-8">
    {[
      {
        title: "Multi-Step AI Pipeline",
        desc: "Structured generation ensures consistency and SEO performance."
      },
      {
        title: "SEO Intelligence Layer",
        desc: "Built-in validation for keyword density, readability, and ranking potential."
      },
      {
        title: "Humanized Content",
        desc: "Advanced prompting creates natural, engaging blogs."
      }
    ].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-6 hover-glow"
      >
        <h3 className="text-lg font-bold text-cyber-blue mb-2">
          {item.title}
        </h3>
        <p className="text-gray-400 text-sm">{item.desc}</p>
      </motion.div>
    ))}
  </div>
</motion.div>
        <motion.div 
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="mt-32 px-6 max-w-4xl mx-auto text-center"
>
  <h2 className="text-3xl font-heading mb-6 text-cyber-purple">
    How It Works
  </h2>

  <p className="text-gray-300 leading-relaxed">
    Our system transforms a simple keyword into a fully optimized blog using a structured AI pipeline. 
    It analyzes search intent, identifies ranking gaps, generates human-like content, and validates SEO performance — all in seconds.
  </p>
</motion.div>
      </div>

      {/* Status Toast */}
      <AnimatePresence>
        {statusMessage && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="glass-strong rounded-2xl px-6 py-3 shadow-neon">
              <p className="text-sm text-cyber-blue font-medium">{statusMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
