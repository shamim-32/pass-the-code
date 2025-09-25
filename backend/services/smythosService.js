const axios = require('axios');

// SmythOS Agent Configuration
const SMYTHOS_AGENT_ID = 'cmfxy2xt24p88o3wt5eybaha8';
const SMYTHOS_BASE_URL = process.env.SMYTHOS_URL || 'https://api.smythos.com';
const SMYTHOS_API_KEY = process.env.SMYTHOS_API_KEY;

// Create axios client for SmythOS API
const smythosClient = axios.create({
  baseURL: SMYTHOS_BASE_URL,
  headers: {
    'Authorization': `Bearer ${SMYTHOS_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 120000 // 2 minutes timeout for AI processing
});

// Agent endpoint mappings based on your SmythOS configuration
const AGENT_ENDPOINTS = {
  create_storybook: 'create_storybook',
  create_sign_language: 'create_sign_language', 
  create_audiobook: 'create_audiobook',
  live_caption: 'live_caption',
  create_social_story: 'create_social_story',
  describe_image: 'describe_image',
  math_help: 'math_help',
  emotion_support: 'emotion_support',
  create_comm_board: 'create_comm_board'
};

/**
 * Call SmythOS Agent Endpoint
 * @param {string} endpoint - The endpoint name (e.g., '/create_storybook')
 * @param {object} payload - The data to send to the agent
 * @returns {Promise<object>} - The agent response
 */
async function callSmythosAgent(endpoint, payload) {
  try {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Validate endpoint exists
    if (!AGENT_ENDPOINTS[cleanEndpoint]) {
      throw new Error(`Unknown agent endpoint: ${cleanEndpoint}`);
    }

    console.log(`Calling SmythOS agent endpoint: ${cleanEndpoint}`, { payload });

    // Call the SmythOS agent
    const response = await smythosClient.post(`/agents/${SMYTHOS_AGENT_ID}/run/${cleanEndpoint}`, payload);
    
    console.log(`SmythOS response for ${cleanEndpoint}:`, response.data);
    
    return {
      success: true,
      data: response.data,
      endpoint: cleanEndpoint,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`SmythOS agent call failed for ${endpoint}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      payload
    });

    // Return a structured error response
    return {
      success: false,
      error: {
        message: error.message,
        status: error.response?.status || 500,
        details: error.response?.data || 'Unknown error occurred',
        endpoint,
        timestamp: new Date().toISOString()
      }
    };
  }
}

/**
 * Mock response for development/testing when SmythOS is not available
 */
function getMockResponse(endpoint, payload) {
  const mockResponses = {
    create_storybook: {
      id: 'mock-storybook-' + Date.now(),
      title: payload.title || 'Generated Storybook',
      storybook_content: `# ${payload.title || 'Learning Adventure'}

## Chapter 1: The Beginning

Once upon a time, there was a curious student who wanted to learn about ${payload.content?.substring(0, 100) || 'amazing new things'}.

**Simple sentences make reading easier.**

The student discovered that learning can be fun when information is presented clearly and with pictures.

## Chapter 2: The Journey

Step by step, the student learned new concepts. Each page had:
- Clear, simple words
- Helpful pictures
- Short paragraphs
- Lots of white space

## Chapter 3: Success!

In the end, the student felt proud and confident. Learning became an adventure, not a challenge.

*This storybook is designed to be dyslexia-friendly with simple language and clear structure.*`,
      meta: {
        word_count: 120,
        reading_level: 'grade4',
        chapters: 3,
        features: ['dyslexia-friendly', 'visual-supports', 'clear-structure']
      },
      url: null,
      format: 'text',
      accessibility_features: ['high-contrast', 'simple-fonts', 'clear-spacing']
    },
    create_sign_language: {
      id: 'mock-sign-' + Date.now(),
      title: payload.title || 'Sign Language Video',
      video_script: `## ${payload.title || 'Sign Language Lesson'}

### Introduction (0:00 - 0:30)
1. **HELLO** - Wave with open palm
2. **MY NAME** - Point to self, then fingerspell name
3. **TEACH YOU** - Point forward, then make teaching gesture

### Main Content (0:30 - 4:00)
**Topic**: ${payload.content?.substring(0, 50) || 'Basic Communication'}

Key Signs:
- **PLEASE** - Circular motion on chest
- **THANK YOU** - Touch chin, move hand forward
- **HELP** - Place one hand on other palm, lift up
- **MORE** - Fingertips touch, tap together
- **FINISHED** - Shake both hands with palms down

### Closing (4:00 - 4:30)
- **PRACTICE** - Repeat gesture
- **GOOD JOB** - Thumbs up
- **GOODBYE** - Wave

**Notes**: Use clear facial expressions and maintain steady pace for learning.`,
      meta: {
        duration: '4:30',
        segments: 3,
        language: payload.dialect || 'ASL',
        signs_count: 8,
        difficulty: 'beginner'
      },
      url: null,
      format: 'script',
      visual_cues: ['facial-expressions', 'hand-positioning', 'timing-markers']
    },
    create_audiobook: {
      id: 'mock-audio-' + Date.now(),
      title: payload.title || 'Generated Audiobook',
      audio_script: `# ${payload.title || 'Educational Audiobook'}

## Chapter 1: Introduction
[Soft background music fades in]

**Narrator** (${payload.voice_preference || 'alloy'} voice): 
"Welcome to your personalized audiobook. I'm excited to share this story with you today."

[Pause - 2 seconds]

## Chapter 2: The Story
"Let's explore ${payload.content?.substring(0, 100) || 'an amazing learning adventure'}..."

[Speaking slowly and clearly for accessibility]

"This story is designed to help you learn while enjoying every moment. We'll take our time and make sure every word is clear."

## Chapter 3: Interactive Elements
"Now, let's pause here. Can you think about what we just learned?"

[Pause - 5 seconds]

"Great job! Let's continue our journey together."

## Chapter 4: Conclusion
"We've reached the end of our story. Remember, learning is a wonderful adventure that never truly ends."

[Background music fades out]

**Production Notes**: 
- Speak at 150 words per minute
- Include 3-second pauses between chapters
- Use clear pronunciation for accessibility
- Add sound effects where appropriate`,
      meta: {
        duration: '12:30',
        voice: payload.voice_preference || 'alloy',
        chapters: 4,
        word_count: 200,
        speaking_rate: '150 wpm',
        accessibility: ['clear-pronunciation', 'appropriate-pacing', 'chapter-breaks']
      },
      url: null,
      format: 'script'
    },
    live_caption: {
      id: 'mock-caption-' + Date.now(),
      text: 'Hello everyone, welcome to today\'s lesson. We\'re going to learn about accessibility and how technology can help students with different learning needs. This is an example of live captioning in action.',
      words: [
        { word: 'Hello', start: 0.0, end: 0.5, confidence: 0.98 },
        { word: 'everyone,', start: 0.6, end: 1.1, confidence: 0.97 },
        { word: 'welcome', start: 1.2, end: 1.7, confidence: 0.99 },
        { word: 'to', start: 1.8, end: 1.9, confidence: 0.99 },
        { word: 'today\'s', start: 2.0, end: 2.4, confidence: 0.96 },
        { word: 'lesson.', start: 2.5, end: 2.9, confidence: 0.98 },
        { word: 'We\'re', start: 3.2, end: 3.5, confidence: 0.97 },
        { word: 'going', start: 3.6, end: 3.9, confidence: 0.99 },
        { word: 'to', start: 4.0, end: 4.1, confidence: 0.99 },
        { word: 'learn', start: 4.2, end: 4.6, confidence: 0.98 }
      ],
      confidence: 0.97,
      language: payload.language || 'en',
      duration: 8.5,
      speaker_count: 1,
      processing_time: '1.2s'
    },
    create_social_story: {
      id: 'mock-story-' + Date.now(),
      title: `Social Story for ${payload.student_name}`,
      social_story: `# Going to ${payload.situation}\n\nHi ${payload.student_name}!\n\nSometimes we need to ${payload.situation}. This is normal and okay.\n\nWhen this happens, I can:\n1. Take deep breaths\n2. Ask for help if needed\n3. Remember that I am safe\n\nThis is a mock social story for development. The real version would be personalized based on ${payload.specific_needs}.`,
      meta: {
        age_appropriate: true,
        word_count: 85,
        reading_level: 'simple'
      }
    },
    describe_image: {
      id: 'mock-description-' + Date.now(),
      title: 'Educational Image Analysis',
      description: `## Visual Description

**Context**: ${payload.context || 'Educational content'}
**Detail Level**: ${payload.detail_level || 'detailed'}

### Overall Scene
This appears to be an educational diagram showing the relationship between different learning concepts. The image uses a clean, organized layout with clear visual hierarchy.

### Key Elements
1. **Main Title**: Located at the top center, using large, readable font
2. **Diagram Components**: 
   - Three circular elements arranged in a triangular pattern
   - Connecting arrows showing relationships
   - Color coding: Blue for concepts, Green for actions, Orange for outcomes

### Text Content
- Title: "Learning Through Accessibility"
- Subtitle: "Supporting All Students"
- Labels: "Visual Learning", "Auditory Processing", "Kinesthetic Engagement"

### Educational Significance
This image demonstrates inclusive learning principles, showing how different learning styles can be accommodated through various accessibility features. It's designed to help educators understand multi-modal learning approaches.

### Accessibility Features
- High contrast colors (meets WCAG 2.1 AA standards)
- Clear, sans-serif typography
- Logical reading order from top to bottom
- Sufficient white space between elements

**Recommended Use**: This image would be excellent for teacher training materials or student orientation about learning accommodations.`,
      meta: {
        confidence: 0.94,
        elements_detected: 8,
        text_found: true,
        colors_detected: ['blue', 'green', 'orange', 'black', 'white'],
        accessibility_score: 'AA compliant'
      },
      alt_text: 'Educational diagram showing three learning styles (Visual, Auditory, Kinesthetic) connected by arrows, titled "Learning Through Accessibility"'
    },
    math_help: {
      id: 'mock-math-' + Date.now(),
      solution: `MATH PROBLEM SOLUTION\n\nProblem: ${payload.problem}\nGrade Level: ${payload.grade_level}\nLearning Style: ${payload.learning_style}\n\nStep 1: Understand the problem\n- Break down what we're looking for\n- Identify the given information\n\nStep 2: Choose a strategy\n- Visual representation\n- Step-by-step approach\n\nStep 3: Solve\n- Work through each step carefully\n- Check our work\n\nThis is a mock solution for development.`,
      visual_aids: 'Diagrams and visual representations would be provided here',
      meta: {
        difficulty: 'moderate',
        steps: 3,
        time_estimate: '10 minutes'
      }
    },
    emotion_support: {
      id: 'mock-emotion-' + Date.now(),
      support_response: `EMOTIONAL SUPPORT RESPONSE\n\nI understand you're feeling ${payload.emotion_input}. This is completely normal and valid.\n\nHere are some strategies that might help:\n\n1. Take slow, deep breaths\n2. Name what you're feeling\n3. Remember that feelings are temporary\n4. Reach out for support when needed\n\nThis is a mock response for development.`,
      coping_strategies: [
        'Deep breathing exercises',
        'Grounding techniques',
        'Positive self-talk',
        'Physical movement'
      ],
      resources: [
        'School counselor contact',
        'Crisis helpline numbers',
        'Trusted adult contacts'
      ],
      meta: {
        age_group: payload.age_group,
        urgency: 'low',
        follow_up_needed: false
      }
    },
    create_comm_board: {
      id: 'mock-board-' + Date.now(),
      title: `Communication Board - ${payload.vocabulary_focus}`,
      comm_board_layout: `# Communication Board Layout

**Target User**: ${payload.age_level} level
**Focus Area**: ${payload.vocabulary_focus}
**Goals**: ${payload.communication_goals}

## Core Vocabulary Grid (4x6 Layout)

### Row 1: Basic Needs
| EAT 🍎 | DRINK 🥤 | SLEEP 😴 | BATHROOM 🚽 | HELP ✋ | MORE ➕ |

### Row 2: Feelings
| HAPPY 😊 | SAD 😢 | ANGRY 😠 | SCARED 😰 | EXCITED 🎉 | TIRED 😴 |

### Row 3: Social Words  
| HELLO 👋 | GOODBYE 👋 | PLEASE 🙏 | THANK YOU 💝 | YES ✓ | NO ✗ |

### Row 4: Actions
| GO ➡️ | STOP ✋ | WANT ❤️ | LIKE 👍 | DON'T LIKE 👎 | FINISHED ✅ |

## Usage Instructions
- Point to symbols to communicate
- Combine symbols to make sentences
- Use facial expressions and gestures
- Practice daily for best results

## Customization Notes
- Symbols are large and high-contrast
- Can be printed or used digitally
- Supports both pointing and eye-gaze
- Expandable based on user progress`,
      vocabulary_list: [
        { word: 'eat', category: 'basic_needs', symbol: '🍎', priority: 'high' },
        { word: 'drink', category: 'basic_needs', symbol: '🥤', priority: 'high' },
        { word: 'help', category: 'basic_needs', symbol: '✋', priority: 'critical' },
        { word: 'more', category: 'basic_needs', symbol: '➕', priority: 'high' },
        { word: 'bathroom', category: 'basic_needs', symbol: '🚽', priority: 'critical' },
        { word: 'sleep', category: 'basic_needs', symbol: '😴', priority: 'medium' },
        { word: 'happy', category: 'emotions', symbol: '😊', priority: 'medium' },
        { word: 'sad', category: 'emotions', symbol: '😢', priority: 'medium' },
        { word: 'angry', category: 'emotions', symbol: '😠', priority: 'medium' },
        { word: 'scared', category: 'emotions', symbol: '😰', priority: 'medium' },
        { word: 'excited', category: 'emotions', symbol: '🎉', priority: 'low' },
        { word: 'tired', category: 'emotions', symbol: '😴', priority: 'medium' },
        { word: 'hello', category: 'social', symbol: '👋', priority: 'high' },
        { word: 'goodbye', category: 'social', symbol: '👋', priority: 'high' },
        { word: 'please', category: 'social', symbol: '🙏', priority: 'medium' },
        { word: 'thank you', category: 'social', symbol: '💝', priority: 'medium' },
        { word: 'yes', category: 'social', symbol: '✓', priority: 'high' },
        { word: 'no', category: 'social', symbol: '✗', priority: 'high' },
        { word: 'go', category: 'actions', symbol: '➡️', priority: 'medium' },
        { word: 'stop', category: 'actions', symbol: '✋', priority: 'high' },
        { word: 'want', category: 'actions', symbol: '❤️', priority: 'high' },
        { word: 'like', category: 'actions', symbol: '👍', priority: 'medium' },
        { word: 'don\'t like', category: 'actions', symbol: '👎', priority: 'medium' },
        { word: 'finished', category: 'actions', symbol: '✅', priority: 'medium' }
      ],
      board_grid: {
        rows: 4,
        columns: 6,
        total_cells: 24,
        filled_cells: 24
      },
      meta: {
        total_words: 24,
        categories: 4,
        complexity: payload.age_level === 'toddler' ? 'beginner' : 'intermediate',
        print_ready: true,
        digital_compatible: true
      }
    }
  };

  return mockResponses[endpoint] || {
    id: 'mock-response-' + Date.now(),
    message: 'Mock response for development',
    endpoint,
    payload
  };
}

/**
 * Main function to call agent with fallback to mock
 */
async function callSkill(endpoint, payload) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If SmythOS is not properly configured (placeholder API key), use mock responses
  if (!SMYTHOS_API_KEY || SMYTHOS_API_KEY === 'your_actual_smythos_api_key_here') {
    console.log(`Using mock response for ${endpoint} (SmythOS not configured)`);
    return getMockResponse(cleanEndpoint, payload);
  }

  // Try to call the real SmythOS agent
  const result = await callSmythosAgent(endpoint, payload);
  
  if (result.success) {
    return result.data;
  } else {
    // If the agent call fails, log the error and return a mock response for development
    console.warn(`SmythOS agent call failed, using mock response:`, result.error);
    return getMockResponse(cleanEndpoint, payload);
  }
}

module.exports = { 
  callSkill,
  callSmythosAgent,
  AGENT_ENDPOINTS,
  SMYTHOS_AGENT_ID
};