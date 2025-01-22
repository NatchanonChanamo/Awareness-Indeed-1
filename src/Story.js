import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate, useParams } from 'react-router-dom';
import './Story.css';
import time1 from './assets/time1.gif'; // นำเข้าไฟล์ GIF

function Story() {
  const storyContainerRef = useRef(null);
  const textRef = useRef(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams(); // รับ document ID จาก URL

  useEffect(() => {
    // Initial fade in animation
    gsap.fromTo(
      storyContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.inOut" }
    );

    // Text reveal animation
    gsap.fromTo(
      textRef.current,
      { 
        opacity: 0,
        y: 20 
      },
      { 
        opacity: 1,
        y: 0,
        duration: 2,
        delay: 0.5,
        ease: "power2.out"
      }
    );

    // Add click event listener to the container
    const handleClick = () => {
      gsap.to(storyContainerRef.current, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          if (step < 3) {
            setStep(step + 1);
            gsap.to(storyContainerRef.current, { opacity: 1, duration: 1 });
          } else {
            navigate(`/postsurvey/${id}`); // Navigate to post-survey page after the last step
          }
        }
      });
    };

    const container = storyContainerRef.current;
    container.addEventListener('click', handleClick);

    // Cleanup event listener on component unmount
    return () => {
      if (container) {
        container.removeEventListener('click', handleClick);
      }
    };
  }, [step, navigate, id]);

  return (
    <div className="story-container flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${time1})` }} ref={storyContainerRef}>
      <div className="story-content max-w-lg text-center p-8 bg-white bg-opacity-90 rounded-lg shadow-md" ref={textRef}>
        {step === 1 && (
          <>
            <h1 className="text-3xl font-semibold text-purple-600 mb-6">ความทรงจำของคุณ</h1>
            <p className="text-lg text-gray-700 mb-4">
              ในทุก ๆ วัน เราต่างมีเรื่องราวมากมายที่ผ่านเข้ามาในชีวิต
              บางเรื่องสร้างรอยยิ้ม บางเรื่องทิ้งร่องรอยความเจ็บปวดไว้
              แต่ทุกเรื่องราวล้วนมีความหมาย และทำให้คุณเป็นตัวคุณในวันนี้
            </p>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-3xl font-semibold text-purple-600 mb-6">บทที่ 1</h1>
            <p className="text-lg text-gray-700 mb-4">
              เรามาลองย้อนกลับไปในความทรงจำของคุณ
              และค้นหาความหมายที่ซ่อนอยู่ในนั้นด้วยกัน...
            </p>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-3xl font-semibold text-purple-600 mb-6">บทที่ 2</h1>
            <p className="text-lg text-gray-700 mb-4">
              คุณจำได้ไหมว่าครั้งสุดท้ายที่คุณรู้สึกมีความสุขคือเมื่อไหร่?
              ลองนึกถึงช่วงเวลานั้นและความรู้สึกที่คุณมี...
            </p>
          </>
        )}
        {/* เพิ่มขั้นตอนอื่น ๆ ตามต้องการ */}
      </div>
    </div>
  );
}

export default Story;