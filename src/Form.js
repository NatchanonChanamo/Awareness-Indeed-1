import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bulogo from './assets/bulogo.png';
import projectLogo from './assets/ProjectLogo.png'; // Import โลโก้โปรเจกต์
import LoginBG from './assets/LoginBG.png'; // Import รูปพื้นหลัง
import EmergencyHelp from './EmergencyHelp';

function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [playerType, setPlayerType] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState('');
  const navigate = useNavigate();

  // ฟังก์ชันจัดการการป้อนชื่อ - ไม่อนุญาตให้ใส่ตัวเลข
  const handleNameChange = (e) => {
    const value = e.target.value;
    // ใช้ regex เพื่อกรองเฉพาะตัวอักษร ช่องว่าง และเครื่องหมายพิเศษที่จำเป็น (ไม่รวมตัวเลข)
    const filteredValue = value.replace(/[0-9]/g, '');
    setName(filteredValue);
  };

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
      // บันทึกข้อมูลลง localStorage ทันที (backup)
      localStorage.setItem('formData', JSON.stringify(formData));
      localStorage.setItem('playerName', name); // เก็บชื่อแยกต่างหาก เพื่อความแน่ใจ
      console.log('Saved to localStorage:', formData);
      
      // พยายามบันทึกลง Firebase
      const docRef = await addDoc(collection(db, "formdata"), formData);
      console.log("Document written with ID: ", docRef.id);
      
      // บันทึก document ID ลง localStorage ด้วย
      localStorage.setItem('formDataId', docRef.id);
      
      navigate(`/presurvey/${docRef.id}`); 
    } catch (e) {
      console.error("Error adding document: ", e);
      
      // หาก Firebase ล้มเหลว ใช้ timestamp เป็น ID แทน
      const fallbackId = `local_${Date.now()}`;
      localStorage.setItem('formDataId', fallbackId);
      console.log('Using fallback ID:', fallbackId);
      
      navigate(`/presurvey/${fallbackId}`);
    }
  };

  return (
    // --- ปรับปรุง Container หลัก ---
    <div 
      className="flex flex-col items-center justify-center min-h-full bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${LoginBG})` }}
    >
      {/* --- เพิ่มโลโก้คู่ --- */}
      <div className="flex items-center justify-center gap-8 sm:gap-12 mb-6">
        <img src={bulogo} alt="BU Logo" className="max-w-[120px] sm:max-w-[150px] h-auto" />
        <img src={projectLogo} alt="Project Logo" className="max-w-[120px] sm:max-w-[150px] h-auto" />
      </div>
      
      {/* --- ปรับสีและสไตล์หัวข้อ --- */}
      <h2 
        className="mb-5 text-2xl font-semibold text-white"
        style={{ textShadow: '1px 1px 6px rgba(0, 0, 0, 0.6)' }}
      >
        โปรดกรอกข้อมูล
      </h2>

      {/* --- ปรับสไตล์ฟอร์มให้โปร่งแสง --- */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl">
        
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">ชื่อ:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            className="w-full px-3 py-1.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="อยากให้เราเรียกคุณว่าอะไรดี"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">อายุ:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="w-full px-3 py-1.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">เพศ:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="w-full px-3 py-1.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">เลือกเพศ</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
            <option value="ไม่ระบุ">LGBTQ/อื่น ๆ/ไม่ระบุ</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">คุณเป็นใคร:</label>
          <select
            value={playerType}
            onChange={(e) => setPlayerType(e.target.value)}
            required
            className="w-full px-3 py-1.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">เลือกประเภท</option>
            <option value="bustudent">นักศึกษามหาวิทยาลัยกรุงเทพ</option>
            <option value="buemployee">บุคลากรของมหาวิทยาลัยกรุงเทพ</option>
            <option value="otherspeople">บุคคลทั่วไป</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">คุณยินยอมให้เราเก็บข้อมูลของคุณเพื่อการศึกษาและวิเคราะห์ข้อมูลเชิงสถิติหรือไม่</label>
          <select
            value={acceptPrivacy}
            onChange={(e) => setAcceptPrivacy(e.target.value)}
            required
            className="w-full px-3 py-1.5 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">เลือกคำตอบ</option>
            <option value="yes">ยินยอม</option>
            <option value="no">ไม่ยินยอม</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-base font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          ส่งข้อมูล
        </button>
      </form>

      {/* เพิ่มปุ่มช่วยเหลือฉุกเฉิน */}
      <EmergencyHelp />
    </div>
  );
}

export default Form;