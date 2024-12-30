import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Form from './Form';
import Logo from './Logo';
import Caution from './Caution';
import PreSurvey from './PreSurvey'; 
import Story from './Story';
import PostSurvey from './PostSurvey'; // เพิ่ม import PostSurvey

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/form" element={<Form />} />
      <Route path="/logo" element={<Logo />} />
      <Route path="/presurvey/:id" element={<PreSurvey />} /> 
      <Route path="/story/:id" element={<Story />} /> {/* เพิ่ม id ในเส้นทาง story */}
      <Route path="/postsurvey/:id" element={<PostSurvey />} /> {/* เพิ่ม route สำหรับ PostSurvey */}
    </Routes>
  </Router>
);
