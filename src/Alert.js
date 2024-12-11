import React, { useState } from 'react';
import Popup from './Popup';
import './App.css';
import { useNavigate } from 'react-router-dom';  // ใช้ useNavigate แทน useHistory

function App() {
  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();  // ใช้ navigate แทน history

  const handleClosePopup = () => {
    setShowPopup(false);  // ปิดป๊อปอัพเมื่อคลิก
    navigate('/form');  // ไปยังหน้าถัดไป
  };

  return (
    <div className="App">
      {showPopup && <Popup onClose={handleClosePopup} />}

      <header className="App-header">
        <p>Welcome to the website!</p>
      </header>
    </div>
  );
}

export default App;
