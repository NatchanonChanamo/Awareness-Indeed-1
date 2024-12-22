import React, { useState, useEffect } from 'react';
import './PreSurvey.css';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';

function PreSurvey() {
  const { id } = useParams(); // รับ document ID จาก URL
  const [responses, setResponses] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: ''
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
      alert('Pre-survey submitted');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="presurvey-container">
      <h2>แบบประเมินก่อนการทำแบบทดสอบ</h2>
      <form onSubmit={handleSubmit}>
        {['question1', 'question2', 'question3', 'question4', 'question5'].map((question, index) => (
          <div className="presurvey-field" key={index}>
            <label>คำถามที่ {index + 1}</label>
            <div className="options">
              {['น้อยที่สุด', 'น้อย', 'เฉย ๆ', 'มาก', 'มากที่สุด'].map((option, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={question}
                    value={option}
                    checked={responses[question] === option}
                    onChange={handleChange}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit">ส่งแบบประเมิน</button>
      </form>
    </div>
  );
}

export default PreSurvey;