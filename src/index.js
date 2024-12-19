import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Form from './Form';
import Logo from './Logo';
import Caution from './Caution';  // เปลี่ยนการนำเข้า Popup เป็น Caution

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/form" element={<Form />} />
      <Route path="/logo" element={<Logo />} />
    </Routes>
  </Router>
);
