import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Copy, 
  Download, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Hash,
  Link,
  MessageSquare,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const BlogContent = ({ data, onRegenerateSection }) => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [showPromptPanel, setShowPromptPanel] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    keywords: true,
    serpGaps: false,
    outline: false,
    faqs: false,
    recommendations: false
  });

  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadBlog = () => {
    const content = `
# ${data.title}

**Meta Description:** ${data.meta_description}

**Primary Keyword:** ${data.keywords.primary}
**Secondary Keywords:** ${data.keywords.secondary.join(', ')}

---

${data.content}

---

## FAQs

${data.faqs.map(faq => `**${faq.question}**\n${faq.answer}\n`).join('\n')}

---

**${data.cta.text}**
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const InfoPanel = ({ icon: Icon, title, children, sectionKey }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden hover-glow"
    >
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-cyber-blue" />
          <h3 className="font-heading text-lg font-semibold">{title}</h3>
        </div>
        {expandedSections[sectionKey] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (!data) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-20">
      {/* Header with actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 glass-strong rounded-3xl p-6"
      >
        <h1 className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-purple mb-3">
          {data.title}
        </h1>
        <p className="text-gray-300 text-lg mb-6">{data.meta_description}</p>
        
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(data.content, 'full')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-blue to-neon-green rounded-xl text-white font-medium shadow-neon hover:shadow-neon-strong transition-all"
          >
            <Copy size={18} />
            {copiedSection === 'full' ? 'Copied!' : 'Copy Content'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadBlog}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyber-purple to-cyber-pink rounded-xl text-white font-medium shadow-purple-glow hover:shadow-neon transition-all"
          >
            <Download size={18} />
            Download
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPromptPanel(!showPromptPanel)}
            className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-white font-medium hover:bg-white/10 transition-all"
          >
            {showPromptPanel ? <EyeOff size={18} /> : <Eye size={18} />}
            Prompt Insights
          </motion.button>
        </div>
      </motion.div>

      {/* Prompt transparency panel */}
      <AnimatePresence>
        {showPromptPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 glass rounded-2xl p-6 overflow-hidden"
          >
            <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="text-cyber-blue" size={20} />
              AI Generation Pipeline
            </h3>
            <div className="space-y-3 text-sm text-gray-300 font-mono">
              <p>✓ Keyword clustering & intent analysis</p>
              <p>✓ SERP gap identification</p>
              <p>✓ Content structure optimization</p>
              <p>✓ Natural language generation</p>
              <p>✓ SEO validation & scoring</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keywords Panel */}
      <div className="mb-6">
        <InfoPanel icon={Hash} title="Keywords" sectionKey="keywords">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Primary</p>
              <div className="keyword-tag inline-block">
                {data.keywords.primary}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Secondary</p>
              <div className="flex flex-wrap gap-2">
                {data.keywords.secondary.map((kw, i) => (
                  <div key={i} className="keyword-tag">{kw}</div>
                ))}
              </div>
            </div>

            {data.keywords.long_tail && data.keywords.long_tail.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Long-tail</p>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.long_tail.map((kw, i) => (
                    <div key={i} className="keyword-tag text-xs">{kw}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </InfoPanel>
      </div>

      {/* SERP Gaps */}
      {data.serp_gaps && data.serp_gaps.length > 0 && (
        <div className="mb-6">
          <InfoPanel icon={TrendingUp} title="SERP Gap Opportunities" sectionKey="serpGaps">
            <div className="space-y-4">
              {data.serp_gaps.map((gap, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 border-l-4 border-neon-green">
                  <h4 className="font-semibold text-neon-green mb-2">{gap.gap_title}</h4>
                  <p className="text-sm text-gray-300 mb-2">{gap.opportunity}</p>
                  <p className="text-xs text-gray-400">→ {gap.implementation}</p>
                </div>
              ))}
            </div>
          </InfoPanel>
        </div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-strong rounded-3xl p-8 mb-6"
      >
        <div 
          className="blog-content prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </motion.div>

      {/* FAQs */}
      {data.faqs && data.faqs.length > 0 && (
        <div className="mb-6">
          <InfoPanel icon={MessageSquare} title="Frequently Asked Questions" sectionKey="faqs">
            <div className="space-y-4">
              {data.faqs.map((faq, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <h4 className="font-semibold text-cyber-blue mb-2">{faq.question}</h4>
                  <p className="text-sm text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </InfoPanel>
        </div>
      )}

      {/* Internal Linking Suggestions */}
      {data.internal_linking && data.internal_linking.length > 0 && (
        <div className="mb-6">
          <InfoPanel icon={Link} title="Internal Linking Opportunities" sectionKey="linking">
            <div className="flex flex-wrap gap-2">
              {data.internal_linking.map((topic, index) => (
                <div key={index} className="px-3 py-2 bg-white/5 rounded-lg text-sm text-gray-300 border border-cyber-blue/30">
                  {topic}
                </div>
              ))}
            </div>
          </InfoPanel>
        </div>
      )}

      {/* SEO Recommendations */}
      {data.seo_analysis?.recommendations && data.seo_analysis.recommendations.length > 0 && (
        <div className="mb-6">
          <InfoPanel icon={AlertCircle} title="SEO Recommendations" sectionKey="recommendations">
            <div className="space-y-2">
              {data.seo_analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyber-blue">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </InfoPanel>
        </div>
      )}

      {/* CTA */}
      {data.cta && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-strong rounded-3xl p-8 text-center border-2 border-cyber-blue/50"
        >
          <p className="text-2xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-neon-green">
            {data.cta.text}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default BlogContent;
