import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.module.scss';

import Menu from './containers/menu/Menu';
import Cart from './containers/cart/Cart';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Menu /> },
  { path: '/cart', element: <Cart /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
