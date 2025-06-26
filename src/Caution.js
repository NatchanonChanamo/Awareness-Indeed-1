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
      {/* เปลี่ยนกลับเป็น text-center ทั้งหมด */}
      <div className="w-full max-w-sm text-center px-6">
        <h2 className="mb-4 text-2xl font-bold text-red-500">คำเตือน</h2>

        {/* เพิ่มคลาส text-balance ที่นี่ */}
        <p className="mb-3 text-base text-gray-700 text-balance">
          เว็บนี้มีเนื้อหาเกี่ยวกับความรู้สึกและความทรงจำที่คุณมีทั้งหมด หากคุณมีสภาวะจิตใจที่ไม่มั่นคง ไม่รักตัวเอง เกลียดตัวเอง เหยียดหยามตัวเอง รวมถึงยังรับมือกับสภาวะทางอารมณ์ลบของตนเองได้ไม่ดี หรือมีความทรงจำที่ไม่อยากนึกถึง
        </p>
        <p className="mb-3 text-base text-gray-700 text-balance">
          โปรดพิจารณาความเสี่ยงก่อนลงมือทำแบบทดสอบ
          หากคุณรู้สึกไม่สบายใจระหว่างการเล่น สามารถหยุดเล่นได้ตลอดเลยนะ
        </p>
        <p className="mb-3 text-base text-gray-700 text-balance">
          ซึ่งก็จริงอยู่ที่เราต้องจัดเก็บข้อมูลเพื่อการศึกษา แต่เพื่อตัวคุณเอง สภาพจิตใจของคุณสำคัญกว่าทุกสิ่ง
        </p>
        <p className="mb-3 text-base text-gray-700">
          <strong>เพราะโลกนี้มีคุณแค่คนเดียว</strong>
        </p>
        
        <p className="mt-6 text-xs italic text-gray-600">
          *เนื้อหาในเว็บนี้เป็นผลงานการออกแบบการสื่อสารเพื่อเล่าเรื่องราว
          ผ่านการให้ผู้เล่นมีส่วนร่วมด้วย และมิใช่แบบทดสอบทางจิตวิทยาแต่อย่างใด
          หากแต่มีแบบประเมินเพื่อชี้วัดว่า โครงการมีแน้วโน้มไปในทิศทางที่ดีอย่างไร
          โดยจัดทำขึ้นเพื่อเป็นการศึกษาและช่วยเหลือสังคม ตามเงื่อนไขของทุนการศึกษาและปณิธานของผู้จัดทำ*
          <br />จัดทำโดย นักศึกษาทุนผู้นำทางสังคมและสิ่งแวดล้อม 
          <br />มหาวิทยาลัยกรุงเทพ
        </p>
      </div>
    </div>
  );
};

export default Caution;