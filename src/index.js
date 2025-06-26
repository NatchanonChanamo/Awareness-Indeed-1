import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import './tailwind.css';
// import App from './App'; // <<<<<< ลบบรรทัดนี้ทิ้งไปเลย
import Form from './Form';
import Logo from './Logo';
import Caution from './Caution';
import PreSurvey from './PreSurvey';
import Story from './Story';
import PostSurvey from './PostSurvey';
import ResultCard from './ResultCard'; // <-- เพิ่มบรรทัดนี้

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Caution />} /> {/* <<<<<< เริ่มหน้าแรกที่ Caution */}
      <Route path="/logo" element={<Logo />} />
      <Route path="/form" element={<Form />} />
      <Route path="/presurvey/:id" element={<PreSurvey />} />
      <Route path="/story/:id" element={<Story />} />
      <Route path="/postsurvey/:id" element={<PostSurvey />} />
      <Route path="/result/:id" element={<ResultCard />} /> {/* <-- เพิ่มบรรทัดนี้ */}
    </Routes>
  </Router>
);