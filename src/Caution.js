import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import './Caution.css';

const Caution = () => {
  const navigate = useNavigate();
  const cautionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cautionRef.current,
      { opacity: 0 },
      { 
        opacity: 1,
        duration: 2.5,
        ease: "power2.inOut"
      }
    );
  }, []);

  const handleClick = () => {
    gsap.to(cautionRef.current, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => navigate('/logo')
    });
  };

  return (
    <div className="caution-overlay" onClick={handleClick} ref={cautionRef}>
      <div className="caution-box">
        <h2>คำเตือน</h2>
        <p>
          เว็บนี้มีเนื้อหาเกี่ยวกับความรู้สึกและความทรงจำที่คุณมีทั้งหมด
          หากคุณมีสภาวะจิตใจที่ไม่มั่นคง ไม่รักตัวเอง เกลียดตัวเอง เหยียดหยามตัวเอง
          รวมถึงยังรับมือกับสภาวะทางอารมณ์ลบของตนเองได้ไม่ดี
          หรือมีความทรงจำที่ไม่อยากนึกถึง
        </p>
        <p>
          โปรดพิจารณาความเสี่ยงก่อนลงมือทำแบบทดสอบ
          <br />หากคุณรู้สึกไม่สบายใจระหว่างการเล่น สามารถหยุดเล่นได้ตลอดเลยนะ
          <br />ซึ่งก็จริงอยู่ที่เราต้องจัดเก็บข้อมูลเพื่อการศึกษา
          <br />แต่เพื่อตัวคุณเอง สภาพจิตใจของคุณสำคัญกว่าทุกสิ่ง
          <br /><strong>เพราะโลกนี้มีคุณแค่คนเดียว</strong>
        </p>
        <p className="footer-text">
          *เนื้อหาในเว็บนี้เป็นผลงานการออกแบบการสื่อสารเพื่อเล่าเรื่องราว
          ผ่านการให้ผู้เล่นมีส่วนร่วมด้วย <br />โดยจัดทำขึ้นเพื่อเป็นการศึกษาและช่วยเหลือสังคม ตามเงื่อนไขของทุนการศึกษาและปนิธานของผู้จัดทำ
          <br />จัดทำโดยนักศึกษาทุนผู้นำทางสังคมและสิ่งแวดล้อม มหาวิทยาลัยกรุงเทพ
        </p>
      </div>
    </div>
  );
};

export default Caution;
