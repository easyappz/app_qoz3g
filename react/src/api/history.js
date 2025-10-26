import { listGames } from './chess';

/**
 * Simple wrapper for listing games history
 * @param {{ page?: number, limit?: number }} params
 * @returns {Promise<any>}
 */
export async function fetchHistory(params = {}) {
  return listGames(params);
}
