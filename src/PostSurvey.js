import React, { useState, useEffect } from 'react';
import './PostSurvey.css'; // ใช้ CSS ของตัวเอง
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

const surveySections = [
  {
    title: 'ส่วนที่ 1: สภาวะโดยรวมและความเป็นอยู่ที่ดี',
    questions: [
      { id: 'posts_s1_q1', text: 'ในแต่ละวัน ฉันรู้สึกเหนื่อยล้าทั้งทางร่างกายและจิตใจ น้อยลงกว่าเดิมมาก' },
      { id: 'posts_s1_q2', text: 'ฉันรู้สึกมีความหวังและมองเห็นทางออกในปัญหาชีวิตได้ดีขึ้น' },
      { id: 'posts_s1_q3', text: 'ฉันรู้สึกว่าการใช้ชีวิตตอนนี้มีความสมดุลและจัดการได้ดีขึ้น' },
      { id: 'posts_s1_q4', text: 'ฉันรู้สึกว่าตัวเองมีคุณค่าและมีความหมายในแบบที่ฉันเป็น' },
      { id: 'posts_s1_q5', text: 'ฉันรู้สึกยอมรับในตัวเองที่เป็นคนธรรมดา แต่มีคุณค่าในแบบของตัวเอง' },
    ]
  },
  {
    title: 'ส่วนที่ 2: การรู้จักอารมณ์ตนเอง (Self-awareness)',
    questions: [
      { id: 'posts_s2_q1', text: 'เมื่อรู้สึกแย่ ฉันสามารถระบุและเข้าใจได้ดีว่าตัวเองกำลังรู้สึกอะไรอยู่' },
      { id: 'posts_s2_q2', text: 'ฉันรู้ว่าอารมณ์ของฉันส่งผลต่อร่างกายและความคิดอย่างไรอย่างชัดเจน' },
      { id: 'posts_s2_q3', text: 'ฉันสามารถโต้แย้งความคิดเชิงลบเกี่ยวกับตัวเองได้ดีขึ้น (เช่น "ฉันไม่เอาไหน" หรือ "ฉันไม่คู่ควร")' },
      { id: 'posts_s2_q4', text: 'ฉันกล้าที่จะรับรู้และเผชิญหน้ากับความรู้สึกที่รุนแรงของตัวเองได้ดีขึ้น' },
    ]
  },
  {
    title: 'ส่วนที่ 3: การควบคุมอารมณ์ตนเอง (Self-regulation)',
    questions: [
      { id: 'posts_s3_q1', text: 'เมื่อเผชิญกับอารมณ์ด้านลบ ฉันรู้สึกว่าตัวเองสามารถควบคุมและจัดการมันได้ดีขึ้น' },
      { id: 'posts_s3_q2', text: 'ฉันสามารถเลือกวิธีตอบสนองต่อความรู้สึกไม่ดี เพื่อไม่ให้มันฉุดรั้งฉันไว้ได้' },
      { id: 'posts_s3_q3', text: 'ฉันรู้ว่าควรจะดูแลหรือเติมพลังให้ตัวเองอย่างไรเมื่อรู้สึกอ่อนเพลีย' },
    ]
  },
  {
    title: 'ส่วนที่ 4: แรงจูงใจและเป้าหมายในชีวิต (Motivation)',
    questions: [
      { id: 'posts_s4_q1', text: 'ฉันรู้สึกมีแรงจูงใจและเป้าหมายที่ชัดเจนในการใช้ชีวิตมากกว่าเมื่อก่อน' },
      { id: 'posts_s4_q2', text: 'ความฝันในวัยเด็กของฉันได้กลับมาเป็นแรงบันดาลใจและมีความหมายกับฉันอีกครั้ง' },
      { id: 'posts_s4_q3', text: 'ฉันรู้สึกอยากสร้างสรรค์หรือเปลี่ยนแปลงสิ่งดีๆ ในชีวิตมากขึ้น' },
    ]
  },
  {
    title: 'ส่วนที่ 5: การเข้าใจตนเองและผู้อื่น (Empathy)',
    questions: [
      { id: 'posts_s5_q1', text: 'ฉันสามารถมีเมตตาและเข้าใจ \'ตัวตนที่บอบบาง\' ของฉันเองได้มากขึ้น' },
      { id: 'posts_s5_q2', text: 'ฉันสามารถให้อภัยตัวเองในข้อผิดพลาดที่เคยเกิดขึ้นได้ดีกว่าเมื่อก่อน' },
      { id: 'posts_s5_q3', text: 'ฉันรู้สึกถึงความรักและความเข้าใจต่อตัวเองในวัยเด็กและตัวฉันในปัจจุบัน' },
    ]
  },
  {
    title: 'ส่วนที่ 6: การมีปฏิสัมพันธ์ทางสังคมกับตนเอง (Social Skills)',
    questions: [
      { id: 'posts_s6_q1', text: 'ฉันสามารถบอกปฎิเสธในสิ่งที่ไม่อยากทำเพื่อผู้อื่นได้โดยไม่รู้สึกผิด' },
      { id: 'posts_s6_q2', text: 'ฉันจัดสรรเวลาเพื่อดูแลสุขภาพใจและร่างกายของตัวเองอย่างสม่ำเสมอ' },
      { id: 'posts_s6_q3', text: 'ฉันรู้สึกว่าตัวเองสามารถยืนหยัดเพื่อความต้องการและขอบเขตของตัวเองได้ดีขึ้น' },
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
  const navigate = useNavigate();
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
    try {
      await setDoc(doc(db, "formdata", id), { postsurvey: responses }, { merge: true });
      console.log("Post-survey data added to document with ID: ", id);
      
      gsap.to('.postsurvey-container', {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          navigate(`/result/${id}`); // <-- แก้ไขบรรทัดนี้
        }
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
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
  );
}

export default PostSurvey;