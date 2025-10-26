const express = require('express');
const { createGame, getGame, listGames, makeMove, exportPGN } = require('@src/controllers/gamesController');

const router = express.Router();

// Chess API routes under /api/chess/*
const chessRouter = express.Router();

// POST /api/chess/games -> create a new game
chessRouter.post('/games', async (req, res) => {
  try {
    await createGame(req, res);
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Unknown error' });
  }
});

// GET /api/chess/games -> list games with pagination
chessRouter.get('/games', async (req, res) => {
  try {
    await listGames(req, res);
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Unknown error' });
  }
});

// GET /api/chess/games/:id -> get game by id
chessRouter.get('/games/:id', async (req, res) => {
  try {
    await getGame(req, res);
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Unknown error' });
  }
});

// POST /api/chess/games/:id/move -> make move
chessRouter.post('/games/:id/move', async (req, res) => {
  try {
    await makeMove(req, res);
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Unknown error' });
  }
});

// GET /api/chess/games/:id/export -> export PGN
chessRouter.get('/games/:id/export', async (req, res) => {
  try {
    await exportPGN(req, res);
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Unknown error' });
  }
});

router.use('/chess', chessRouter);

// Existing sample endpoints
router.get('/hello', async (req, res) => {
  try {
    res.status(200).json({ message: 'Hello from API!' });
  } catch (err) {
    res.status(500).json({ error: err && err.message ? err.message : 'Unknown error' });
  }
});

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
