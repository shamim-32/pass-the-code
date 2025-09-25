const { callSkill } = require('../services/smythosService');
const Resource = require('../models/Resource');

exports.createAudiobook = async (req, res, next) => {
  try {
    const { content, title, voice_preference, reading_speed, age_group } = req.body;
    if(!content) return res.status(400).json({ 
      message: 'Content is required to create an audiobook' 
    });
    
    const payload = { 
      content, 
      title: title || 'Educational Audiobook',
      voice_preference: voice_preference || 'alloy',
      reading_speed: reading_speed || 'normal',
      age_group: age_group || 'general'
    };
    
    const result = await callSkill('create_audiobook', payload);
    
    const resource = await Resource.create({ 
      owner: req.user._id, 
      type: 'audiobook', 
      title: result.title || title || 'Audiobook', 
      meta: result.meta || {}, 
      smythosId: result.id, 
      storageUrl: result.url,
      content: result.audio_script
    });
    
    res.json({ 
      success: true,
      resource, 
      result,
      message: 'Audiobook created successfully! The script is ready for narration.'
    });
  } catch(err){ 
    console.error('Audiobook creation error:', err);
    next(err); 
  }
}
