import React, { useEffect, useState } from 'react';
import './ScreenScaler.css';

/**
 * ScreenScaler แบบ Fixed Aspect Ratio Layout
 * - ออกแบบสำหรับ 680x844px เป็นฐาน
 * - Scale ให้เต็มหน้าจอโดยรักษาสัดส่วน
 * - ไม่เล็กกว่า 100% ของหน้าจอ
 */
const ScreenScaler = ({ children }) => {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const calculateScale = () => {
      // ขนาดต้นแบบ
      const DESIGN_WIDTH = 680;
      const DESIGN_HEIGHT = 844;
      
      // ขนาดหน้าจอจริง
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // คำนวณ scale ratio ทั้งสองทิศทาง
      const scaleX = windowWidth / DESIGN_WIDTH;
      const scaleY = windowHeight / DESIGN_HEIGHT;
      
      // --- FIX: ใช้ scale ที่ใหญ่กว่า เพื่อให้เต็มหน้าจอ ---
      let finalScale;
      
      if (windowWidth <= 480) {
        // มือถือ: ให้เต็มความกว้างแล้วให้สูงตาม
        finalScale = scaleX;
      } else if (windowWidth <= 768) {
        // แท็บเล็ต: เลือก scale ที่ทำให้เต็มหน้าจอมากที่สุด
        finalScale = Math.max(scaleX, scaleY);
      } else {
        // คอม: เลือก scale ที่เหมาะสม (ไม่ให้ใหญ่เกินไป)
        finalScale = Math.min(scaleX * 0.9, scaleY * 0.9);
      }
      
      // ขั้นต่ำ 80% สูงสุด 300%
      finalScale = Math.max(0.8, Math.min(finalScale, 3.0));
      
      setScale(finalScale);
      
      console.log('Scale calculation:', {
        deviceType: windowWidth <= 480 ? 'mobile' : windowWidth <= 768 ? 'tablet' : 'desktop',
        windowSize: `${windowWidth}x${windowHeight}`,
        designSize: `${DESIGN_WIDTH}x${DESIGN_HEIGHT}`,
        scaleX: scaleX.toFixed(2),
        scaleY: scaleY.toFixed(2),
        finalScale: finalScale.toFixed(2),
        actualSize: `${Math.round(DESIGN_WIDTH * finalScale)}x${Math.round(DESIGN_HEIGHT * finalScale)}`
      });
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
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScreenScaler;