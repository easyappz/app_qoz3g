import instance from './axios';

export async function createGame(payload) {
  // payload: { difficulty: 'beginner'|'medium'|'expert', playerColor?: 'white'|'black' }
  const res = await instance.post('/api/chess/games', payload);
  return res.data;
}

export async function getGame(id) {
  const res = await instance.get(`/api/chess/games/${id}`);
  return res.data;
}

export async function listGames({ page = 1, limit = 10 } = {}) {
  const res = await instance.get('/api/chess/games', { params: { page, limit } });
  return res.data;
}

export async function makeMove(id, payload) {
  // payload: { from: 'e2', to: 'e4', promotion?: 'q' }
  const res = await instance.post(`/api/chess/games/${id}/move`, payload);
  return res.data;
}

export async function exportPGN(id, format = 'json') {
  if (format === 'text') {
    const res = await instance.get(`/api/chess/games/${id}/export`, {
      params: { format: 'text' },
      responseType: 'text',
    });
    return res.data; // string
  }
  const res = await instance.get(`/api/chess/games/${id}/export`, { params: { format: 'json' } });
  return res.data; // { pgn: string }
}
