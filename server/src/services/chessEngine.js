const { Chess } = require('chess.js');

// Helper wrappers to support different chess.js method names across versions
function isGameOver(ch) { return typeof ch.isGameOver === 'function' ? ch.isGameOver() : ch.game_over(); }
function isCheckmate(ch) { return typeof ch.isCheckmate === 'function' ? ch.isCheckmate() : ch.in_checkmate(); }
function isStalemate(ch) { return typeof ch.isStalemate === 'function' ? ch.isStalemate() : ch.in_stalemate(); }
function isDraw(ch) { return typeof ch.isDraw === 'function' ? ch.isDraw() : ch.in_draw(); }
function isInsufficientMaterial(ch) { return typeof ch.isInsufficientMaterial === 'function' ? ch.isInsufficientMaterial() : ch.insufficient_material(); }
function isThreefoldRepetition(ch) { return typeof ch.isThreefoldRepetition === 'function' ? ch.isThreefoldRepetition() : ch.in_threefold_repetition(); }
function isCheck(ch) { return typeof ch.isCheck === 'function' ? ch.isCheck() : ch.in_check(); }

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0,
};

function evaluateBoard(chess, aiColor) {
  // Material balance
  let score = 0;
  const board = chess.board();
  for (let r = 0; r < board.length; r++) {
    const row = board[r];
    for (let c = 0; c < row.length; c++) {
      const piece = row[c];
      if (!piece) continue;
      const val = PIECE_VALUES[piece.type] || 0;
      score += piece.color === 'w' ? val : -val;
    }
  }

  // Mobility (simple): difference in number of legal moves for side to move, adjusted for AI perspective
  const legalMoves = chess.moves().length;
  const mobilityWeight = 2; // small weight
  if ((chess.turn() === 'w' && aiColor === 'white') || (chess.turn() === 'b' && aiColor === 'black')) {
    score += mobilityWeight * legalMoves;
  } else {
    score -= mobilityWeight * legalMoves;
  }

  // Check bonus/penalty
  const checkWeight = 20;
  if (isCheck(chess)) {
    // The side to move is in check => good for the opponent of side to move
    if ((chess.turn() === 'w' && aiColor === 'black') || (chess.turn() === 'b' && aiColor === 'white')) {
      score += checkWeight;
    } else {
      score -= checkWeight;
    }
  }

  // Convert to AI's perspective (positive is good for white by material convention above)
  return aiColor === 'white' ? score : -score;
}

function orderMoves(chess, movesVerbose) {
  // Simple move ordering: prefer captures and promotions
  return movesVerbose.sort((a, b) => {
    const aScore = (a.captured ? 1000 : 0) + (a.promotion ? 500 : 0);
    const bScore = (b.captured ? 1000 : 0) + (b.promotion ? 500 : 0);
    return bScore - aScore;
  });
}

function alphaBeta(chess, depth, alpha, beta, aiColor, maximizing) {
  if (depth === 0 || isGameOver(chess)) {
    return evaluateBoard(chess, aiColor);
  }

  const moves = orderMoves(chess, chess.moves({ verbose: true }));

  if (maximizing) {
    let value = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      chess.move(moves[i]);
      const child = alphaBeta(chess, depth - 1, alpha, beta, aiColor, false);
      chess.undo();
      if (child > value) value = child;
      if (value > alpha) alpha = value;
      if (alpha >= beta) break; // beta cut-off
    }
    return value;
  } else {
    let value = Infinity;
    for (let i = 0; i < moves.length; i++) {
      chess.move(moves[i]);
      const child = alphaBeta(chess, depth - 1, alpha, beta, aiColor, true);
      chess.undo();
      if (child < value) value = child;
      if (value < beta) beta = value;
      if (alpha >= beta) break; // alpha cut-off
    }
    return value;
  }
}

function bestMoveBySearch(fen, depth, aiColor) {
  const chess = new Chess(fen);
  const moves = orderMoves(chess, chess.moves({ verbose: true }));
  let best = null;
  let bestScore = -Infinity;

  for (let i = 0; i < moves.length; i++) {
    const mv = moves[i];
    chess.move(mv);
    const score = alphaBeta(chess, depth - 1, -Infinity, Infinity, aiColor, false);
    chess.undo();
    if (score > bestScore) {
      bestScore = score;
      best = mv;
    }
  }

  if (!best) return null;

  return {
    from: best.from,
    to: best.to,
    promotion: best.promotion || undefined,
    san: best.san,
    uci: `${best.from}${best.to}${best.promotion ? best.promotion : ''}`,
  };
}

function bestMoveBeginner(fen, aiColor) {
  // Depth 1: evaluate after one ply, pick from top-3 randomly
  const chess = new Chess(fen);
  const moves = orderMoves(chess, chess.moves({ verbose: true }));
  if (moves.length === 0) return null;

  const scored = [];
  for (let i = 0; i < moves.length; i++) {
    const mv = moves[i];
    chess.move(mv);
    const score = evaluateBoard(chess, aiColor);
    chess.undo();
    scored.push({ mv, score });
  }
  scored.sort((a, b) => b.score - a.score);

  const topK = scored.slice(0, Math.min(3, scored.length));
  const pick = topK[Math.floor(Math.random() * topK.length)];
  const best = pick.mv;

  return {
    from: best.from,
    to: best.to,
    promotion: best.promotion || undefined,
    san: best.san,
    uci: `${best.from}${best.to}${best.promotion ? best.promotion : ''}`,
  };
}

function bestMoveMedium(fen, aiColor) {
  // Depth 3 alpha-beta
  return bestMoveBySearch(fen, 3, aiColor);
}

function bestMoveExpert(fen, aiColor) {
  // Depth 4 alpha-beta
  return bestMoveBySearch(fen, 4, aiColor);
}

function getBestMove(fen, difficulty, aiColor) {
  if (!fen) throw new Error('FEN is required');
  if (!['white', 'black'].includes(aiColor)) throw new Error('Invalid aiColor');

  if (difficulty === 'beginner') return bestMoveBeginner(fen, aiColor);
  if (difficulty === 'medium') return bestMoveMedium(fen, aiColor);
  if (difficulty === 'expert') return bestMoveExpert(fen, aiColor);
  throw new Error('Unsupported difficulty');
}

module.exports = { getBestMove };
