import React, { useState, useEffect } from 'react';
import './PostSurvey.css'; // ใช้ CSS ของตัวเอง
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate
import { gsap } from 'gsap';

const surveySections = [
  {
    title: 'ส่วนที่ 1: ความรู้สึกในชีวิตประจำวัน',
    questions: [
      { id: 'posts_s1_q1', text: 'ในแต่ละวัน ฉันรู้สึกกระตือรือร้น' },
      { id: 'posts_s1_q2', text: 'ฉันรู้สึกมองเห็นโอกาสในการแก้ไขปัญหาชีวิต' },
      { id: 'posts_s1_q3', text: 'ฉันรู้สึกว่าการใช้ชีวิตในตอนนี้เป็นเรื่องที่ฉันสามารถจัดการได้' },
      { id: 'posts_s1_q4', text: 'ฉันเชื่อว่าตัวเองมีคุณค่า มีความหมายในชีวิต' },
      { id: 'posts_s1_q5', text: 'ฉันรู้สึกว่าตัวเองเป็นคนที่มีคุณค่าในแบบของตัวเอง' },
    ]
  },
  {
    title: 'ส่วนที่ 2: การรู้จักอารมณ์ตนเอง (Self-awareness)',
    questions: [
      { id: 'posts_s2_q1', text: 'เมื่อมีอารมณ์เกิดขึ้น ฉันจะเข้าใจได้ว่าตัวเองกำลังรู้สึกอะไร' },
      { id: 'posts_s2_q2', text: 'ฉันตระหนักดีว่าอารมณ์ของฉันส่งผลต่อความคิดของฉันอย่างไร' },
      { id: 'posts_s2_q3', text: 'ฉันมีความคิดเชิงบวกเกี่ยวกับตัวเอง' },
      { id: 'posts_s2_q4', text: 'ฉันสามารถรับรู้ความรู้สึกที่รุนแรงของตัวเองได้' },
    ]
  },
  {
    title: 'ส่วนที่ 3: การควบคุมอารมณ์ตนเอง (Self-regulation)',
    questions: [
      { id: 'posts_s3_q1', text: 'เมื่อเผชิญกับอารมณ์ที่ท้าทาย ฉันรู้สึกว่าตัวเองสามารถจัดการมันได้ดี' },
      { id: 'posts_s3_q2', text: 'ฉันสามารถเปลี่ยนความรู้สึกไม่ดีให้เป็นพลังในการก้าวเดินต่อไปได้' },
      { id: 'posts_s3_q3', text: 'ฉันรู้ว่าควรจะเติมพลังให้ตัวเองอย่างไร เมื่อรู้สึกอ่อนเพลีย' },
    ]
  },
  {
    title: 'ส่วนที่ 4: แรงจูงใจและเป้าหมายในชีวิต (Motivation)',
    questions: [
      { id: 'posts_s4_q1', text: 'ฉันรู้สึกมีเป้าหมายที่ชัดเจนในการใช้ชีวิต' },
      { id: 'posts_s4_q2', text: 'ความฝันในวัยเด็กของฉันยังคงเป็นแรงบันดาลใจให้กับฉันในตอนนี้' },
      { id: 'posts_s4_q3', text: 'ฉันมีความรู้สึกอยากสร้างสรรค์สิ่งดีๆ ในชีวิต' },
    ]
  },
  {
    title: 'ส่วนที่ 5: การเข้าใจตนเองและผู้อื่น (Empathy)',
    questions: [
      { id: 'posts_s5_q1', text: 'ฉันสามารถให้ความเข้าใจกับตัวเองเมื่อทำผิดพลาด' },
      { id: 'posts_s5_q2', text: 'ฉันมีเมตตาและเข้าใจ \'ตัวตนที่บอบบาง\' ของฉันเอง (เช่น เมื่อรู้สึกอ่อนแอหรือล้มเหลว)' },
      { id: 'posts_s5_q3', text: 'ฉันสามารถให้อภัยตัวเองในข้อผิดพลาดที่เคยเกิดขึ้นได้' },
    ]
  },
  {
    title: 'ส่วนที่ 6: การมีปฏิสัมพันธ์ทางสังคมกับตนเอง (Social Skills)',
    questions: [
      { id: 'posts_s6_q1', text: 'ฉันสามารถปฏิเสธในสิ่งที่ไม่อยากทำเพื่อผู้อื่นได้อย่างสบายใจ' },
      { id: 'posts_s6_q2', text: 'ฉันจัดสรรเวลาเพื่อดูแลสุขภาพใจของตัวเองอย่างจริงจัง' },
      { id: 'posts_s6_q3', text: 'ฉันสามารถยืนหยัดเพื่อความต้องการของตัวเองได้ดี' },
    ]
  },
  {
    title: 'ส่วนที่ 7: ประเมินประสบการณ์นิทรรศการ',
    questions: [
      { id: 'posts_s7_q1', text: 'นิทรรศการนี้ช่วยให้ฉันเข้าใจแนวคิด \'การรักตัวเอง\' ได้ดีขึ้นมาก' },
      { id: 'posts_s7_q2', text: 'เนื้อเรื่องและคำถามในนิทรรศการมีความน่าสนใจและชวนให้คิดตาม' },
      { id: 'posts_s7_q3', text: 'ฉันรู้สึกประทับใจกับการเดินทางในนิทรรศการนี้ และคิดว่าจะนำสิ่งที่ได้เรียนรู้ไปใช้ในชีวิตจริง' },
      { id: 'posts_s7_q4', text: 'ฉันจะแนะนำนิทรรศการนี้ให้กับผู้อื่นที่ต้องการสำรวจและรักตัวเอง' },
    ]
  }
];

const initialResponses = surveySections.flatMap(section => section.questions).reduce((acc, question) => {
  acc[question.id] = '';
  return acc;
}, { feedback: '' }); // เพิ่ม state สำหรับข้อเสนอแนะ

const ratingOptions = [
  { value: '5', label: '5' },
  { value: '4', label: '4' },
  { value: '3', label: '3' },
  { value: '2', label: '2' },
  { value: '1', label: '1' },
];

function PostSurvey() {
  const { id } = useParams();
  const navigate = useNavigate(); // เพิ่มบรรทัดนี้
  const [responses, setResponses] = useState(initialResponses);

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
    console.log("PostSurvey handleSubmit called");
    
    try {
      await setDoc(doc(db, "formdata", id), { postsurvey: responses }, { merge: true });
      console.log("Post-survey data added to document with ID: ", id);
      
      // รับข้อมูลการ์ดจาก localStorage ที่ Story.js ส่งมา
      const userCardData = localStorage.getItem('userCardData');
      console.log("Retrieved userCardData from localStorage:", userCardData);
      
      let cardParams = '';
      
      if (userCardData) {
        const cardData = JSON.parse(userCardData);
        console.log("Parsed cardData:", cardData);
        cardParams = `?cardType=${encodeURIComponent(cardData.cardType)}&cardTitle=${encodeURIComponent(cardData.cardTitle)}&cardImage=${encodeURIComponent(cardData.cardImage)}`;
        // ลบข้อมูลออกจาก localStorage หลังใช้งานแล้ว
        localStorage.removeItem('userCardData');
      } else {
        console.log("No userCardData found, using fallback");
        // fallback ถ้าไม่มีข้อมูลการ์ด
        cardParams = `?cardType=ผู้รับฟัง&cardTitle=ผู้รับมือ&cardImage=`;
      }
      
      const targetUrl = `/resultcard/${id}${cardParams}`;
      console.log("Navigating to:", targetUrl);
      
      // เปลี่ยนจาก window.location เป็น navigate ที่ทำงานได้ถูกต้อง
      gsap.to('.postsurvey-container', {
        opacity: 0,
        y: -20,
        duration: 0.7,
        ease: 'power3.in',
        onComplete: () => {
          navigate(targetUrl); // ใช้ navigate แทน window.location
        }
      });
      
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      overflowY: 'auto', 
      overflowX: 'hidden',
      backgroundColor: '#f5f3ff'
    }}>
      <div className="postsurvey-container">
        <div className="postsurvey-header">
          <h2>แบบประเมินหลังกิจกรรม: การประเมินผลการตระหนักรู้และการเปลี่ยนแปลงภายใน</h2>
          <div className="instructions">
            <p><strong>คำแนะนำสำหรับผู้เล่น:</strong> "ยินดีด้วย! คุณได้เสร็จสิ้นการเดินทางอันน่ามหัศจรรย์นี้แล้ว โปรดอ่านแต่ละข้อความด้านล่าง และเลือกตัวเลือกที่ตรงกับความรู้สึกหรือความคิดของคุณใน 'ปัจจุบัน' (หลังจากการเดินทางนี้) มากที่สุด เพื่อให้เราได้เห็นถึงการเปลี่ยนแปลงที่เกิดขึ้นกับคุณ"</p>
          </div>
        <div className="scale-guide">
          <p><strong>มาตรวัด:</strong> 5 = เป็นจริงอย่างยิ่ง, 4 = ค่อนข้างเป็นจริง, 3 = เป็นจริงปานกลาง, 2 = ไม่ค่อยเป็นจริง, 1 = ไม่เป็นจริงเลย</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {surveySections.map((section) => (
          <div className="survey-section" key={section.title}>
            <h3>{section.title}</h3>
            {section.questions.map((question) => (
              <div className="postsurvey-field" key={question.id}>
                <label className="question-text">{question.text}</label>
                <div className="rating-scale-container">
                  <span className="scale-label-start">เป็นจริงอย่างยิ่ง</span>
                  <div className="options">
                    {ratingOptions.map((option) => (
                      <label key={option.value} className="option-label">
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={responses[question.id] === option.value}
                          onChange={handleChange}
                          required
                        />
                        <span className="option-value">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  <span className="scale-label-end">ไม่เป็นจริงเลย</span>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="survey-section">
           <h3>ข้อเสนอแนะเพิ่มเติม</h3>
           <div className="postsurvey-field">
            <label>มีสิ่งใดที่คุณคิดว่านิทรรศการนี้สามารถปรับปรุงให้ดีขึ้นได้อีกบ้าง? (เช่น ความยาว, ความยากของคำถาม, กราฟิก, เสียง, ฯลฯ)</label>
            <textarea
              name="feedback"
              value={responses.feedback}
              onChange={handleChange}
              placeholder="เขียนความคิดเห็นของคุณที่นี่..."
            />
          </div>
        </div>

        <button type="submit">เสร็จสิ้นการเดินทาง</button>
      </form>
      </div>
    </div>
  );
}

export default PostSurvey;