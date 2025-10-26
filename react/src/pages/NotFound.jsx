import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center space-y-6" data-easytag="id1-react/src/pages/NotFound.jsx">
      <header data-easytag="id2-react/src/pages/NotFound.jsx">
        <h1 className="text-3xl font-bold" data-easytag="id3-react/src/pages/NotFound.jsx">404 — Страница не найдена</h1>
        <p className="text-gray-600" data-easytag="id4-react/src/pages/NotFound.jsx">К сожалению, запрошенная страница не существует.</p>
      </header>
      <div data-easytag="id5-react/src/pages/NotFound.jsx">
        <Link to="/" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition" data-easytag="id6-react/src/pages/NotFound.jsx">На главную</Link>
      </div>
    </div>
  );
}
