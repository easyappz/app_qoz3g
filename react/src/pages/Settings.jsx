import React from 'react';

export default function Settings() {
  return (
    <div className="space-y-6" data-easytag="id1-react/src/pages/Settings.jsx">
      <header data-easytag="id2-react/src/pages/Settings.jsx">
        <h1 className="text-2xl font-semibold" data-easytag="id3-react/src/pages/Settings.jsx">Настройки</h1>
        <p className="text-gray-600" data-easytag="id4-react/src/pages/Settings.jsx">Выберите параметры интерфейса и игры.</p>
      </header>

      <form className="grid gap-4 max-w-xl" data-easytag="id5-react/src/pages/Settings.jsx" onSubmit={(e) => e.preventDefault()}>
        <div data-easytag="id6-react/src/pages/Settings.jsx">
          <label className="block text-sm font-medium mb-1" htmlFor="theme" data-easytag="id7-react/src/pages/Settings.jsx">Тема</label>
          <select id="theme" className="w-full border rounded-md px-3 py-2" data-easytag="id8-react/src/pages/Settings.jsx">
            <option value="light" data-easytag="id9-react/src/pages/Settings.jsx">Светлая</option>
            <option value="dark" data-easytag="id10-react/src/pages/Settings.jsx">Тёмная</option>
          </select>
        </div>

        <div data-easytag="id11-react/src/pages/Settings.jsx">
          <label className="block text-sm font-medium mb-1" htmlFor="timer" data-easytag="id12-react/src/pages/Settings.jsx">Таймер (минут)</label>
          <input id="timer" type="number" min="1" max="60" className="w-full border rounded-md px-3 py-2" placeholder="10" data-easytag="id13-react/src/pages/Settings.jsx" />
        </div>

        <div className="flex items-center gap-3" data-easytag="id14-react/src/pages/Settings.jsx">
          <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition" data-easytag="id15-react/src/pages/Settings.jsx">Сохранить</button>
          <button type="reset" className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition" data-easytag="id16-react/src/pages/Settings.jsx">Сбросить</button>
        </div>
      </form>
    </div>
  );
}
