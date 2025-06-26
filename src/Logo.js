import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
// import './Logo.css'; // ลบการ import นี้ทิ้ง
import bulogo from './assets/bulogo.png';

function Logo() {
  const logoRef = useRef(null);
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageLoaded) {
      console.log('Image loaded, starting animation');
      
      gsap.fromTo(logoRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 2,
          ease: "power2.inOut",
          onStart: () => console.log('Fade in started'),
          onComplete: () => console.log('Fade in completed')
        }
      );

      const timer = setTimeout(() => {
        console.log('Starting fade out');
        gsap.to(logoRef.current, {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            console.log('Fade out completed, navigating to /form');
            navigate('/form');
          }
        });
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [imageLoaded, navigate]);

  const handleClick = () => {
    console.log('Logo clicked, navigating to /form');
    navigate('/form');
  };

  return (
    // เปลี่ยนมาใช้ Tailwind Classes
    <div 
      className="w-full h-full flex justify-center items-center bg-white cursor-pointer" 
      onClick={handleClick}
    >
      <img 
        src={bulogo} 
        alt="BU Logo" 
        className="max-w-[250px] h-auto" // ลดขนาดโลโก้ลงเล็กน้อย
        ref={logoRef}
        onLoad={() => setImageLoaded(true)} 
        onError={() => console.error('Failed to load image')}
      />
    </div>
  );
}

export default Logo;