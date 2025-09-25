const { callSkill } = require('../services/smythosService');
const Resource = require('../models/Resource');

exports.createStorybook = async (req, res, next) => {
  try {
    const { content, title, options = {} } = req.body;
    if(!content) return res.status(400).json({ 
      message: 'Content is required to create a storybook' 
    });
    
    // Enhanced payload with accessibility options
    const payload = { 
      content, 
      title: title || 'Educational Storybook',
      options: {
        dyslexia_friendly: options.dyslexia_friendly || true,
        reading_level: options.reading_level || 'grade5',
        include_images: options.include_images || true,
        simple_sentences: options.simple_sentences || true,
        ...options
      }
    };
    
    const result = await callSkill('create_storybook', payload);
    
    const resource = await Resource.create({ 
      owner: req.user._id, 
      type: 'storybook', 
      title: result.title || title || 'Storybook', 
      meta: result.meta || {}, 
      smythosId: result.id, 
      storageUrl: result.url,
      content: result.storybook_content
    });
    
    res.json({ 
      success: true,
      resource, 
      result,
      message: 'Storybook created successfully! The content is ready for reading.'
    });
  } catch(err){ 
    console.error('Storybook creation error:', err);
    next(err); 
  }
}
