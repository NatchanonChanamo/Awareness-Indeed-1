import React, { useRef, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { gsap } from 'gsap';
import './ResultCard.css';

// Default card image (fallback)
import MCard5 from './assets/Mcard5.png';

function ResultCard() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const cardRef = useRef(null);
  
  // รับข้อมูลการ์ดจาก URL parameters
  const cardType = searchParams.get('cardType') || 'ผู้รับฟัง';
  const cardTitle = searchParams.get('cardTitle') || 'ผู้รับมือ';
  const cardImageSrc = searchParams.get('cardImage') || '';
  
  const [cardImage, setCardImage] = useState(MCard5); // เริ่มต้นด้วย fallback

  useEffect(() => {
    console.log('=== ResultCard Debug ===');
    console.log('URL cardImageSrc:', cardImageSrc);
    console.log('URL cardType:', cardType);
    console.log('URL cardTitle:', cardTitle);
    
    // ลองหาข้อมูลจาก localStorage ก่อน (กรณี direct access)
    const storedCardData = localStorage.getItem('userCardData');
    if (storedCardData) {
      try {
        const parsedData = JSON.parse(storedCardData);
        console.log('Found localStorage data:', parsedData);
        if (parsedData.cardImage) {
          setCardImage(parsedData.cardImage);
          console.log('Using cardImage from localStorage:', parsedData.cardImage);
          return;
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
    
    // ถ้าไม่มีใน localStorage ให้ใช้จาก URL parameter
    if (cardImageSrc && cardImageSrc !== 'undefined' && cardImageSrc !== '') {
      setCardImage(cardImageSrc);
      console.log('Using cardImage from URL:', cardImageSrc);
    } else {
      setCardImage(MCard5); // ใช้ fallback image
      console.log('Using fallback cardImage:', MCard5);
    }
  }, [cardImageSrc, cardType, cardTitle]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.7)" }
      );
    }
  }, [cardImage]);

  const handleDownload = () => {
    if (!cardRef.current) return;
    
    toPng(cardRef.current, { 
      cacheBust: true,
      pixelRatio: 2,
      width: cardRef.current.offsetWidth,
      height: cardRef.current.offsetHeight,
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `covenant-card-${cardTitle}-${id}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
        alert('ขออภัย, ไม่สามารถบันทึกรูปภาพได้ในขณะนี้');
      });
  };

  return (
    <div className="result-container">
      <header className="result-header">
        <h1>กระดาษพันธสัญญาของตัวคุณ</h1>
        <h2 className="card-type-title">{cardType}</h2>
        <h3 className="card-subtitle">{cardTitle}</h3>
      </header>

      <main className="card-area">
        <div ref={cardRef} className="covenant-card">
          {cardImage ? (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative' /* เพิ่ม relative positioning */
            }}>
              <img 
                src={cardImage} 
                alt={`${cardType} - ${cardTitle}`} 
                className="card-image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain', /* เปลี่ยนเป็น contain เพื่อให้เห็นการ์ดเต็ม */
                  objectPosition: 'center'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none', textAlign: 'center', padding: '2rem' }}>
                <h3 style={{ color: '#7c3aed', marginBottom: '1rem' }}>{cardTitle}</h3>
                <p style={{ color: '#6b7280' }}>{cardType}</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '1rem' }}>
                  รูปภาพไม่สามารถโหลดได้
                </p>
              </div>
            </div>
          ) : (
            <div className="card-placeholder">
              <p>กำลังโหลดการ์ด...</p>
            </div>
          )}
        </div>
      </main>

      <footer className="result-footer">
        <button onClick={handleDownload} className="download-button">
          บันทึกรูป
        </button>
        <div className="footer-links">
          <a href="https://www.instagram.com/awareness.indeed2025?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="footer-button">
            About Us
          </a>
          <a href="https://www.instagram.com/awareness.indeed2025?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="footer-button">
            Website
          </a>
        </div>
      </footer>
    </div>
  );
}

export default ResultCard;