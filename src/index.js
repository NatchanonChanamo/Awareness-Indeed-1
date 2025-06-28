import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import './tailwind.css';
import Form from './Form';
import Logo from './Logo';
import Caution from './Caution';
import PreSurvey from './PreSurvey';
import Story from './Story';
import PostSurvey from './PostSurvey';
import ResultCard from './ResultCard';
import ScreenScaler from './ScreenScaler'; // 1. Import ScreenScaler ที่เพิ่งสร้าง
import './ScreenScaler.css';      // 2. Import CSS ของ ScreenScaler

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 3. ครอบแอปทั้งหมดด้วย ScreenScaler
    <Router>
      <ScreenScaler>
      <Routes>
        <Route path="/" element={<Caution />} />
        <Route path="/logo" element={<Logo />} />
        <Route path="/form" element={<Form />} />
        <Route path="/presurvey/:id" element={<PreSurvey />} />
        <Route path="/story/:id" element={<Story />} />
        <Route path="/postsurvey/:id" element={<PostSurvey />} />
        <Route path="/resultcard/:id" element={<ResultCard />} /> {/* เพิ่มบรรทัดนี้ */}
      </Routes>
      </ScreenScaler>
    </Router>
);