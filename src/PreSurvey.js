import React, { useState, useEffect } from 'react';
import './PreSurvey.css';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

// --- Survey Structure ---
const surveySections = [
  {
    title: 'ส่วนที่ 1: สภาวะโดยรวมและความเหนื่อยล้า',
    questions: [
      { id: 's1_q1', text: 'ในแต่ละวัน ฉันรู้สึกเหนื่อยล้าทั้งทางร่างกายและจิตใจบ่อยครั้ง' },
      { id: 's1_q2', text: 'ฉันมักจะรู้สึกท้อแท้และมองไม่เห็นทางออกในปัญหาชีวิต' },
      { id: 's1_q3', text: 'ฉันรู้สึกว่าการใช้ชีวิตในตอนนี้เป็นเรื่องยากลำบากและหนักอึ้ง' },
      { id: 's1_q4', text: 'ฉันมักจะตั้งคำถามว่าตัวเองมีคุณค่าอะไรในชีวิต' },
      { id: 's1_q5', text: 'ฉันรู้สึกว่าตัวเองเป็นแค่คนธรรมดาคนหนึ่งที่ไม่ได้พิเศษอะไร' },
    ]
  },
  {
    title: 'ส่วนที่ 2: การรู้จักอารมณ์ตนเอง (Self-awareness)',
    questions: [
      { id: 's2_q1', text: 'เมื่อรู้สึกแย่ ฉันมักจะสับสนและไม่เข้าใจว่าตัวเองกำลังรู้สึกอะไรกันแน่' },
      { id: 's2_q2', text: 'ฉันไม่แน่ใจว่าอารมณ์ของฉันส่งผลต่อร่างกาย (เช่น ปวดหัว, เหนื่อยง่าย) หรือความคิดของฉันอย่างไร' },
      { id: 's2_q3', text: 'ฉันมักมีความคิดเชิงลบเกี่ยวกับตัวเอง เช่น "ฉันไม่เอาไหน" หรือ "ฉันไม่คู่ควรกับสิ่งดีๆ"' },
      { id: 's2_q4', text: 'ฉันมักจะเก็บกดความรู้สึกที่รุนแรงเอาไว้ภายใน ไม่บอกให้ใครรู้' },
    ]
  },
  {
    title: 'ส่วนที่ 3: การควบคุมอารมณ์ตนเอง (Self-regulation)',
    questions: [
      { id: 's3_q1', text: 'เมื่อเผชิญกับอารมณ์ด้านลบ ฉันรู้สึกว่าตัวเองควบคุมมันได้ยาก' },
      { id: 's3_q2', text: 'ฉันมักจะปล่อยให้ความรู้สึกไม่ดีมาฉุดรั้งและทำให้ฉันหมดกำลังใจที่จะทำสิ่งต่างๆ' },
      { id: 's3_q3', text: 'ฉันไม่ค่อยรู้ว่าควรจะดูแลหรือเติมพลังให้ตัวเองอย่างไรเมื่อรู้สึกอ่อนเพลีย' },
    ]
  },
  {
    title: 'ส่วนที่ 4: แรงจูงใจและเป้าหมายในชีวิต (Motivation)',
    questions: [
      { id: 's4_q1', text: 'ฉันรู้สึกว่าตัวเองขาดแรงจูงใจหรือเป้าหมายที่ชัดเจนในการใช้ชีวิต' },
      { id: 's4_q2', text: 'ความฝันในวัยเด็กของฉันไม่ได้มีความหมายหรือแรงบันดาลใจให้กับฉันในตอนนี้' },
      { id: 's4_q3', text: 'ฉันไม่ค่อยมีความรู้สึกอยากสร้างสรรค์หรือเปลี่ยนแปลงสิ่งใดในชีวิต' },
    ]
  },
  {
    title: 'ส่วนที่ 5: การเข้าใจตนเองและผู้อื่น (Empathy)',
    questions: [
      { id: 's5_q1', text: 'ฉันรู้สึกว่าตัวเองมักจะวิพากษ์วิจารณ์หรือตัดสินตัวเองอย่างรุนแรงเมื่อทำผิดพลาด' },
      { id: 's5_q2', text: 'ฉันไม่ค่อยมีเมตตาหรือความเข้าใจให้กับ \'ตัวตนที่บอบบาง\' ของฉันเอง (เช่น เมื่อรู้สึกอ่อนแอหรือล้มเหลว)' },
      { id: 's5_q3', text: 'ฉันรู้สึกว่าฉันไม่สามารถให้อภัยตัวเองในข้อผิดพลาดที่เคยเกิดขึ้นได้' },
    ]
  },
  {
    title: 'ส่วนที่ 6: การมีปฏิสัมพันธ์ทางสังคมกับตนเอง (Social Skills)',
    questions: [
      { id: 's6_q1', text: 'ฉันมักจะยอมทำในสิ่งที่ไม่อยากทำเพื่อผู้อื่น แม้จะรู้สึกไม่สบายใจก็ตาม' },
      { id: 's6_q2', text: 'ฉันไม่ค่อยจัดสรรเวลาเพื่อดูแลสุขภาพใจหรือความสุขส่วนตัวของตัวเองอย่างจริงจัง' },
      { id: 's6_q3', text: 'ฉันรู้สึกว่าตัวเองยังไม่สามารถยืนหยัดเพื่อความต้องการของตัวเองได้ดีพอ' },
    ]
  },
  {
    title: 'ส่วนที่ 7: ความคาดหวังจากนิทรรศการ',
    questions: [
      { id: 's7_q1', text: 'ฉันคิดว่านิทรรศการนี้จะช่วยให้ฉันเข้าใจตัวเองได้ดีขึ้น' },
      { id: 's7_q2', text: 'ฉันหวังว่านิทรรศการนี้จะช่วยให้ฉันรักตัวเองได้มากขึ้น' },
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
                <label>{question.text}</label>
                <div className="options">
                  {ratingOptions.map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={responses[question.id] === option.value}
                        onChange={handleChange}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        <button type="submit">เริ่มต้นการเดินทาง</button>
      </form>
    </div>
  );
}

export default PreSurvey;