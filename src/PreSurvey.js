import React, { useState, useEffect } from 'react';
import './PreSurvey.css';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// --- Survey Structure ---
const surveySections = [
  {
    title: 'ส่วนที่ 1: ความรู้สึกในชีวิตประจำวัน',
    questions: [
      { id: 's1_q1', text: 'ในแต่ละวัน ฉันรู้สึกกระตือรือร้น' }, // ปรับจากเหนื่อยล้า
      { id: 's1_q2', text: 'ฉันรู้สึกมองเห็นโอกาสในการแก้ไขปัญหาชีวิต' }, // ปรับจากท้อแท้
      { id: 's1_q3', text: 'ฉันรู้สึกว่าการใช้ชีวิตในตอนนี้เป็นเรื่องที่ฉันสามารถจัดการได้' }, // ปรับจากยากลำบาก
      { id: 's1_q4', text: 'ฉันเชื่อว่าตัวเองมีคุณค่า มีความหมายในชีวิต' }, // ปรับจากตั้งคำถามคุณค่า
      { id: 's1_q5', text: 'ฉันรู้สึกว่าตัวเองเป็นคนที่มีคุณค่าในแบบของตัวเอง' }, // ปรับจากเป็นแค่คนธรรมดา
    ]
  },
  {
    title: 'ส่วนที่ 2: การรู้จักอารมณ์ตนเอง (Self-awareness)',
    questions: [
      { id: 's2_q1', text: 'เมื่อมีอารมณ์เกิดขึ้น ฉันจะเข้าใจได้ว่าตัวเองกำลังรู้สึกอะไร' }, // ปรับจากไม่เข้าใจ
      { id: 's2_q2', text: 'ฉันตระหนักดีว่าอารมณ์ของฉันส่งผลต่อความคิดของฉันอย่างไร' }, // ปรับจากไม่แน่ใจผลกระทบ
      { id: 's2_q3', text: 'ฉันมีความคิดเชิงบวกเกี่ยวกับตัวเอง' }, // ปรับจากความคิดลบ
      { id: 's2_q4', text: 'ฉันสามารถรับรู้ความรู้สึกที่รุนแรงของตัวเองได้' }, // ปรับจากเก็บกด
    ]
  },
  {
    title: 'ส่วนที่ 3: การควบคุมอารมณ์ตนเอง (Self-regulation)',
    questions: [
      { id: 's3_q1', text: 'เมื่อเผชิญกับอารมณ์ที่ท้าทาย ฉันรู้สึกว่าตัวเองสามารถจัดการมันได้ดี' }, // ปรับจากควบคุมยาก
      { id: 's3_q2', text: 'ฉันสามารถเปลี่ยนความรู้สึกไม่ดีให้เป็นพลังในการก้าวเดินต่อไปได้' }, // ปรับจากปล่อยให้ฉุดรั้ง
      { id: 's3_q3', text: 'ฉันรู้ว่าควรจะเติมพลังให้ตัวเองอย่างไร เมื่อรู้สึกอ่อนเพลีย' }, // ปรับจากไม่ค่อยรู้
    ]
  },
  {
    title: 'ส่วนที่ 4: แรงจูงใจและเป้าหมายในชีวิต (Motivation)',
    questions: [
      { id: 's4_q1', text: 'ฉันรู้สึกมีเป้าหมายที่ชัดเจนในการใช้ชีวิต' }, // ปรับจากขาดแรงจูงใจ
      { id: 's4_q2', text: 'ความฝันในวัยเด็กของฉันยังคงเป็นแรงบันดาลใจให้กับฉันในตอนนี้' }, // ปรับจากไม่มีความหมาย
      { id: 's4_q3', text: 'ฉันมีความรู้สึกอยากสร้างสรรค์สิ่งดีๆ ในชีวิต' }, // ปรับจากไม่ค่อยอยาก
    ]
  },
  {
    title: 'ส่วนที่ 5: การเข้าใจตนเองและผู้อื่น (Empathy)',
    questions: [
      { id: 's5_q1', text: 'ฉันสามารถให้ความเข้าใจกับตัวเองเมื่อทำผิดพลาด' }, // ปรับจากการวิพากษ์วิจารณ์
      { id: 's5_q2', text: 'ฉันมีเมตตาและเข้าใจ \'ตัวตนที่บอบบาง\' ของฉันเอง (เช่น เมื่อรู้สึกอ่อนแอหรือล้มเหลว)' }, // ปรับจากไม่มีเมตตา
      { id: 's5_q3', text: 'ฉันสามารถให้อภัยตัวเองในข้อผิดพลาดที่เคยเกิดขึ้นได้' }, // ปรับจากไม่สามารถให้อภัย
    ]
  },
  {
    title: 'ส่วนที่ 6: การมีปฏิสัมพันธ์ทางสังคมกับตนเอง (Social Skills)',
    questions: [
      { id: 's6_q1', text: 'ฉันสามารถปฏิเสธในสิ่งที่ไม่อยากทำเพื่อผู้อื่นได้อย่างสบายใจ' }, // ปรับจากยอมทำ
      { id: 's6_q2', text: 'ฉันจัดสรรเวลาเพื่อดูแลสุขภาพใจของตัวเองอย่างจริงจัง' }, // ปรับจากไม่ค่อยจัดสรร
      { id: 's6_q3', text: 'ฉันสามารถยืนหยัดเพื่อความต้องการของตัวเองได้ดี' }, // ปรับจากไม่สามารถยืนหยัด
    ]
  },
  {
    title: 'ส่วนที่ 7: ความคาดหวังจากนิทรรศการ',
    questions: [
      { id: 's7_q1', text: 'ฉันเชื่อว่านิทรรศการนี้จะช่วยให้ฉันเข้าใจตัวเองได้ดีขึ้น' }, // ปรับจากคิดว่าช่วยได้
      { id: 's7_q2', text: 'ฉันเชื่อว่านิทรรศการนี้จะช่วยเสริมสร้างความรักในตัวเองให้ฉัน' }, // ปรับจากหวังว่าช่วยได้
    ]
  }
];

// Generate initial state from the survey structure
const initialResponses = surveySections.flatMap(section => section.questions).reduce((acc, question) => {
  acc[question.id] = '';
  return acc;
}, {});

const ratingOptions = [
  { value: '5', label: '5' },
  { value: '4', label: '4' },
  { value: '3', label: '3' },
  { value: '2', label: '2' },
  { value: '1', label: '1' },
];

function PreSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState(initialResponses);

  useEffect(() => {
    gsap.fromTo('.presurvey-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
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
      
      gsap.to('.presurvey-container', {
        opacity: 0,
        y: -20,
        duration: 0.7,
        ease: 'power3.in',
        onComplete: () => {
          navigate(`/story/${id}`);
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
      backgroundColor: '#fdf2f8'
    }}>
      <div className="presurvey-container">
        <div className="presurvey-header">
          <h2>แบบประเมิน 'ก่อน': การสำรวจสภาวะภายในและมุมมองต่อตนเอง</h2>
          <div className="instructions">
          <p><strong>คำแนะนำสำหรับผู้เล่น:</strong> "โปรดอ่านแต่ละข้อความด้านล่าง และเลือกตัวเลือกที่ตรงกับความรู้สึกหรือความคิดของคุณใน 'ปัจจุบัน' มากที่สุด ไม่มีคำตอบที่ถูกหรือผิด นี่คือการสำรวจเพื่อทำความเข้าใจตัวคุณเอง"</p>
        </div>
        <div className="scale-guide">
          <p><strong>มาตรวัด:</strong> 1 = ไม่เป็นจริงเลย, 2 = ไม่ค่อยเป็นจริง, 3 = เป็นจริงปานกลาง, 4 = ค่อนข้างเป็นจริง, 5 = เป็นจริงอย่างยิ่ง</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {surveySections.map((section) => (
          <div className="survey-section" key={section.title}>
            <h3>{section.title}</h3>
            {section.questions.map((question) => (
              <div className="presurvey-field" key={question.id}>
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
        <button type="submit">ส่งแบบประเมิน</button>
      </form>
      </div>
    </div>
  );
}

export default PreSurvey;