import React, { useState, useEffect } from 'react';
import './PreSurvey.css';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

function PreSurvey() {
  const { id } = useParams(); // รับ document ID จาก URL
  const navigate = useNavigate();
  const [responses, setResponses] = useState({
    presurvey_question1: '',
    presurvey_question2: '',
    presurvey_question3: '',
    presurvey_question4: '',
    presurvey_question5: '',
    presurvey_question_write1: '' // เปลี่ยนชื่อคำถามใหม่ใน state
  });

  useEffect(() => {
    gsap.fromTo('.presurvey-container', { opacity: 0 }, { opacity: 1, duration: 1 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponses(prevResponses => ({
      ...prevResponses,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "formdata", id), { presurvey: responses }, { merge: true });
      console.log("Pre-survey data added to document with ID: ", id);
      
      // Fade out animation before navigation
      gsap.to('.presurvey-container', {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          navigate('/story'); // Navigate to story page after fade out
        }
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="presurvey-container">
      <h2>แบบประเมินก่อนการทำแบบทดสอบ</h2>
      <form onSubmit={handleSubmit}>
        {[
          { name: 'presurvey_question1', text: 'ฉันยอมรับข้อบกพร่องและความไม่สมบูรณ์แบบของตัวเองได้' },
          { name: 'presurvey_question2', text: 'ฉันให้ความสำคัญกับการดูแลสุขภาพทั้งกายและใจ' },
          { name: 'presurvey_question3', text: 'ฉันไม่ใช้ความผิดพลาดในอดีตมาทำร้ายตัวเอง' },
          { name: 'presurvey_question4', text: 'ฉันให้ความสำคัญกับความรู้สึกของตัวเอง' },
          { name: 'presurvey_question5', text: 'ฉันมีความสุขกับสิ่งที่ตัวเองทำและสิ่งที่ฉันเป็น' }
        ].map((question, index) => (
          <div className="presurvey-field" key={index}>
            <label>{question.text}</label>
            <div className="options">
              {['น้อยที่สุด', 'น้อย', 'เฉย ๆ', 'มาก', 'มากที่สุด'].map((option, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={question.name}
                    value={option}
                    checked={responses[question.name] === option}
                    onChange={handleChange}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="presurvey-field">
          <label>ทุกครั้งที่คุณตื่นนอน คุณพร้อมที่จะเริ่มต้นวันใหม่หรือเปล่า?</label>
          <textarea
            name="presurvey_question_write1"
            value={responses.presurvey_question_write1}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">ส่งแบบประเมิน</button>
      </form>
    </div>
  );
}

export default PreSurvey;