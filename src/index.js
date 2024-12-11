import React from 'react';
import ReactDOM from 'react-dom/client';  // เปลี่ยนจาก 'react-dom' เป็น 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Form from './Form';

const root = ReactDOM.createRoot(document.getElementById('root'));  // สร้าง root
root.render(  // ใช้ render ผ่าน root
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/form" element={<Form />} />
    </Routes>
  </Router>
);

