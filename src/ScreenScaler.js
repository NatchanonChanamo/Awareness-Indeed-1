import React, { useEffect, useState } from 'react';
import './ScreenScaler.css';

/**
 * ScreenScaler แบบ Responsive Fixed Aspect Ratio Layout
 * - ออกแบบสำหรับ 480x844px เป็นฐาน (ขนาดมือถือมาตรฐาน)
 * - มือถือ: Scale ให้พอดีเนื้อหาทั้งหมด (ไม่หลุดเฟรม)
 * - แท็บเล็ต/คอม: Scale ให้เต็มหน้าจอแต่ไม่เกินขีดจำกัด
 * - ปรับขนาดปุ่มและข้อความให้เหมาะสมกับทุกอุปกรณ์
 */
const ScreenScaler = ({ children }) => {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const calculateScale = () => {
      // ขนาดต้นแบบ - มือถือมาตรฐาน
      const DESIGN_WIDTH = 480;
      const DESIGN_HEIGHT = 844;
      
      // ขนาดหน้าจอจริง
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // คำนวณ scale ratio ทั้งสองทิศทาง
      const scaleX = windowWidth / DESIGN_WIDTH;
      const scaleY = windowHeight / DESIGN_HEIGHT;
      
      // บังคับให้เต็มหน้าจอทุกอุปกรณ์ - ไม่มีขอบสีดำ
      let finalScale = Math.max(scaleX, scaleY);
      
      // จำกัดขั้นสูงสุดเพื่อไม่ให้ใหญ่เกินไป
      if (finalScale > 3.0) {
        finalScale = Math.min(scaleX, scaleY);
      }
      
      // ขั้นต่ำและขั้นสูง
      const adjustedScale = Math.max(0.8, Math.min(finalScale, 3.5));
      
      setScale(adjustedScale);
      
      console.log('Full Screen Scaling - No Black Borders:', {
        deviceType: windowWidth < 768 ? 'Mobile' : windowWidth < 1024 ? 'Tablet' : 'Desktop',
        designSize: `${DESIGN_WIDTH}x${DESIGN_HEIGHT}`,
        windowSize: `${windowWidth}x${windowHeight}`,
        scaleX: scaleX.toFixed(3),
        scaleY: scaleY.toFixed(3),
        chosenScale: finalScale.toFixed(3),
        finalScale: adjustedScale.toFixed(3),
        scaledSize: `${Math.round(DESIGN_WIDTH * adjustedScale)}x${Math.round(DESIGN_HEIGHT * adjustedScale)}`,
        coverage: 'FULL SCREEN - No Black Borders'
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