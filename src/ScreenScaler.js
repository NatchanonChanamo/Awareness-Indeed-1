import React from 'react';
import './ScreenScaler.css';

/**
 * คอมโพเนนต์นี้จะสร้างกรอบ "หน้าจอเสมือน" ขึ้นมา
 * และปรับขนาดของมันให้พอดีกับหน้าจอจริงของผู้ใช้
 * เพื่อให้มั่นใจว่าแอปพลิเคชันจะแสดงผลเหมือนกันในทุกอุปกรณ์
 */
const ScreenScaler = ({ children }) => {
  return (
    <div className="screen-scaler-container">
      <div className="scaled-content">
        {children}
      </div>
    </div>
  );
};

export default ScreenScaler;