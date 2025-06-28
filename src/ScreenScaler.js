import React, { useEffect, useState } from 'react';
import './ScreenScaler.css';

/**
 * คอมโพเนนต์นี้จะสร้างกรอบ "หน้าจอเสมือน" ขนาด 430x932
 * และปรับขนาดให้พอดีกับหน้าจอของแต่ละอุปกรณ์
 * ง่าย ๆ เล็กก็ขยาย ใหญ่ก็ย่อ
 */
const ScreenScaler = ({ children }) => {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const calculateScale = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const targetWidth = 430;  // ขนาดพื้นฐาน
      const targetHeight = 932; // ขนาดพื้นฐาน
      
      // คำนวณ scale ที่จะทำให้พอดีหน้าจอ
      const scaleX = windowWidth / targetWidth;
      const scaleY = windowHeight / targetHeight;
      
      // เลือก scale ที่เล็กกว่าเพื่อให้ไม่เกินขอบหน้าจอ
      let newScale = Math.min(scaleX, scaleY);
      
      // ปรับ scale ให้เหมาะสมกับแต่ละอุปกรณ์
      const isDesktop = windowWidth >= 1200;
      const isTablet = windowWidth >= 768 && windowWidth < 1200;
      
      if (isDesktop) {
        // คอม - ลดขนาดลง (เพิ่มแค่ 5% แทน 20%)
        newScale = Math.min(newScale * 1.05, 1.4); // ไม่เกิน 140%
      } else if (isTablet) {
        // แท็บเล็ต - ให้ขนาดใหญ่ขึ้นเล็กน้อย (เพิ่ม 10%)
        newScale = Math.min(newScale * 1.1, 1.3); // ไม่เกิน 130%
      } else {
        // มือถือ - ขนาดปกติตาม scale ที่คำนวณได้
        // ไม่ปรับเพิ่ม เอาขนาดที่คำนวณได้ตรง ๆ
      }
      
      // จำกัดขนาดต่ำสุด
      newScale = Math.max(newScale, 0.3);
      
      setScale(newScale);
    };
    
    // คำนวณครั้งแรก
    calculateScale();
    
    // คำนวณใหม่เมื่อขนาดหน้าจอเปลี่ยน
    window.addEventListener('resize', calculateScale);
    window.addEventListener('orientationchange', () => {
      setTimeout(calculateScale, 100);
    });
    
    return () => {
      window.removeEventListener('resize', calculateScale);
      window.removeEventListener('orientationchange', calculateScale);
    };
  }, []);
  
  return (
    <div className="screen-scaler-container">
      <div 
        className="scaled-content" 
        style={{ 
          transform: `scale(${scale})`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScreenScaler;