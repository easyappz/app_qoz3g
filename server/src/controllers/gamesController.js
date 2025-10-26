const { Chess } = require('chess.js');
const Game = require('@src/models/Game');
const { getBestMove } = require('@src/services/chessEngine');

// Helper wrappers to support different chess.js method names across versions
function isGameOver(ch) { return typeof ch.isGameOver === 'function' ? ch.isGameOver() : ch.game_over(); }
function isCheckmate(ch) { return typeof ch.isCheckmate === 'function' ? ch.isCheckmate() : ch.in_checkmate(); }
function isStalemate(ch) { return typeof ch.isStalemate === 'function' ? ch.isStalemate() : ch.in_stalemate(); }
function isDraw(ch) { return typeof ch.isDraw === 'function' ? ch.isDraw() : ch.in_draw(); }
function isInsufficientMaterial(ch) { return typeof ch.isInsufficientMaterial === 'function' ? ch.isInsufficientMaterial() : ch.insufficient_material(); }
function isThreefoldRepetition(ch) { return typeof ch.isThreefoldRepetition === 'function' ? ch.isThreefoldRepetition() : ch.in_threefold_repetition(); }

function loadPGN(chess, pgn) {
  if (!pgn) return true;
  if (typeof chess.loadPgn === 'function') return chess.loadPgn(pgn);
  if (typeof chess.load_pgn === 'function') return chess.load_pgn(pgn);
  return false;
}

function getResultFromState(chess) {
  if (!isGameOver(chess)) return null;
  if (isCheckmate(chess)) {
    // Side to move is checkmated => opponent won
    return chess.turn() === 'w' ? '0-1' : '1-0';
  }
  if (isStalemate(chess) || isInsufficientMaterial(chess) || isThreefoldRepetition(chess) || isDraw(chess)) {
    return '1/2-1/2';
  }
  return '1/2-1/2';
}

function moveToUci(moveObj) {
  if (!moveObj) return '';
  const promo = moveObj.promotion ? moveObj.promotion : '';
  return `${moveObj.from}${moveObj.to}${promo}`;
}

function colorOpposite(color) {
  return color === 'white' ? 'black' : 'white';
}

async function createGame(req, res) {
  try {
    const { difficulty, playerColor } = req.body || {};

    const allowed = ['beginner', 'medium', 'expert'];
    if (!allowed.includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty. Use one of: beginner, medium, expert' });
    }

    const player = ['white', 'black'].includes(playerColor) ? playerColor : 'white';

    const chess = new Chess();
    let fen = chess.fen();
    let pgn = chess.pgn();
    const moves = [];

    // If player chooses black, AI makes the first move
    if (player === 'black') {
      const aiColor = 'white';
      const aiBest = getBestMove(fen, difficulty, aiColor);
      if (!aiBest) {
        return res.status(500).json({ error: 'Engine failed to generate opening move' });
      }
      const applied = chess.move({ from: aiBest.from, to: aiBest.to, promotion: aiBest.promotion });
      if (!applied) {
        return res.status(500).json({ error: 'Engine produced illegal opening move' });
      }
      fen = chess.fen();
      pgn = chess.pgn();
      moves.push({ san: applied.san, uci: moveToUci(applied), by: 'ai' });
    }

    const game = await Game.create({
      playerColor: player,
      difficulty,
      status: 'in_progress',
      moves,
      fen,
      pgn,
      result: null,
      startedAt: new Date(),
      finishedAt: null,
      metadata: { startedFen: (new Chess()).fen() },
    });

    const payload = {
      id: game._id.toString(),
      fen: game.fen,
      pgn: game.pgn,
      difficulty: game.difficulty,
      playerColor: game.playerColor,
      status: game.status,
    };

    return res.status(201).json({ game: payload });
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
}

async function getGame(req, res) {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    return res.status(200).json({ game });
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
}

async function listGames(req, res) {
  try {
    const page = Number.parseInt(req.query.page || '1', 10);
    const limit = Number.parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Game.find({}).sort({ startedAt: -1 }).skip(skip).limit(limit),
      Game.countDocuments({}),
    ]);

    return res.status(200).json({ items, total, page, limit });
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
}

async function makeMove(req, res) {
  try {
    const { id } = req.params;
    const { from, to, promotion } = req.body || {};

    if (!from || !to) {
      return res.status(400).json({ error: 'Both "from" and "to" are required' });
    }

    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status === 'finished') return res.status(400).json({ error: 'Game already finished' });

    const chess = new Chess();
    if (game.pgn && game.pgn.length > 0) {
      const ok = loadPGN(chess, game.pgn);
      if (!ok) return res.status(500).json({ error: 'Failed to load game PGN' });
    }

    const expectedTurn = game.playerColor === 'white' ? 'w' : 'b';
    if (chess.turn() !== expectedTurn) {
      return res.status(400).json({ error: "It's not player's turn" });
    }

    // Try to apply player's move
    let applied = chess.move({ from, to, promotion });

    // If move requires promotion and not provided, try default to queen
    if (!applied) {
      const legalVerbose = chess.moves({ verbose: true });
      const needsPromotion = legalVerbose.some(m => m.from === from && m.to === to && !!m.promotion);
      if (needsPromotion) {
        applied = chess.move({ from, to, promotion: 'q' });
      }
    }

    if (!applied) {
      return res.status(400).json({ error: 'Illegal move' });
    }

    const newMoves = [...game.moves, { san: applied.san, uci: `${applied.from}${applied.to}${applied.promotion ? applied.promotion : ''}`, by: 'human' }];

    // Check end state after player's move
    if (isGameOver(chess)) {
      const result = getResultFromState(chess);
      game.status = 'finished';
      game.result = result;
      game.finishedAt = new Date();
      game.fen = chess.fen();
      game.pgn = chess.pgn();
      game.moves = newMoves;
      await game.save();
      return res.status(200).json({ game });
    }

    // AI move
    const aiColor = game.playerColor === 'white' ? 'black' : 'white';
    if ((aiColor === 'white' && chess.turn() !== 'w') || (aiColor === 'black' && chess.turn() !== 'b')) {
      return res.status(500).json({ error: 'Engine turn mismatch' });
    }

    const aiBest = getBestMove(chess.fen(), game.difficulty, aiColor);
    if (!aiBest) {
      return res.status(500).json({ error: 'Engine failed to generate move' });
    }

    const aiApplied = chess.move({ from: aiBest.from, to: aiBest.to, promotion: aiBest.promotion });
    if (!aiApplied) {
      return res.status(500).json({ error: 'Engine produced illegal move' });
    }

    newMoves.push({ san: aiApplied.san, uci: `${aiApplied.from}${aiApplied.to}${aiApplied.promotion ? aiApplied.promotion : ''}`, by: 'ai' });

    // Update game status
    let status = 'in_progress';
    let result = null;
    if (isGameOver(chess)) {
      status = 'finished';
      result = getResultFromState(chess);
      game.finishedAt = new Date();
    }

    game.status = status;
    game.result = result;
    game.fen = chess.fen();
    game.pgn = chess.pgn();
    game.moves = newMoves;

    await game.save();

    return res.status(200).json({ game });
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
}

async function exportPGN(req, res) {
  try {
    const { id } = req.params;
    const format = (req.query && req.query.format) || 'json';

    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const pgn = game.pgn || '';

    if (format === 'text') {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(pgn);
    }

    return res.status(200).json({ pgn });
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
}

module.exports = {
  createGame,
  getGame,
  listGames,
  makeMove,
  exportPGN,
};
