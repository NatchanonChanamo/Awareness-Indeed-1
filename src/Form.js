import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bulogo from './assets/bulogo.png';

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
      navigate(`/presurvey/${docRef.id}`); 
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    // ปรับแก้ Padding และ Background
    <div className="flex flex-col items-center justify-center min-h-full bg-pink-100 p-4">
      <img src={bulogo} alt="BU Logo" className="max-w-[150px] mb-4" /> 
      {/* ปรับแก้ขนาดตัวอักษรและ Margin */}
      <h2 className="mb-4 text-xl font-semibold text-purple-600">โปรดกรอกข้อมูล</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs p-6 bg-white rounded-lg shadow-md">
        
        {/* ปรับแก้ Label และ Input field ทั้งหมด */}
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">ชื่อ:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-1.5 text-base border border-purple-300 rounded-md focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">อายุ:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="w-full px-3 py-1.5 text-base border border-purple-300 rounded-md focus:outline-none focus:border-purple-500"
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">เพศ:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="w-full px-3 py-1.5 text-base border border-purple-300 rounded-md focus:outline-none focus:border-purple-500"
          >
            <option value="">เลือกเพศ</option>
            <option value="male">ชาย</option>
            <option value="female">หญิง</option>
            <option value="othersgender">LGBTQ/อื่น ๆ/ไม่ระบุ</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-700">คุณเป็นใคร:</label>
          <select
            value={playerType}
            onChange={(e) => setPlayerType(e.target.value)}
            required
            className="w-full px-3 py-1.5 text-base border border-purple-300 rounded-md focus:outline-none focus:border-purple-500"
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
            className="w-full px-3 py-1.5 text-base border border-purple-300 rounded-md focus:outline-none focus:border-purple-500"
          >
            <option value="">เลือกคำตอบ</option>
            <option value="yes">ยินยอม</option>
            <option value="no">ไม่ยินยอม</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-base font-medium text-white bg-purple-500 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
        >
          ส่งข้อมูล
        </button>
      </form>
    </div>
  );
}

export default Form;