import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './context/auth';
import App from './App';
import { HashRouter } from 'react-router-dom';
import 'antd/dist/reset.css';  // ant design installed in the clit
import { SearchProvider } from './context/search';
import { CartProvider } from './context/cart';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </CartProvider>

    </SearchProvider>
  </AuthProvider>
);
