const { callSkill } = require('../services/smythosService');

exports.startLiveCaption = async (req, res, next) => {
  try {
    const { audio_base64, audio_file, language = 'en', format = 'srt' } = req.body;
    
    if (!audio_base64 && !req.file && !audio_file) {
      return res.status(400).json({
        message: 'Audio data required. Please provide audio_base64, upload an audio file, or provide audio_file data.'
      });
    }
    
    let audioData = audio_base64;
    if (req.file) {
      // Convert uploaded audio file to base64
      audioData = req.file.buffer.toString('base64');
    } else if (audio_file) {
      audioData = audio_file;
    }
    
    const payload = { 
      audio_stream: audioData,
      language,
      format,
      enable_timestamps: true,
      enable_confidence_scores: true
    };
    
    const result = await callSkill('live_caption', payload);
    
    res.json({
      success: true,
      result,
      message: 'Audio transcription completed successfully',
      metadata: {
        language: language,
        format: format,
        processed_at: new Date().toISOString()
      }
    });
  } catch(err){ 
    console.error('Live caption error:', err);
    next(err); 
  }
}
