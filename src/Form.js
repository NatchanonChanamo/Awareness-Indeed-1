import React, { useState } from 'react';
import './Form.css';

function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [playerType, setPlayerType] = useState('');
  const [saveLater, setSaveLater] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    alert('Form submitted');
  };

  return (
    <div className="form-container">
      <h2>ข้อมูลผู้ใช้</h2>
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
            <option value="othersgender">อื่น ๆ</option>
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
          <label>คุณต้องการให้เราบันทึกคำตอบของคุณเพื่อส่งให้คุณในภายหลังหรือไม่</label>
          <select value={saveLater} onChange={(e) => setSaveLater(e.target.value)} required>
            <option value="">เลือกคำตอบ</option>
            <option value="yes">ต้องการ</option>
            <option value="no">ไม่ต้องการ</option>
          </select>
        </div>
        <button type="submit">ส่งข้อมูล</button>
      </form>
    </div>
  );
}

export default Form;
