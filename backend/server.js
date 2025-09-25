require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skills');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(cors());

console.log('Connecting to DB:', `${process.env.MONGODB_URI}/Sharif_Bhai`);
connectDB(`${process.env.MONGODB_URI}/Sharif_Bhai`);

app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

// `${process.env.MONGODB_URI}/${ DB_NAME }`
