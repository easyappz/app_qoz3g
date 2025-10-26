import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';

export default function Game() {
  const { id } = useParams();
  return (
    <div className="space-y-6" data-easytag="id1-react/src/pages/Game.jsx">
      <header className="flex items-end justify-between" data-easytag="id2-react/src/pages/Game.jsx">
        <div data-easytag="id3-react/src/pages/Game.jsx">
          <h1 className="text-2xl font-semibold" data-easytag="id4-react/src/pages/Game.jsx">Игровое поле</h1>
          <p className="text-gray-600" data-easytag="id5-react/src/pages/Game.jsx">Игра #{id}</p>
        </div>
        <Link to="/" className="text-blue-600 hover:text-blue-700" data-easytag="id6-react/src/pages/Game.jsx">На главную</Link>
      </header>

      <section className="grid lg:grid-cols-3 gap-6" data-easytag="id7-react/src/pages/Game.jsx">
        <div className="lg:col-span-2 rounded-lg bg-white p-4 shadow" data-easytag="id8-react/src/pages/Game.jsx">
          <div className="w-full max-w-[520px] mx-auto" data-easytag="id9-react/src/pages/Game.jsx">
            <div className="rounded-md overflow-hidden" data-easytag="id10-react/src/pages/Game.jsx">
              <Chessboard id="BasicBoard" boardWidth={500} customDarkSquareStyle={{ backgroundColor: '#779952' }} customLightSquareStyle={{ backgroundColor: '#edeed1' }} />
            </div>
          </div>
        </div>
        <aside className="rounded-lg bg-white p-4 shadow" data-easytag="id11-react/src/pages/Game.jsx">
          <h2 className="text-lg font-semibold" data-easytag="id12-react/src/pages/Game.jsx">Панель</h2>
          <div className="mt-2 text-gray-600" data-easytag="id13-react/src/pages/Game.jsx">Здесь будут таймеры, ходы и чат.</div>
          <div className="mt-4 w-full h-28 bg-gray-100 rounded" data-easytag="id14-react/src/pages/Game.jsx"></div>
        </aside>
      </section>
    </div>
  );
}
