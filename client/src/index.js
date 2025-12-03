/**
 * index.js
 * --------
 * Application entry point.
 * - Mounts the <App /> component into the root div
 * - Loads global styles + Bootstrap
 * - Wraps rendering in React.StrictMode for dev safety
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Global styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Mount React root into <div id="root">
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * CRA performance analytics (optional)
 * Example: reportWebVitals(console.log)
 */
reportWebVitals();
