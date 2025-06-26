import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
// import './Logo.css'; // ลบการ import นี้ทิ้ง
import bulogo from './assets/bulogo.png';
import projectLogo from './assets/ProjectLogo.png'; // เพิ่มโลโก้โปรเจกต์

function Logo() {
  const logoRef = useRef(null);
  const navigate = useNavigate();
  // const [imageLoaded, setImageLoaded] = useState(false);
  const [buLogoLoaded, setBuLogoLoaded] = useState(false);
  const [projectLogoLoaded, setProjectLogoLoaded] = useState(false);

  const allImagesLoaded = buLogoLoaded && projectLogoLoaded;

  useEffect(() => {
    if (allImagesLoaded) {
      console.log('All images loaded, starting animation');
      
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
  }, [allImagesLoaded, navigate]);

  const handleClick = () => {
    console.log('Logo clicked, navigating to /form');
    navigate('/form');
  };

  return (
    // ปรับ layout ให้รองรับ 2 โลโก้ และจัดกลาง
    <div 
      className="w-screen h-screen flex justify-center items-center bg-white cursor-pointer p-4" 
      onClick={handleClick}
    >
      <div 
        ref={logoRef}
        className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12"
      >
        <img 
          src={bulogo} 
          alt="BU Logo" 
          className="max-w-[150px] sm:max-w-[200px] h-auto"
          onLoad={() => setBuLogoLoaded(true)} 
          onError={() => console.error('Failed to load BU logo')}
        />
        <img 
          src={projectLogo} 
          alt="Project Logo" 
          className="max-w-[150px] sm:max-w-[200px] h-auto"
          onLoad={() => setProjectLogoLoaded(true)} 
          onError={() => console.error('Failed to load Project logo')}
        />
      </div>
    </div>
  );
}

export default Logo;