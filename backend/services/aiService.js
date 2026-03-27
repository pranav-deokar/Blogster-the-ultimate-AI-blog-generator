const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.model = process.env.MODEL_NAME || 'anthropic/claude-3.5-sonnet';
    this.baseURL = process.env.BASE_URL || 'https://openrouter.ai/api/v1';
    
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is required');
    }
  }

  async callAI(prompt, systemPrompt = '', retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await axios.post(
          `${this.baseURL}/chat/completions`,
          {
            model: this.model,
            messages: [
              ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 4000
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://ai-blog-generator.app',
              'X-Title': 'AI Blog Generator'
            },
            timeout: 60000
          }
        );

        return response.data.choices[0].message.content;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error.message);
        if (attempt === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  safeJSONParse(text) {
    try {
      // Try direct parse first
      return JSON.parse(text);
    } catch (e) {
      // Extract JSON using regex
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e2) {
          console.error('JSON extraction failed:', e2);
        }
      }
      
      // Fallback: extract between triple backticks
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        try {
          return JSON.parse(codeBlockMatch[1]);
        } catch (e3) {
          console.error('Code block extraction failed:', e3);
        }
      }
      
      throw new Error('Unable to parse JSON from response');
    }
  }

  async analyzeKeyword(keyword) {
    const prompt = `Analyze this keyword for SEO blog generation: "${keyword}"

Return ONLY a valid JSON object with this exact structure (no additional text):
{
  "primary_keyword": "main keyword",
  "secondary_keywords": ["keyword1", "keyword2", "keyword3"],
  "long_tail_keywords": ["long tail 1", "long tail 2", "long tail 3"],
  "search_intent": "informational|commercial|navigational|transactional",
  "target_audience": "description of target audience",
  "content_angle": "unique angle for content"
}`;

    const response = await this.callAI(prompt, 'You are an SEO keyword analysis expert. Return ONLY valid JSON, no markdown, no explanations.');
    return this.safeJSONParse(response);
  }

  async generateSERPGaps(keywordData) {
    const prompt = `Based on this keyword analysis, identify content gaps competitors likely miss:
${JSON.stringify(keywordData, null, 2)}

Return ONLY a valid JSON object with this structure:
{
  "gaps": [
    {
      "gap_title": "What competitors miss",
      "opportunity": "Why this matters",
      "implementation": "How to address it"
    }
  ],
  "unique_angles": ["angle1", "angle2", "angle3"]
}`;

    const response = await this.callAI(prompt, 'You are an SEO gap analysis expert. Return ONLY valid JSON.');
    return this.safeJSONParse(response);
  }

  async generateOutline(keywordData, serpGaps) {
    const intent = keywordData.search_intent;
    const keyword = keywordData.primary_keyword;

    const prompt = `Create a detailed blog outline for: "${keyword}"
Search Intent: ${intent}
Target Audience: ${keywordData.target_audience}

SERP Gaps to Address:
${JSON.stringify(serpGaps.gaps, null, 2)}

Return ONLY a valid JSON object with this structure:
{
  "title": "Engaging blog title",
  "meta_description": "155-160 char meta description",
  "outline": [
    {
      "section": "Introduction",
      "subsections": ["Hook", "Problem Statement", "What to Expect"],
      "target_words": 200
    },
    {
      "section": "Main Section Title",
      "subsections": ["subsection1", "subsection2"],
      "target_words": 400
    }
  ],
  "cta_placement": ["After section 3", "End of article"],
  "internal_linking_opportunities": ["topic1", "topic2", "topic3"]
}`;

    const response = await this.callAI(prompt, 'You are an SEO content strategist. Return ONLY valid JSON.');
    return this.safeJSONParse(response);
  }

  async generateBlogContent(keywordData, outline, serpGaps) {
    const prompt = `Write a complete, human-like blog post following this outline:

PRIMARY KEYWORD: ${keywordData.primary_keyword}
SECONDARY KEYWORDS: ${keywordData.secondary_keywords.join(', ')}

OUTLINE:
${JSON.stringify(outline.outline, null, 2)}

SERP GAPS TO ADDRESS:
${serpGaps.gaps.map(g => g.gap_title).join(', ')}

CRITICAL REQUIREMENTS:
- Write naturally and conversationally (avoid AI patterns)
- Vary sentence length and structure
- Use transitional phrases organically
- Include personal touches and relatability
- Natural keyword integration (NO keyword stuffing)
- Minimum 1200 words
- Use <h2> for main sections, <h3> for subsections
- Include practical examples
- Add a compelling introduction and conclusion

Return ONLY a valid JSON object:
{
  "content": "full HTML blog content with proper heading tags",
  "word_count": actual_number,
  "faqs": [
    {"question": "Q1", "answer": "A1"},
    {"question": "Q2", "answer": "A2"},
    {"question": "Q3", "answer": "A3"}
  ],
  "cta": {
    "text": "compelling CTA text",
    "placement": "where to place it"
  }
}`;

    const response = await this.callAI(prompt, 'You are an expert content writer who writes in a natural, human style. Return ONLY valid JSON.');
    return this.safeJSONParse(response);
  }

  calculateSEOScore(content, keywordData) {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    // Keyword density
    const primaryKeyword = keywordData.primary_keyword.toLowerCase();
    const keywordCount = text.toLowerCase().split(primaryKeyword).length - 1;
    const keywordDensity = (keywordCount / wordCount) * 100;
    
    // Readability score (Flesch Reading Ease approximation)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const avgWordsPerSentence = wordCount / sentences;
    const avgSyllablesPerWord = 1.5; // Approximation
    const readabilityScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    
    // Heading structure
    const h2Count = (content.match(/<h2>/g) || []).length;
    const h3Count = (content.match(/<h3>/g) || []).length;
    const hasProperHeadings = h2Count >= 3 && h3Count >= 2;
    
    // Calculate overall score
    let score = 0;
    
    // Word count (30 points max)
    score += Math.min(30, (wordCount / 1500) * 30);
    
    // Keyword density (25 points max) - ideal 1-2%
    if (keywordDensity >= 1 && keywordDensity <= 2.5) {
      score += 25;
    } else if (keywordDensity >= 0.5 && keywordDensity <= 3) {
      score += 15;
    } else {
      score += 5;
    }
    
    // Readability (20 points max) - 60-70 is ideal
    if (readabilityScore >= 60 && readabilityScore <= 70) {
      score += 20;
    } else if (readabilityScore >= 50 && readabilityScore <= 80) {
      score += 15;
    } else {
      score += 10;
    }
    
    // Heading structure (25 points max)
    score += hasProperHeadings ? 25 : 10;
    
    return {
      overall_score: Math.round(score),
      metrics: {
        word_count: wordCount,
        keyword_density: parseFloat(keywordDensity.toFixed(2)),
        readability_score: Math.round(readabilityScore),
        heading_count: { h2: h2Count, h3: h3Count },
        keyword_count: keywordCount
      },
      recommendations: this.generateRecommendations(keywordDensity, readabilityScore, hasProperHeadings, wordCount)
    };
  }

  generateRecommendations(density, readability, hasHeadings, wordCount) {
    const recommendations = [];
    
    if (density < 1) recommendations.push('Increase keyword usage slightly');
    if (density > 2.5) recommendations.push('Reduce keyword density to avoid stuffing');
    if (readability < 60) recommendations.push('Simplify sentences for better readability');
    if (readability > 80) recommendations.push('Add more complex sentences for depth');
    if (!hasHeadings) recommendations.push('Add more heading structure');
    if (wordCount < 1200) recommendations.push('Increase content length to 1200+ words');
    
    return recommendations.length > 0 ? recommendations : ['Content is well-optimized!'];
  }

  estimateTrafficPotential(keywordData, seoScore) {
    const intentMultiplier = {
      'informational': 0.7,
      'commercial': 1.2,
      'navigational': 0.5,
      'transactional': 1.5
    };
    
    const baseTraffic = 1000;
    const scoreMultiplier = seoScore.overall_score / 100;
    const intent = intentMultiplier[keywordData.search_intent] || 1;
    
    const estimatedMonthlyVisits = Math.round(baseTraffic * scoreMultiplier * intent);
    const potentialRange = {
      low: Math.round(estimatedMonthlyVisits * 0.6),
      high: Math.round(estimatedMonthlyVisits * 1.8)
    };
    
    return {
      estimated_monthly_visits: estimatedMonthlyVisits,
      range: potentialRange,
      confidence: seoScore.overall_score > 80 ? 'high' : seoScore.overall_score > 60 ? 'medium' : 'low'
    };
  }

  async regenerateSection(sectionTitle, keywordData, context) {
    const prompt = `Regenerate this blog section: "${sectionTitle}"

Context from rest of article:
${context}

Primary Keyword: ${keywordData.primary_keyword}
Secondary Keywords: ${keywordData.secondary_keywords.join(', ')}

Requirements:
- Natural, conversational tone
- Integrate keywords naturally
- 250-400 words
- Use <h2> for section title, <h3> for subsections if needed

Return ONLY a valid JSON object:
{
  "content": "HTML content for this section"
}`;

    const response = await this.callAI(prompt, 'You are an expert content writer. Return ONLY valid JSON.');
    return this.safeJSONParse(response);
  }
}

module.exports = AIService;
