import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './Popup.css';

const Popup = () => {
  const navigate = useNavigate();
  const popupRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(popupRef.current,
      { opacity: 0 },
      { 
        opacity: 1,
        duration: 2.5,
        ease: "power2.inOut"
      }
    );
  }, []);

  const handleClick = () => {
    gsap.to(popupRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => navigate('logo')
    });
  };

  return (
    <div className="popup-overlay" onClick={handleClick} ref={popupRef}>
      <div className="popup-box">
        <h2 className="warning-title">คำเตือน</h2>
        <p className="warning-message">
          เว็บนี้มีเนื้อหาเกี่ยวกับความรู้สึกและความทรงจำที่คุณมีทั้งหมด
          หากคุณมีสภาวะจิตใจที่ไม่มั่นคง ไม่รักตัวเอง เกลียดตัวเอง เหยียดหยามตัวเอง
          รวมถึงยังรับมือกับสภาวะทางอารมณ์ลบของตนเองได้ไม่ดี
          หรือมีความทรงจำที่ไม่อยากนึกถึง
        </p>
        <p className="warning-message">
          โปรดพิจารณาความเสี่ยงก่อนลงมือทำแบบทดสอบ
          <br></br>หากคุณรู้สึกไม่สบายใจระหว่างการเล่น สามารถหยุดเล่นได้ตลอดเลยนะ
          <br></br>ซึ่งก็จริงอยู่ที่เราต้องจัดเก็บข้อมูลเพื่อการศึกษา
          <br></br>แต่เพื่อตัวคุณเอง สภาพจิตใจของคุณสำคัญกว่าทุกสิ่ง
          <br></br><strong>เพราะโลกนี้มีคุณแค่คนเดียว</strong>
        </p>
        <p className="footer-text">
          *เนื้อหาในเว็บนี้เป็นผลงานการออกแบบการสื่อสารเพื่อเล่าเรื่องราว
          ผ่านการให้ผู้เล่นมีส่วนร่วมด้วย <br></br>โดยจัดทำขึ้นเพื่อเป็นการศึกษาและช่วยเหลือสังคม ตามเงื่อนไขของทุนการศึกษาและปนิธานของผู้จัดทำ
          <br></br>จัดทำโดยนักศึกษาทุนผู้นำทางสังคมและสิ่งแวดล้อม มหาวิทยาลัยกรุงเทพ
        </p>
      </div>
    </div>
  );
};

export default Popup;
