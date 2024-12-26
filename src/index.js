import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Form from './Form';
import Logo from './Logo';
import Caution from './Caution';
import PreSurvey from './PreSurvey'; // นำเข้า PreSurvey

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/form" element={<Form />} />
      <Route path="/logo" element={<Logo />} />
      <Route path="/presurvey/:id" element={<PreSurvey />} /> {/* เพิ่มเส้นทางสำหรับ PreSurvey พร้อมกับ document ID */}
    </Routes>
  </Router>
);
