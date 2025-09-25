const { callSkill } = require('../services/smythosService');
const Resource = require('../models/Resource');

exports.createSignVideo = async (req, res, next) => {
  try {
    const { content, title, dialect, difficulty_level, include_fingerspelling } = req.body;
    if(!content) return res.status(400).json({ 
      message: 'Content is required to create sign language instructions' 
    });
    
    const payload = { 
      content, 
      title: title || 'Sign Language Lesson',
      dialect: dialect || 'ASL',
      difficulty_level: difficulty_level || 'beginner',
      include_fingerspelling: include_fingerspelling || false
    };
    
    const result = await callSkill('create_sign_language', payload);
    
    const resource = await Resource.create({ 
      owner: req.user._id, 
      type: 'sign_video', 
      title: result.title || title || 'Sign Language Lesson', 
      meta: result.meta || {}, 
      smythosId: result.id, 
      storageUrl: result.url,
      content: result.video_script
    });
    
    res.json({ 
      success: true,
      resource, 
      result,
      message: 'Sign language lesson created successfully! The script includes detailed instructions for clear signing.'
    });
  } catch(err){ 
    console.error('Sign language creation error:', err);
    next(err); 
  }
}
