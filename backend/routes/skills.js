const express = require('express');
const multer = require('multer');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and audio files
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp3|wav|ogg|m4a|aac|flac/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and audio files are allowed'));
    }
  }
});

// Routes without file upload
router.post('/storybook', authMiddleware, require('../controllers/storybookController').createStorybook);
router.post('/sign', authMiddleware, require('../controllers/signLangController').createSignVideo);
router.post('/audiobook', authMiddleware, require('../controllers/audiobookController').createAudiobook);
router.post('/social_story', authMiddleware, require('../controllers/socialStoryController').createSocialStory);
router.post('/math', authMiddleware, require('../controllers/mathController').solve);
router.post('/emotion', authMiddleware, require('../controllers/emotionController').support);
router.post('/comm_board', authMiddleware, require('../controllers/commBoardController').create);

// Routes with file upload support
router.post('/live_caption', authMiddleware, upload.single('audio_file'), require('../controllers/liveCaptionController').startLiveCaption);
router.post('/describe_image', authMiddleware, upload.single('image_file'), require('../controllers/describeImageController').describe);

module.exports = router;
