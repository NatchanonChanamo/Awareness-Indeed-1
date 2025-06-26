import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { gsap } from 'gsap';
import './ResultCard.css';

function ResultCard() {
  const { id } = useParams();
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo('.result-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
  }, []);

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
          <p>นี่คือการ์ดของคุณ</p>
          <p>(พื้นที่สำหรับการ์ดในอนาคต)</p>
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