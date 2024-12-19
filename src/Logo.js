import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './Logo.css';
// Update import path to match your logo location
import bulogo from './assets/bulogo.png';

function Logo() {
  const logoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fade in logo
    gsap.fromTo(logoRef.current,
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 2,
        ease: "power2.inOut"
      }
    );

    // Fade out and navigate after 7 seconds
    const timer = setTimeout(() => {
      gsap.to(logoRef.current, {
        opacity: 0,
        duration: 1,
        onComplete: () => navigate('/form')
      });
    }, 7000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="logo-container" ref={logoRef}>
      <img src={bulogo} alt="BU Logo" className="logo" />
    </div>
  );
}

export default Logo;