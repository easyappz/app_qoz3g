import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8" data-easytag="id1-react/src/pages/Home.jsx">
      <header className="text-center" data-easytag="id2-react/src/pages/Home.jsx">
        <h1 className="text-3xl font-bold" data-easytag="id3-react/src/pages/Home.jsx">Шахматы онлайн</h1>
        <p className="text-gray-600 mt-2" data-easytag="id4-react/src/pages/Home.jsx">Начните новую партию или откройте историю игр. Интерфейс аккуратный и понятный.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-6" data-easytag="id5-react/src/pages/Home.jsx">
        <div className="rounded-lg bg-white p-6 shadow" data-easytag="id6-react/src/pages/Home.jsx">
          <h2 className="text-xl font-semibold" data-easytag="id7-react/src/pages/Home.jsx">Быстрый старт</h2>
          <div className="mt-4 flex flex-wrap gap-3" data-easytag="id8-react/src/pages/Home.jsx">
            <Link to="/game/1" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition" data-easytag="id9-react/src/pages/Home.jsx">Новая игра</Link>
            <Link to="/history" className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition" data-easytag="id10-react/src/pages/Home.jsx">История</Link>
            <Link to="/settings" className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition" data-easytag="id11-react/src/pages/Home.jsx">Настройки</Link>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow" data-easytag="id12-react/src/pages/Home.jsx">
          <h2 className="text-xl font-semibold" data-easytag="id13-react/src/pages/Home.jsx">Изображение</h2>
          <div className="mt-4 w-full h-48 bg-gray-100 rounded-md" data-easytag="id14-react/src/pages/Home.jsx"></div>
        </div>
      </section>
    </div>
  );
}
