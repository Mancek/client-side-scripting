import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import App from './App';
import store from './store/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);