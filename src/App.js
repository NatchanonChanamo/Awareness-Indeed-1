import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Caution from './Caution';  // เปลี่ยนการนำเข้า Popup เป็น Caution
import Logo from './Logo';
import Form from './Form';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Caution />} />  // เปลี่ยนเส้นทางจาก Popup เป็น Caution
        <Route path="/logo" element={<Logo />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;