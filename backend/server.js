require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const AIService = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Initialize AI Service
let aiService;
try {
  aiService = new AIService();
  console.log('✅ AI Service initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize AI Service:', error.message);
  process.exit(1);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    model: process.env.MODEL_NAME,
    timestamp: new Date().toISOString() 
  });
});

// Main blog generation endpoint (full pipeline)
app.post('/api/generate-blog', async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    console.log(`🚀 Starting blog generation for: ${keyword}`);
    const results = {};

    // Step 1: Keyword Analysis
    console.log('📊 Step 1: Analyzing keyword...');
    results.keywordAnalysis = await aiService.analyzeKeyword(keyword);
    
    // Step 2: SERP Gap Analysis
    console.log('🔍 Step 2: Identifying SERP gaps...');
    results.serpGaps = await aiService.generateSERPGaps(results.keywordAnalysis);
    
    // Step 3: Outline Generation
    console.log('📝 Step 3: Creating content outline...');
    results.outline = await aiService.generateOutline(
      results.keywordAnalysis, 
      results.serpGaps
    );
    
    // Step 4: Content Generation
    console.log('✍️ Step 4: Generating blog content...');
    results.blogContent = await aiService.generateBlogContent(
      results.keywordAnalysis,
      results.outline,
      results.serpGaps
    );
    
    // Step 5: SEO Validation
    console.log('✅ Step 5: Validating SEO...');
    results.seoScore = aiService.calculateSEOScore(
      results.blogContent.content,
      results.keywordAnalysis
    );
    
    // Step 6: Traffic Estimation
    console.log('📈 Step 6: Estimating traffic potential...');
    results.trafficPotential = aiService.estimateTrafficPotential(
      results.keywordAnalysis,
      results.seoScore
    );

    // Compile final response
    const response = {
      success: true,
      data: {
        title: results.outline.title,
        meta_description: results.outline.meta_description,
        content: results.blogContent.content,
        word_count: results.blogContent.word_count,
        keywords: {
          primary: results.keywordAnalysis.primary_keyword,
          secondary: results.keywordAnalysis.secondary_keywords,
          long_tail: results.keywordAnalysis.long_tail_keywords
        },
        search_intent: results.keywordAnalysis.search_intent,
        target_audience: results.keywordAnalysis.target_audience,
        outline: results.outline.outline,
        serp_gaps: results.serpGaps.gaps,
        unique_angles: results.serpGaps.unique_angles,
        faqs: results.blogContent.faqs,
        cta: results.blogContent.cta,
        internal_linking: results.outline.internal_linking_opportunities,
        seo_analysis: {
          score: results.seoScore.overall_score,
          metrics: results.seoScore.metrics,
          recommendations: results.seoScore.recommendations
        },
        traffic_potential: results.trafficPotential,
        generated_at: new Date().toISOString()
      }
    };

    console.log('✨ Blog generation completed successfully!');
    res.json(response);

  } catch (error) {
    console.error('❌ Error in blog generation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate blog',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Individual step endpoints for granular control
app.post('/api/analyze-keyword', async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    const analysis = await aiService.analyzeKeyword(keyword);
    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error in keyword analysis:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze keyword',
      message: error.message 
    });
  }
});

app.post('/api/generate-serp-gaps', async (req, res) => {
  try {
    const { keywordData } = req.body;
    if (!keywordData) {
      return res.status(400).json({ error: 'Keyword data is required' });
    }

    const gaps = await aiService.generateSERPGaps(keywordData);
    res.json({ success: true, data: gaps });
  } catch (error) {
    console.error('Error in SERP gap generation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate SERP gaps',
      message: error.message 
    });
  }
});

app.post('/api/generate-outline', async (req, res) => {
  try {
    const { keywordData, serpGaps } = req.body;
    if (!keywordData || !serpGaps) {
      return res.status(400).json({ error: 'Keyword data and SERP gaps are required' });
    }

    const outline = await aiService.generateOutline(keywordData, serpGaps);
    res.json({ success: true, data: outline });
  } catch (error) {
    console.error('Error in outline generation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate outline',
      message: error.message 
    });
  }
});

app.post('/api/regenerate-section', async (req, res) => {
  try {
    const { sectionTitle, keywordData, context } = req.body;
    if (!sectionTitle || !keywordData) {
      return res.status(400).json({ error: 'Section title and keyword data are required' });
    }

    const regenerated = await aiService.regenerateSection(
      sectionTitle, 
      keywordData, 
      context || ''
    );
    res.json({ success: true, data: regenerated });
  } catch (error) {
    console.error('Error in section regeneration:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to regenerate section',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║   🤖 AI Blog Generation System           ║
║   ✅ Server running on port ${PORT}        ║
║   🌐 Model: ${process.env.MODEL_NAME || 'Not set'}
║   📡 Ready to generate content!          ║
╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
