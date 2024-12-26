import React, { useState, useEffect } from 'react';
import './PostSurvey.css';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

function PostSurvey() {
  const { id } = useParams(); // รับ document ID จาก URL
  const navigate = useNavigate();
  const [responses, setResponses] = useState({
    postsurvey_question1: '',
    postsurvey_question2: '',
    postsurvey_question3: '',
    postsurvey_question4: '',
    postsurvey_question5: '',
    postsurvey_question_write1: '' // เปลี่ยนชื่อคำถามใหม่ใน state
  });

  useEffect(() => {
    gsap.fromTo('.postsurvey-container', { opacity: 0 }, { opacity: 1, duration: 1 });
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
      await setDoc(doc(db, "formdata", id), { postsurvey: responses }, { merge: true });
      console.log("Post-survey data added to document with ID: ", id);
      
      // Fade out animation before navigation
      gsap.to('.postsurvey-container', {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          alert('Post-survey submitted'); // แสดงข้อความแจ้งเตือนเมื่อส่งแบบประเมินเสร็จ
        }
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="postsurvey-container">
      <h2>แบบประเมินหลังการทำแบบทดสอบ</h2>
      <form onSubmit={handleSubmit}>
        {[
          { name: 'postsurvey_question1', text: 'ฉันรู้สึกว่าฉันได้เรียนรู้สิ่งใหม่ ๆ จากการทำแบบทดสอบนี้' },
          { name: 'postsurvey_question2', text: 'ฉันรู้สึกว่าฉันสามารถนำสิ่งที่ได้เรียนรู้ไปใช้ในชีวิตประจำวันได้' },
          { name: 'postsurvey_question3', text: 'ฉันรู้สึกว่าฉันมีความเข้าใจในตัวเองมากขึ้น' },
          { name: 'postsurvey_question4', text: 'ฉันรู้สึกว่าฉันสามารถจัดการกับความรู้สึกของตัวเองได้ดีขึ้น' },
          { name: 'postsurvey_question5', text: 'ฉันรู้สึกว่าฉันมีความสุขกับสิ่งที่ตัวเองทำและสิ่งที่ฉันเป็น' }
        ].map((question, index) => (
          <div className="postsurvey-field" key={index}>
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
        <div className="postsurvey-field">
          <label>คุณมีความคิดเห็นเพิ่มเติมเกี่ยวกับแบบทดสอบนี้หรือไม่?</label>
          <textarea
            name="postsurvey_question_write1"
            value={responses.postsurvey_question_write1}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">ส่งแบบประเมิน</button>
      </form>
    </div>
  );
}

export default PostSurvey;