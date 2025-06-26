import React, { useLayoutEffect, useRef, useState } from 'react';
import './ScreenScaler.css';

// กำหนดขนาดหน้าจอเสมือนที่เราต้องการ (ขนาดของ iPhone 13/14 Pro)
const VIRTUAL_WIDTH = 390;
const VIRTUAL_HEIGHT = 844;

const ScreenScaler = ({ children }) => {
  const scalerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      const { innerWidth, innerHeight } = window;
      const scaleX = innerWidth / VIRTUAL_WIDTH;
      const scaleY = innerHeight / VIRTUAL_HEIGHT;
      // เลือก scale ที่น้อยกว่าเพื่อให้แน่ใจว่าทั้งหน้าจอจะแสดงผลได้พอดี
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const scalerStyle = {
    '--scale-factor': scale,
  };

  return (
    <div className="scaler-wrapper" style={scalerStyle}>
      <div className="scaler-content" ref={scalerRef}>
        {children}
      </div>
    </div>
  );
};

export default ScreenScaler;