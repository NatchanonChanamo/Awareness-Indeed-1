import React from 'react';
import { Routes, Route } from 'react-router-dom';  // ไม่ต้องใช้ <Router> ที่นี่
import Popup from './Popup';
import Logo from './Logo';
import Form from './Form';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Popup />} />
        <Route path="/logo" element={<Logo />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;

