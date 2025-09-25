const { callSkill } = require('../services/smythosService');

exports.support = async (req, res, next) => {
  try {
    const { emotion_input, situation = 'general', age_group = 'teen' } = req.body;
    if(!emotion_input) return res.status(400).json({message:'emotion_input required'});
    
    const payload = { 
      emotion_input, 
      situation, 
      age_group 
    };
    
    const result = await callSkill('emotion_support', payload);
    res.json(result);
  } catch(err){ next(err); }
}
