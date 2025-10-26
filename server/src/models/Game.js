const mongoose = require('mongoose');

const MoveSchema = new mongoose.Schema(
  {
    san: { type: String, required: true },
    uci: { type: String, required: true },
    by: { type: String, enum: ['human', 'ai'], required: true },
  },
  { _id: false }
);

const GameSchema = new mongoose.Schema(
  {
    playerColor: { type: String, enum: ['white', 'black'], default: 'white' },
    difficulty: { type: String, enum: ['beginner', 'medium', 'expert'], required: true },
    status: { type: String, enum: ['in_progress', 'finished'], default: 'in_progress' },
    moves: { type: [MoveSchema], default: [] },
    fen: { type: String, default: '' },
    pgn: { type: String, default: '' },
    result: { type: String, enum: ['1-0', '0-1', '1/2-1/2', null], default: null },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: null },
    metadata: {
      startedFen: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

GameSchema.index({ createdAt: -1 });
GameSchema.index({ finishedAt: -1 });

module.exports = mongoose.model('Game', GameSchema);
