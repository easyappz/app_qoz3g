const express = require('express');

const router = express.Router();

// Placeholder for future chess endpoints under /api/chess/*
const chessRouter = express.Router();
// Future chess routes will be added here (vs computer, move validation, etc.)
router.use('/chess', chessRouter);

// GET /api/hello
router.get('/hello', async (req, res) => {
  try {
    res.status(200).json({ message: 'Hello from API!' });
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Unknown error' });
  }
});

// GET /api/status
router.get('/status', async (req, res) => {
  try {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Unknown error' });
  }
});

module.exports = router;
