import instance from './axios';

const BASE_PATH = '/api/chess/games';

/**
 * Create a new chess game
 * @param {{ difficulty: 'beginner'|'medium'|'expert', playerColor?: 'white'|'black' }} payload
 * @returns {Promise<any>} server response data
 */
export async function createGame({ difficulty, playerColor } = {}) {
  if (!difficulty) {
    throw new Error('difficulty is required');
  }

  const body = { difficulty };
  if (playerColor) {
    body.playerColor = playerColor;
  }

  const res = await instance.post(`${BASE_PATH}`, body);
  return res.data;
}

/**
 * Get a game by id
 * @param {string} id
 * @returns {Promise<any>} server response data
 */
export async function getGame(id) {
  if (!id) {
    throw new Error('id is required');
  }

  const res = await instance.get(`${BASE_PATH}/${encodeURIComponent(id)}`);
  return res.data;
}

/**
 * List games with pagination
 * @param {{ page?: number, limit?: number }} params
 * @returns {Promise<any>} server response data
 */
export async function listGames({ page, limit } = {}) {
  const res = await instance.get(`${BASE_PATH}`, {
    params: {
      page,
      limit,
    },
  });
  return res.data;
}

/**
 * Make a move for a game and get updated state
 * @param {string} id
 * @param {{ from: string, to: string, promotion?: string }} move
 * @returns {Promise<any>} server response data
 */
export async function makeMove(id, { from, to, promotion } = {}) {
  if (!id) {
    throw new Error('id is required');
  }
  if (!from || !to) {
    throw new Error('from and to are required');
  }

  const body = { from, to };
  if (promotion) {
    body.promotion = promotion;
  }

  const res = await instance.post(`${BASE_PATH}/${encodeURIComponent(id)}/move`, body);
  return res.data;
}

/**
 * Export game PGN
 * Returns string by default, or Blob if options.asBlob === true
 * @param {string} id
 * @param {{ asBlob?: boolean }} options
 * @returns {Promise<string|Blob>}
 */
export async function exportPGN(id, { asBlob = false } = {}) {
  if (!id) {
    throw new Error('id is required');
  }

  if (asBlob) {
    const res = await instance.get(`${BASE_PATH}/${encodeURIComponent(id)}/export`, {
      params: { format: 'text' },
      responseType: 'blob',
      headers: {
        Accept: 'text/plain',
      },
    });
    return res.data; // Blob
  }

  const res = await instance.get(`${BASE_PATH}/${encodeURIComponent(id)}/export`, {
    params: { format: 'text' },
    responseType: 'text',
    headers: {
      Accept: 'text/plain',
    },
    // Axios v1 allows 'text' responseType which returns string in data
  });
  return res.data; // string
}

/**
 * Optional: Fetch PGN as JSON (returns { pgn: string })
 * Kept separate for callers who prefer schema JSON format
 * @param {string} id
 * @returns {Promise<{ pgn: string }>}
 */
export async function exportPGNJson(id) {
  if (!id) {
    throw new Error('id is required');
  }
  const res = await instance.get(`${BASE_PATH}/${encodeURIComponent(id)}/export`, {
    params: { format: 'json' },
    headers: {
      Accept: 'application/json',
    },
  });
  return res.data;
}
