import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './AboutUs.css';

function AboutUs() {
  const navigate = useNavigate();

  useEffect(() => {
    // Animation เข้าหน้า
    gsap.fromTo('.aboutus-container', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // Animation สำหรับแต่ละ section
    gsap.fromTo('.aboutus-section', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 0.3, ease: 'power2.out' }
    );
  }, []);

  const handleBackClick = () => {
    gsap.to('.aboutus-container', {
      opacity: 0,
      y: -20,
      duration: 0.7,
      ease: 'power3.in',
      onComplete: () => {
        navigate(-1); // กลับไปหน้าก่อนหน้า
      }
    });
  };

  return (
    <div className="aboutus-container">
      <div className="aboutus-content">
        {/* Header */}
        <header className="aboutus-header aboutus-section">
          <h1 className="aboutus-title">เกี่ยวกับเรา</h1>
          <div className="aboutus-decoration"></div>
        </header>

        {/* ที่มาของโครงการ */}
        <section className="aboutus-section project-origin">
          <h2 className="section-title">ที่มาของโครงการ</h2>
          <div className="content-card">
            <p className="project-description">
              <strong>"Awareness Indeed: การเดินทางเพื่อการตระหนักในการรักตัวเอง"</strong> คือโครงการนิทรรศการออนไลน์ที่สร้างขึ้นเพื่อเปิดพื้นที่ให้ผู้คนได้สำรวจอารมณ์ ความคิด และเรียนรู้ที่จะเข้าใจและโอบกอดตัวเอง ผ่านเนื้อเรื่องแบบอินเตอร์แอคทีฟที่ออกแบบมาให้สะท้อนภาวะภายในอย่างลึกซึ้ง
            </p>
            <p className="inspiration-text">
              แรงบันดาลใจของโครงการนี้เกิดจากการสังเกตว่า คนรุ่นใหม่จำนวนมากประสบปัญหาด้านสุขภาพจิต ความเครียด และการตั้งคำถามถึงคุณค่าของตัวเอง หรือกระทั่งรักตัวเองในแบบที่ยังไม่ใช่ทาง
            </p>
            <p className="mission-text">
              จึงอยากสร้างพื้นที่ปลอดภัยที่ <em>"ไม่ต้องถูกตัดสิน"</em> และให้โอกาสได้เจอเสียงของตัวเองอีกครั้ง
            </p>
          </div>
        </section>

        {/* ผู้จัดทำ */}
        <section className="aboutus-section creator-info">
          <h2 className="section-title">ผู้จัดทำ</h2>
          <div className="creator-card">
            <div className="creator-details">
              <h3 className="creator-name">ณัชนนท์ ชะนะโม (Natchanon Chanamo)</h3>
              <div className="creator-credentials">
                <p>นักศึกษาทุนผู้นำทางสังคมและสิ่งแวดล้อม</p>
                <p>ปี 2 คณะเทคโนโลยีสารสนเทศและนวัตกรรม</p>
                <p>สาขาวิทยาการคอมพิวเตอร์</p>
                <p className="specialization">(มุ่งเน้นวิทยาการข้อมูลและความมั่นคงปลอดภัยทางไซเบอร์)</p>
                <p className="university">มหาวิทยาลัยกรุงเทพ</p>
              </div>
            </div>
          </div>
        </section>

        {/* ข้อความจากผู้จัดทำ */}
        <section className="aboutus-section message-section">
          <h2 className="section-title">ข้อความจากผู้จัดทำ</h2>
          <div className="message-card">
            <div className="message-content">
              <p className="message-greeting">
                ขอบคุณที่ร่วมเดินทางกับเราในจักรวาลเล็ก ๆ แห่งนี้
              </p>
              <p className="message-belief">
                เราเชื่อว่าแม้เพียงช่วงเวลาสั้น ๆ ของการได้หันมามองตัวเอง ก็เพียงพอแล้วที่จะเริ่มการเปลี่ยนแปลงที่ยิ่งใหญ่
              </p>
              
              <div className="quote-highlight">
                <p className="main-quote">
                  "การรักตัวเอง" ไม่ใช่จุดจบของการเดินทาง<br />
                  แต่คือแสงแรกของการเริ่มต้นเส้นทางใหม่อย่างแท้จริง
                </p>
              </div>
              
              <p className="closing-message">
                ขอให้คุณกลับออกไปพร้อมกับ 'เสียงของตัวเอง' ที่ชัดเจนขึ้น<br />
                ไม่ว่าจะเบาเพียงใดก็ตาม 🕊️
              </p>
              
              <div className="signature">
                <p className="project-name">Awareness Indeed</p>
                <p className="year">2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* ปุ่มกลับ */}
        <footer className="aboutus-footer aboutus-section">
          <button onClick={handleBackClick} className="back-button">
            กลับ
          </button>
        </footer>
      </div>
    </div>
  );
}

export default AboutUs;