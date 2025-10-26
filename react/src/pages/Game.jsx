import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Tag, Button, message, Space, Divider } from 'antd';
import { Chessboard } from 'react-chessboard';
import dayjs from 'dayjs';
import { getGame, makeMove, exportPGN } from '../api/chess';

const { Title, Text } = Typography;

function useGameData(id) {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGame(id);
      setGame(data.game);
    } catch (e) {
      message.error('Не удалось загрузить партию');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, game, setGame, refresh };
}

function formatMoveList(moves) {
  const pairs = [];
  let current = [];
  for (let i = 0; i < moves.length; i += 1) {
    const m = moves[i];
    current.push(m && m.san ? m.san : m.uci);
    if (current.length === 2) {
      pairs.push(current);
      current = [];
    }
  }
  if (current.length === 1) pairs.push(current);
  return pairs;
}

export default function Game() {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;
  const { loading, game, setGame, refresh } = useGameData(id);

  const orientation = useMemo(() => {
    if (!game) return 'white';
    return game.playerColor === 'black' ? 'black' : 'white';
  }, [game]);

  const fen = game && game.fen ? game.fen : undefined;
  const statusText = useMemo(() => {
    if (!game) return '';
    if (game.status === 'finished') {
      const r = game.result || '—';
      return `Завершена: ${r}`;
    }
    return 'В процессе';
  }, [game]);

  const onDrop = useCallback(
    async (sourceSquare, targetSquare) => {
      if (!game) return false;
      if (game.status === 'finished') {
        message.info('Партия завершена');
        return false;
      }
      try {
        const data = await makeMove(id, { from: sourceSquare, to: targetSquare });
        if (!data || !data.game) {
          message.error('Некорректный ответ сервера');
          return false;
        }
        setGame(data.game);
        return true;
      } catch (e) {
        message.error('Недопустимый ход');
        await refresh();
        return false;
      }
    },
    [game, id, refresh, setGame]
  );

  const handleExport = useCallback(
    async () => {
      try {
        const text = await exportPGN(id, 'text');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `game-${id}.pgn`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        message.success('PGN экспортирован');
      } catch (e) {
        message.error('Не удалось экспортировать PGN');
      }
    },
    [id]
  );

  const moves = game && Array.isArray(game.moves) ? game.moves : [];
  const movePairs = useMemo(() => formatMoveList(moves), [moves]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-easytag="id1-react/src/pages/Game.jsx">
      <div className="lg:col-span-2" data-easytag="id2-react/src/pages/Game.jsx">
        <Card className="bg-white shadow" loading={loading} data-easytag="id3-react/src/pages/Game.jsx">
          <div className="flex items-center justify-between mb-4" data-easytag="id4-react/src/pages/Game.jsx">
            <Title level={4} className="!mb-0" data-easytag="id5-react/src/pages/Game.jsx">Игровое поле</Title>
            <Space data-easytag="id6-react/src/pages/Game.jsx">
              <Tag color="blue" data-easytag="id7-react/src/pages/Game.jsx">{game ? (game.playerColor === 'black' ? 'Черные' : 'Белые') : ''}</Tag>
              <Tag data-easytag="id8-react/src/pages/Game.jsx">{game ? (
                game.difficulty === 'expert' ? 'Эксперт' : game.difficulty === 'medium' ? 'Средний' : 'Новичок'
              ) : ''}</Tag>
            </Space>
          </div>

          <div className="w-full" data-easytag="id9-react/src/pages/Game.jsx">
            <div className="mx-auto" style={{ maxWidth: 600 }} data-easytag="id10-react/src/pages/Game.jsx">
              <Chessboard
                id="chessboard"
                position={fen}
                boardOrientation={orientation}
                arePiecesDraggable={!loading && game && game.status !== 'finished'}
                onPieceDrop={onDrop}
                customBoardStyle={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>

          <Divider data-easytag="id11-react/src/pages/Game.jsx" />
          <div className="flex items-center justify-between" data-easytag="id12-react/src/pages/Game.jsx">
            <Text data-easytag="id13-react/src/pages/Game.jsx">Статус: {statusText}</Text>
            <Space data-easytag="id14-react/src/pages/Game.jsx">
              <Button onClick={refresh} data-easytag="id15-react/src/pages/Game.jsx">Обновить</Button>
              <Button type="primary" onClick={handleExport} data-easytag="id16-react/src/pages/Game.jsx">Экспорт PGN</Button>
            </Space>
          </div>
        </Card>
      </div>

      <div data-easytag="id17-react/src/pages/Game.jsx">
        <Card title="Ходы" className="bg-white shadow" loading={loading} data-easytag="id18-react/src/pages/Game.jsx">
          <div className="grid grid-cols-3 gap-2 text-sm" data-easytag="id19-react/src/pages/Game.jsx">
            <div className="font-semibold text-gray-500" data-easytag="id20-react/src/pages/Game.jsx">№</div>
            <div className="font-semibold text-gray-500" data-easytag="id21-react/src/pages/Game.jsx">Белые</div>
            <div className="font-semibold text-gray-500" data-easytag="id22-react/src/pages/Game.jsx">Черные</div>
            {movePairs.map((pair, idx) => (
              <React.Fragment key={idx}>
                <div className="text-gray-700" data-easytag={`id23-${idx}-react/src/pages/Game.jsx`}>{idx + 1}</div>
                <div className="text-gray-900" data-easytag={`id24-${idx}-react/src/pages/Game.jsx`}>{pair[0] || ''}</div>
                <div className="text-gray-900" data-easytag={`id25-${idx}-react/src/pages/Game.jsx`}>{pair[1] || ''}</div>
              </React.Fragment>
            ))}
          </div>

          <Divider data-easytag="id26-react/src/pages/Game.jsx" />
          <div className="space-y-1 text-xs text-gray-500" data-easytag="id27-react/src/pages/Game.jsx">
            <div data-easytag="id28-react/src/pages/Game.jsx">Начата: {game && game.startedAt ? dayjs(game.startedAt).format('DD.MM.YYYY HH:mm') : '—'}</div>
            <div data-easytag="id29-react/src/pages/Game.jsx">Обновлена: {game && game.updatedAt ? dayjs(game.updatedAt).format('DD.MM.YYYY HH:mm') : '—'}</div>
          </div>

          <Divider data-easytag="id30-react/src/pages/Game.jsx" />
          <Space data-easytag="id31-react/src/pages/Game.jsx">
            <Button onClick={() => navigate('/')} data-easytag="id32-react/src/pages/Game.jsx">На главную</Button>
            <Button onClick={() => navigate('/history')} data-easytag="id33-react/src/pages/Game.jsx">История игр</Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
