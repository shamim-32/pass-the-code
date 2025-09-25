const { callSkill } = require('../services/smythosService');
const Resource = require('../models/Resource');

exports.describe = async (req, res, next) => {
  try {
    const { image_base64, image_file, context = 'Educational content', detail_level = 'detailed' } = req.body;
    
    // Accept either base64 string or file upload
    if (!image_base64 && !req.file && !image_file) {
      return res.status(400).json({
        message: 'Image required. Please provide image_base64, upload a file, or provide image_file data.'
      });
    }
    
    let imageData = image_base64;
    if (req.file) {
      // Convert uploaded file to base64
      imageData = req.file.buffer.toString('base64');
    } else if (image_file) {
      imageData = image_file;
    }
    
    const payload = { 
      image: imageData,
      context, 
      detail_level 
    };
    
    const result = await callSkill('describe_image', payload);
    
    const resource = await Resource.create({ 
      owner: req.user._id, 
      type: 'image_description', 
      title: result.title || 'Image Description', 
      meta: result.meta || {}, 
      smythosId: result.id,
      content: result.description
    });
    
    res.json({ 
      success: true,
      result, 
      resource,
      message: 'Image description generated successfully'
    });
  } catch(err){ 
    console.error('Image description error:', err);
    next(err); 
  }
}
