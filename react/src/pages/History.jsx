import React from 'react';

export default function History() {
  return (
    <div className="space-y-6" data-easytag="id1-react/src/pages/History.jsx">
      <header data-easytag="id2-react/src/pages/History.jsx">
        <h1 className="text-2xl font-semibold" data-easytag="id3-react/src/pages/History.jsx">История игр</h1>
        <p className="text-gray-600" data-easytag="id4-react/src/pages/History.jsx">Ваши последние партии будут отображаться здесь.</p>
      </header>

      <section className="rounded-lg bg-white p-4 shadow" data-easytag="id5-react/src/pages/History.jsx">
        <ul className="divide-y" data-easytag="id6-react/src/pages/History.jsx">
          <li className="py-3 flex items-center justify-between" data-easytag="id7-react/src/pages/History.jsx">
            <span data-easytag="id8-react/src/pages/History.jsx">Партия #1 — Победа</span>
            <span className="text-gray-500" data-easytag="id9-react/src/pages/History.jsx">Сегодня</span>
          </li>
          <li className="py-3 flex items-center justify-between" data-easytag="id10-react/src/pages/History.jsx">
            <span data-easytag="id11-react/src/pages/History.jsx">Партия #2 — Поражение</span>
            <span className="text-gray-500" data-easytag="id12-react/src/pages/History.jsx">Вчера</span>
          </li>
          <li className="py-3 flex items-center justify-between" data-easytag="id13-react/src/pages/History.jsx">
            <span data-easytag="id14-react/src/pages/History.jsx">Партия #3 — Ничья</span>
            <span className="text-gray-500" data-easytag="id15-react/src/pages/History.jsx">На этой неделе</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
