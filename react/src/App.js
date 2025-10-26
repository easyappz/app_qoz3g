import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Home from './pages/Home';
import Game from './pages/Game';
import Settings from './pages/Settings';
import History from './pages/History';
import NotFound from './pages/NotFound';
import './App.css';

const { Header, Content, Footer } = Layout;

const routesList = ['/', '/game/:id', '/settings', '/history', '*'];

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      window.handleRoutes(routesList);
    }
  }, []);

  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

function AppLayout() {
  const location = useLocation();
  const selectedKey = location.pathname.startsWith('/settings')
    ? '/settings'
    : location.pathname.startsWith('/history')
    ? '/history'
    : '/';

  const items = [
    { key: '/', label: <Link to="/" data-easytag="id6-react/src/App.js">Главная</Link> },
    { key: '/settings', label: <Link to="/settings" data-easytag="id7-react/src/App.js">Настройки</Link> },
    { key: '/history', label: <Link to="/history" data-easytag="id8-react/src/App.js">История игр</Link> },
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-easytag="id1-react/src/App.js">
      <header data-easytag="id2-react/src/App.js">
        <Header className="bg-white shadow-sm" data-easytag="id3-react/src/App.js">
          <nav className="max-w-6xl mx-auto flex items-center justify-between gap-4" data-easytag="id4-react/src/App.js">
            <span className="text-xl font-semibold tracking-tight" data-easytag="id5-react/src/App.js">Шахматы</span>
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={items}
              style={{ borderBottom: 'none', marginLeft: 'auto' }}
            />
          </nav>
        </Header>
      </header>

      <main className="flex-1" data-easytag="id9-react/src/App.js">
        <Content className="max-w-6xl mx-auto p-6" data-easytag="id10-react/src/App.js">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<Game />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
      </main>

      <footer data-easytag="id11-react/src/App.js">
        <Footer className="text-center bg-white" data-easytag="id12-react/src/App.js">
          <div data-easytag="id13-react/src/App.js">© {new Date().getFullYear()} Easyappz · Классический интерфейс</div>
        </Footer>
      </footer>
    </div>
  );
}

export default App;
