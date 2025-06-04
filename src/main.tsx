import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './configs/i18n'; // import i18n trước

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<div className='bg-red-500'>Loading translations...</div>}>
    <App />
  </Suspense>
);
