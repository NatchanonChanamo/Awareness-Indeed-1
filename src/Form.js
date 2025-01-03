import React, { useState } from 'react';
import './Form.css';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bulogo from './assets/bulogo.png'; // นำเข้าโลโก้

function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [playerType, setPlayerType] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name,
      age,
      gender,
      playerType,
      acceptPrivacy
    };
    try {
      const docRef = await addDoc(collection(db, "formdata"), formData);
      console.log("Document written with ID: ", docRef.id);
      alert('Form submitted');
      navigate(`/presurvey/${docRef.id}`); // นำทางไปยังหน้า PreSurvey พร้อมกับ document ID
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="form-container">
      <img src={bulogo} alt="BU Logo" className="form-logo" /> {/* เพิ่มโลโก้ */}
      <h2>โปรดกรอกข้อมูล</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>ชื่อ:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>อายุ:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>เพศ:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">เลือกเพศ</option>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
            <option value="othersgender">LGBTQ/อื่น ๆ/ไม่ระบุ</option>
          </select>
        </div>
        <div className="form-field">
          <label>คุณเป็นใคร:</label>
          <select value={playerType} onChange={(e) => setPlayerType(e.target.value)} required>
            <option value="">เลือกประเภท</option>
            <option value="bustudent">นักศึกษามหาวิทยาลัยกรุงเทพ</option>
            <option value="buemployee">บุคลากรของมหาวิทยาลัยกรุงเทพ</option>
            <option value="otherspeople">บุคคลทั่วไป</option>
          </select>
        </div>
        <div className="form-field">
          <label>คุณยินยอมให้เราเก็บข้อมูลของคุณเพื่อการศึกษาและวิเคราะห์ข้อมูลเชิงสถิติหรือไม่</label> {/* เปลี่ยนคำถาม */}
          <select value={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.value)} required> {/* เปลี่ยนตัวแปรเป็น acceptPrivacy */}
            <option value="">เลือกคำตอบ</option>
            <option value="yes">ยินยอม</option>
            <option value="no">ไม่ยินยอม</option>
          </select>
        </div>
        <button type="submit">ส่งข้อมูล</button>
      </form>
    </div>
  );
}

export default Form;
