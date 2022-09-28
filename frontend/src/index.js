import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter
} from "react-router-dom";
import './tailwind.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={(<div className='w-screen h-screen bg-black text-w1'>Please wait...</div>)}>
      <BrowserRouter>
      <App/>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);