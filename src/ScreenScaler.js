import React, { useEffect, useState } from 'react';
import './ScreenScaler.css';

/**
 * ScreenScaler แบบ Responsive Fixed Aspect Ratio Layout
 * - ออกแบบสำหรับ 480x844px เป็นฐาน (ขนาดมือถือมาตรฐาน)
 * - มือถือ: Scale ให้พอดีเนื้อหาทั้งหมด (ไม่หลุดเฟรม)
 * - แท็บเล็ต: ปรับ scale ให้เหมาะสม ไม่โดนตัด
 * - คอม: Scale ปกติไม่ให้ใหญ่เกินไป
 */
const ScreenScaler = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const calculateScale = () => {
      // ขนาดต้นแบบ - มือถือมาตรฐาน
      const DESIGN_WIDTH = 480;
      const DESIGN_HEIGHT = 844;
      
      // ขนาดหน้าจอจริง
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // ตรวจสอบประเภทอุปกรณ์อย่างละเอียด
      let currentDeviceType = 'desktop';
      
      if (windowWidth <= 768) {
        currentDeviceType = 'mobile';
      } else if (windowWidth > 768 && windowWidth <= 1024) {
        // iPad mini, iPad Air ขนาดเล็ก
        currentDeviceType = 'tablet-small';
      } else if (windowWidth > 1024 && windowWidth <= 1366) {
        // iPad Pro, แท็บเล็ตขนาดใหญ่
        currentDeviceType = 'tablet-large';
      } else {
        // คอมพิวเตอร์
        currentDeviceType = 'desktop';
      }
      
      setDeviceType(currentDeviceType);
      
      // คำนวณ scale ratio ทั้งสองทิศทาง
      const scaleX = windowWidth / DESIGN_WIDTH;
      const scaleY = windowHeight / DESIGN_HEIGHT;
      
      let finalScale;
      
      if (currentDeviceType === 'mobile') {
        // มือถือ: ใช้ scale ให้พอดีหน้าจอ (ไม่เปลี่ยน)
        finalScale = Math.max(scaleX, scaleY);
        finalScale = Math.max(0.8, Math.min(finalScale, 3.5));
      } else if (currentDeviceType === 'tablet-small') {
        // iPad mini และแท็บเล็ตขนาดเล็ก: scale ปานกลาง
        finalScale = Math.min(scaleX, scaleY) * 0.85; // ลด 15%
        finalScale = Math.max(1.0, Math.min(finalScale, 1.8)); // จำกัด 1.0-1.8
        
        // ตรวจสอบการตัด
        const scaledHeight = DESIGN_HEIGHT * finalScale;
        if (scaledHeight > windowHeight * 0.9) {
          finalScale = (windowHeight * 0.9) / DESIGN_HEIGHT;
        }
      } else if (currentDeviceType === 'tablet-large') {
        // iPad Pro และแท็บเล็ตขนาดใหญ่: scale น้อยกว่า
        finalScale = Math.min(scaleX, scaleY) * 0.75; // ลด 25%
        finalScale = Math.max(1.2, Math.min(finalScale, 2.2)); // จำกัด 1.2-2.2
        
        // ตรวจสอบการตัด
        const scaledHeight = DESIGN_HEIGHT * finalScale;
        if (scaledHeight > windowHeight * 0.9) {
          finalScale = (windowHeight * 0.9) / DESIGN_HEIGHT;
        }
      } else {
        // เดสก์ท็อป: ใช้ scale ที่เหมาะสม ไม่ให้ใหญ่เกินไป
        finalScale = Math.min(scaleX, scaleY); // เปลี่ยนจาก Math.max เป็น Math.min
        finalScale = Math.max(1.0, Math.min(finalScale, 2.5)); // จำกัด 1.0-2.5
        
        // หากหน้าจอใหญ่มาก ให้จำกัด scale ไม่ให้เกิน 2.0
        if (windowWidth > 1920) {
          finalScale = Math.min(finalScale, 2.0);
        }
      }
      
      setScale(finalScale);
      
      console.log('ScreenScaler Info:', {
        deviceType: currentDeviceType,
        windowSize: `${windowWidth}x${windowHeight}`,
        designSize: `${DESIGN_WIDTH}x${DESIGN_HEIGHT}`,
        scaleX: scaleX.toFixed(3),
        scaleY: scaleY.toFixed(3),
        finalScale: finalScale.toFixed(3),
        scaledSize: `${Math.round(DESIGN_WIDTH * finalScale)}x${Math.round(DESIGN_HEIGHT * finalScale)}`,
        strategy: currentDeviceType
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
    <div className={`screen-scaler-container ${deviceType}`}>
      <div 
        className="scaled-content"
        style={{ 
          transform: `scale(${scale})`,
          transformOrigin: deviceType.includes('tablet') ? 'center top' : 'center center',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScreenScaler;