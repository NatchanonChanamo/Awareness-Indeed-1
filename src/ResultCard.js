import React, { useRef, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { gsap } from 'gsap';
import './ResultCard.css';

// --- เพิ่ม: Import รูปภาพการ์ด ---
import MCard1 from './assets/MCard1.png'; // ผู้เผชิญหน้า
import MCard2 from './assets/MCard2.png'; // ผู้เยียวยา
import MCard3 from './assets/MCard3.png'; // ผู้ฟื้นพลัง
import MCard4 from './assets/MCard4.png'; // ผู้สร้างแรงบันดาลใจ
import MCard5 from './assets/MCard5.png'; // ผู้รับมือ

// --- เพิ่ม: Map ประเภทการ์ดไปยังรูปภาพ ---
const cardImageMap = {
  'ผู้เผชิญหน้า': MCard1,
  'ผู้เยียวยา': MCard2,
  'ผู้ฟื้นพลัง': MCard3,
  'ผู้สร้างแรงบันดาลใจ': MCard4,
  'ผู้รับมือ': MCard5,
};

function ResultCard() {
  const { id } = useParams();
  const location = useLocation();
  const cardRef = useRef(null);
  const [cardImage, setCardImage] = useState(null);
  const [cardTitle, setCardTitle] = useState('');

  useEffect(() => {
    gsap.fromTo('.result-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });

    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('cardType') || 'ผู้รับมือ'; // Default to 'ผู้รับมือ'
    setCardTitle(type);
    setCardImage(cardImageMap[type]);
  }, [location]);

  const handleDownload = () => {
    if (cardRef.current === null) {
      return;
    }

    toPng(cardRef.current, { cacheBust: true, backgroundColor: '#ffffff' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `covenant-card-${id}.png`;
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
      </header>

      <main className="card-area">
        {/* This is the card that will be downloaded */}
        <div ref={cardRef} className="covenant-card">
          {cardImage ? (
            <img src={cardImage} alt={cardTitle} className="card-image" />
          ) : (
            <p>กำลังโหลดการ์ด...</p>
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