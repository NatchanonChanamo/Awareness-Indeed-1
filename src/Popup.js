import React from 'react';
import './Popup.css';

const Popup = ({ onClose, onProceed }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="warning-title">คำเตือน</h2>
        <p className="warning-message">
          เว็บนี้มีเนื้อหาเกี่ยวกับความรู้สึกและความทรงจำที่คุณมีในวัยเด็ก
          หากคุณมีสภาวะจิตใจที่ไม่มั่นคง ไม่รักตัวเอง เกลียดตัวเอง เหยียดหยามตัวเอง
          ยังรับมือกับสภาวะทางอารมณ์ลบของตนเองได้ไม่ดี
          หรือมีความทรงจำเกี่ยวกับการเติบโตที่ไม่อยากนึกถึง
        </p>
        <p className="warning-message">
          โปรดพิจารณาความเสี่ยงก่อนลงมือทำแบบทดสอบ
          หากคุณรู้สึกไม่สบายใจระหว่างการเล่นสามารถหยุดเล่นได้ตลอดเลยนะ
          การดูแลใจตัวเองสำคัญกว่าอะไรทั้งสิ้น
        </p>
        <p className="footer-text">
          *เนื้อหาในเว็บนี้เป็นผลงานการออกแบบการสื่อสารเพื่อเล่าเรื่องราว
          ผ่านการให้ผู้เล่นมีส่วนร่วมด้วยไม่ใช่แบบสอบถามทางจิตวิทยา
          หรือโหราศาสตร์แต่อย่างใด
        </p>
        <button className="proceed-button" onClick={onProceed}>
          กดเพื่อไปตามหาตัวคุณเอง
        </button>
      </div>
    </div>
  );
};

export default Popup;
