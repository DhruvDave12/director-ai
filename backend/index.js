require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Jobs Router
const jobsRouter = express.Router();

// Get quote endpoint
jobsRouter.post('/quote', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required'
      });
    }

    // Use Gemini API to generate response
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      quote: text,
      prompt: prompt,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating quote:', error);
    res.status(500).json({
      error: 'Failed to generate quote',
      message: error.message
    });
  }
});

// Execute job endpoint
jobsRouter.post('/execute-job', async (req, res) => {
  try {
    const { jobId, prompt, parameters } = req.body;
    
    if (!jobId || !prompt) {
      return res.status(400).json({
        error: 'jobId and prompt are required'
      });
    }

    // Use Gemini API to process the job
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      jobId: jobId,
      result: text,
      prompt: prompt,
      parameters: parameters || {},
      status: 'completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error executing job:', error);
    res.status(500).json({
      error: 'Failed to execute job',
      message: error.message,
      jobId: req.body.jobId || null
    });
  }
});

// Mount jobs router
app.use('/api/jobs', jobsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the API`);
});

module.exports = app;
