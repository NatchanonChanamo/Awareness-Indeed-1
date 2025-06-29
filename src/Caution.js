import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4"
      onClick={handleClick}
      ref={cautionRef}
    >
      {/* เพิ่ม inline styles เฉพาะหน้านี้ */}
      <div 
        className="w-full max-w-sm text-center px-6"
        style={{
          fontSize: '16px', // เพิ่มจาก 12px เป็น 16px
          lineHeight: '1.4'
        }}
      >
        <h2 
          className="mb-4 text-2xl font-bold text-red-500"
          style={{
            fontSize: '24px', // เพิ่มจาก 18px เป็น 24px
            marginBottom: '16px'
          }}
        >
          คำเตือน
          <br />(ใช้การกดหรือจิ้มหน้าจอเป็นหลัก)
        </h2>

        {/* ปรับขนาดตัวอักษรแต่ละย่อหน้าให้ใหญ่ขึ้น */}
        <p 
          className="mb-3 text-base text-gray-700 text-balance"
          style={{
            fontSize: '16px', // เพิ่มจาก 10px เป็น 14px
            marginBottom: '12px',
            lineHeight: '1.5'
          }}
        >
          เว็บนี้มีเนื้อหาเกี่ยวกับความรู้สึกและความทรงจำที่คุณมีทั้งหมด หากคุณมีสภาวะจิตใจที่ไม่มั่นคง ไม่รักตัวเอง เกลียดตัวเอง เหยียดหยามตัวเอง รวมถึงยังรับมือกับสภาวะทางอารมณ์ลบของตนเองได้ไม่ดี หรือมีความทรงจำที่ไม่อยากนึกถึง
        </p>
        <p 
          className="mb-3 text-base text-gray-700 text-balance"
          style={{
            fontSize: '16px', // เพิ่มจาก 10px เป็น 14px
            marginBottom: '12px',
            lineHeight: '1.5'
          }}
        >
          โปรดพิจารณาความเสี่ยงก่อนลงมือทำแบบทดสอบ
          หากคุณรู้สึกไม่สบายใจระหว่างการเล่น สามารถหยุดเล่นได้ตลอดเลยนะ
        </p>
        <p 
          className="mb-3 text-base text-gray-700 text-balance"
          style={{
            fontSize: '14px', // เพิ่มจาก 10px เป็น 14px
            marginBottom: '12px',
            lineHeight: '1.5'
          }}
        >
          ซึ่งก็จริงอยู่ที่เราต้องจัดเก็บข้อมูลเพื่อการศึกษา แต่เพื่อตัวคุณเอง สภาพจิตใจของคุณสำคัญกว่าทุกสิ่ง
        </p>
        <p 
          className="mb-3 text-base text-gray-700"
          style={{
            fontSize: '15px', // เพิ่มจาก 11px เป็น 15px
            marginBottom: '12px',
            fontWeight: 'bold',
            lineHeight: '1.4'
          }}
        >
          เพราะโลกนี้มีคุณแค่คนเดียว
        </p>
        
        <p 
          className="mt-6 text-xs italic text-gray-600"
          style={{
            fontSize: '14px', // เพิ่มจาก 8px เป็น 11px
            marginTop: '16px',
            lineHeight: '1.4',
            fontStyle: 'italic'
          }}
        >
          *เนื้อหาในเว็บนี้เป็นผลงานการออกแบบการสื่อสารเพื่อเล่าเรื่องราว
          ผ่านการให้ผู้เล่นมีส่วนร่วมด้วย และมิใช่แบบทดสอบทางจิตวิทยาแต่อย่างใด
          หากแต่มีแบบประเมินเพื่อชี้วัดว่า โครงการมีแน้วโน้มไปในทิศทางที่ดีอย่างไร
          โดยจัดทำขึ้นเพื่อเป็นการศึกษาและช่วยเหลือสังคม ตามเงื่อนไขของทุนการศึกษาและปณิธานของผู้จัดทำ
          <br />จัดทำโดย นักศึกษาทุนผู้นำทางสังคมและสิ่งแวดล้อม 
          <br />มหาวิทยาลัยกรุงเทพ
        </p>
      </div>
    </div>
  );
};

export default Caution;