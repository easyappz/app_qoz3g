import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider, theme } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();
