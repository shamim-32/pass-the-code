const { callSkill } = require('../services/smythosService');
const Resource = require('../models/Resource');

exports.create = async (req, res, next) => {
  try {
    const { 
      vocabulary_focus = 'basic needs', 
      age_level = 'child', 
      communication_goals = 'daily communication',
      custom_words = [],
      board_size = 'standard'
    } = req.body;
    
    const payload = { 
      vocabulary_focus, 
      age_level, 
      communication_goals,
      custom_words,
      board_size
    };
    
    const result = await callSkill('create_comm_board', payload);
    
    const resource = await Resource.create({ 
      owner: req.user._id, 
      type: 'comm_board', 
      title: result.title || 'Communication Board', 
      meta: result.meta || {}, 
      smythosId: result.id,
      content: result.comm_board_layout
    });
    
    res.json({ 
      success: true,
      resource, 
      result,
      message: 'Communication board created successfully! The board is ready for use.'
    });
  } catch(err){ 
    console.error('Communication board creation error:', err);
    next(err); 
  }
}
