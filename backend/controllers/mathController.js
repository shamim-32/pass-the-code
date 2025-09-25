const { callSkill } = require('../services/smythosService');

exports.solve = async (req, res, next) => {
  try {
    const { problem, grade_level = 'middle school', learning_style = 'visual' } = req.body;
    if(!problem) return res.status(400).json({message:'problem required'});
    
    const payload = { 
      problem, 
      grade_level, 
      learning_style 
    };
    
    const result = await callSkill('math_help', payload);
    res.json(result);
  } catch(err){ next(err); }
}
