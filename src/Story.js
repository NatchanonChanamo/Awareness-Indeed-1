import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import gsap from 'gsap';

// --- BG IMAGES ---
import carOnStreetBg from './assets/caronstreet.gif';
import opendoor1 from './assets/opendoor1.png';
import opendoor2 from './assets/opendoor2.png';
import darkroom1 from './assets/darkroom1.gif';
import rain1 from './assets/rain1.jpg';
import rain2 from './assets/rain2.jpg';
import rain3 from './assets/rain3.jpg';
import room1 from './assets/room1.jpg';
import room2 from './assets/room2.jpg';
import room3 from './assets/room3.jpg';
import room4 from './assets/room4.jpg';
import light1 from './assets/light1.png';
import light2 from './assets/light2.jpg';
import light3 from './assets/light3.jpg';
import nature1 from './assets/nature1.png';
import nature3 from './assets/nature3.png';
import nature5 from './assets/nature5.png';
import whiteman1 from './assets/whiteman1.png';
import whiteman1gif from './assets/whiteman1.gif';
import whiteman3 from './assets/whiteman3.png';
import whiteman4 from './assets/whiteman4.png';
import whiteman5 from './assets/whiteman5.png';
import whiteman6 from './assets/whiteman6.png';
import whiteman7 from './assets/whiteman7.png';
import whiteman8 from './assets/whiteman8.png';
import whiteman9 from './assets/whiteman9.png';
import whiteman10 from './assets/whiteman10.png';
import whiteman11 from './assets/whiteman11.png';
import whiteman12 from './assets/whiteman12.png';
import comehome from './assets/comehome.png';
import result from './assets/result.png';

// --- AUDIO FILES ---
import bgmusic1 from './assets/bgmusic1.mp3';
import bgmusic2 from './assets/bgmusic2.mp3';
import bgmusic3 from './assets/bgmusic3.mp3';
import rainsound from './assets/rainsound.mp3';
import lightningsound from './assets/lightningsound.mp3';
import warpdoorsound from './assets/warpdoorsound.mp3';
import warpsound from './assets/warpsound.mp3';
import windsound from './assets/Windsound.mp3';
import dooropen from './assets/dooropen.mp3';
import alarm from './assets/alarm.mp3';

// --- CARD IMAGES ---
// Male Cards
import MCard1 from './assets/Mcard1.png';
import MCard2 from './assets/Mcard2.png';
import MCard3 from './assets/Mcard3.png';
import MCard4 from './assets/Mcard4.png';
import MCard5 from './assets/Mcard5.png';

// Female Cards
import FMCard1 from './assets/FMcard1.png';
import FMCard2 from './assets/FMcard2.png';
import FMCard3 from './assets/FMcard3.png';
import FMCard4 from './assets/FMcard4.png';
import FMCard5 from './assets/FMcard5.png';

// Non-binary Cards
import NCard1 from './assets/Ncard1.png';
import NCard2 from './assets/Ncard2.png';
import NCard3 from './assets/Ncard3.png';
import NCard4 from './assets/Ncard4.png';
import NCard5 from './assets/Ncard5.png';

// --- Helper Components ---
const InputWrapper = ({ question, value, setter, handleTextInputSubmit, nextStep, placeholder, step }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      handleTextInputSubmit(nextStep);
    }
  };
  
  // ปรับ style ตาม step
  const labelStyle = step >= 62 
    ? "block text-white text-xl md:text-2xl lg:text-3xl mb-4 text-balance [text-shadow:_3px_3px_6px_rgb(0_0_0_/_100%),_-2px_-2px_4px_rgb(0_0_0_/_90%),_2px_-2px_4px_rgb(0_0_0_/_90%),_-2px_2px_4px_rgb(0_0_0_/_90%),_0px_0px_8px_rgb(0_0_0_/_70%)]"
    : "block text-white text-xl md:text-2xl lg:text-3xl mb-4 text-balance";
    
  const inputStyle = step >= 62
    ? "w-full p-3 bg-black/20 border-2 border-white/70 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/70 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_100%),_-1px_-1px_2px_rgb(0_0_0_/_90%),_1px_-1px_2px_rgb(0_0_0_/_90%),_-1px_1px_2px_rgb(0_0_0_/_90%)]"
    : "w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50";
    
  const buttonStyle = step >= 62
    ? "px-8 py-3 bg-black/80 text-white font-semibold rounded-lg hover:bg-black/90 transition-colors [text-shadow:_2px_2px_4px_rgb(0_0_0_/_100%),_-1px_-1px_2px_rgb(0_0_0_/_90%),_1px_-1px_2px_rgb(0_0_0_/_90%),_-1px_1px_2px_rgb(0_0_0_/_90%)] border-2 border-white/70"
    : "px-8 py-3 bg-white/80 text-black font-semibold rounded-lg hover:bg-white transition-colors";
  
  return (
    <div className="w-full max-w-lg z-10">
      <form onSubmit={handleSubmit}>
        <label className={`text-center ${labelStyle}`}>{question}</label>
        <div className="w-full">
          <input
            type="text"
            value={value}
            onChange={(e) => setter(e.target.value)}
            className={inputStyle}
            placeholder={placeholder}
            required
          />
          <div className="w-full text-right mt-2">
            <button type="submit" className={buttonStyle}>
              ตกลง
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const QuestionWrapper = ({ question, children, step }) => {
  const questionStyle = step >= 62
    ? "text-white text-xl md:text-2xl lg:text-3xl mb-6 text-balance [text-shadow:_3px_3px_6px_rgb(0_0_0_/_100%),_-2px_-2px_4px_rgb(0_0_0_/_90%),_2px_-2px_4px_rgb(0_0_0_/_90%),_-2px_2px_4px_rgb(0_0_0_/_90%),_0px_0px_8px_rgb(0_0_0_/_70%)]"
    : "text-white text-xl md:text-2xl lg:text-3xl mb-6 text-balance";
    
  return (
    <div className="w-full max-w-2xl text-center z-10">
      {question && <h2 className={questionStyle}>{question}</h2>}
      <div className="flex flex-col items-center gap-4 w-full">
        {children}
      </div>
    </div>
  );
};

// --- Typewriter Effect Component ---
const TypewriterEffect = ({ text, step, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 200); // ความเร็วในการพิมพ์ 200ms ต่อตัวอักษร
      
      return () => clearTimeout(timer);
    } else if (onComplete && currentIndex === text.length) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);
  
  // ปรับ style ตาม step
  const baseTextStyle = "text-white font-light text-2xl md:text-3xl lg:text-4xl text-center text-balance leading-relaxed";
  const textStyle = step >= 62 
    ? `${baseTextStyle} [text-shadow:_4px_4px_8px_rgb(0_0_0_/_100%),_-3px_-3px_6px_rgb(0_0_0_/_90%),_3px_-3px_6px_rgb(0_0_0_/_90%),_-3px_3px_6px_rgb(0_0_0_/_90%),_0px_0px_10px_rgb(0_0_0_/_80%)]`
    : baseTextStyle;
  
  return <p className={textStyle}>{displayText}</p>;
};

function Story() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [stepHistory, setStepHistory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(carOnStreetBg);
  const [isMuted, setIsMuted] = useState(false);

  // --- Story State Variables ---
  const [userAnswerDay, setUserAnswerDay] = useState('');
  const [locationGuess, setLocationGuess] = useState('');
  const [feelingWhenTired, setFeelingWhenTired] = useState(''); // eslint-disable-line no-unused-vars
  const [reactionToStrangeLight, setReactionToStrangeLight] = useState(''); // eslint-disable-line no-unused-vars
  const [initialReactionToWhiteFigure, setInitialReactionToWhiteFigure] = useState(''); // eslint-disable-line no-unused-vars
  const [feelingWhenStressed, setFeelingWhenStressed] = useState('');
  const [howToManageStress, setHowToManageStress] = useState(''); // eslint-disable-line no-unused-vars
  const [energySource, setEnergySource] = useState(''); // eslint-disable-line no-unused-vars
  const [helpForWhiteFigure, setHelpForWhiteFigure] = useState(''); // eslint-disable-line no-unused-vars
  const [messageToPastSelf, setMessageToPastSelf] = useState('');
  const [creativeUseOfPower, setCreativeUseOfPower] = useState(''); // eslint-disable-line no-unused-vars
  const [childFeelingGuess, setChildFeelingGuess] = useState('');
  const [childDreamQuestion, setChildDreamQuestion] = useState('');
  const [messageToChildSelf, setMessageToChildSelf] = useState('');

  // --- Card Scoring System ---
  const [cardScores, setCardScores] = useState({
    pathfinder: 0,    // ผู้เผชิญหน้า - กล้าหาญ, เผชิญความจริง
    healer: 0,        // ผู้เยียวยา - ให้อภัย, เมตตา, เข้าใจความเจ็บปวด
    recharger: 0,     // ผู้ฟื้นพลัง - ฟังตัวเอง, รู้จักหยุดพัก
    creator: 0,       // ผู้สร้างแรงบันดาลใจ - มองไกล, พลังงานบวก
    adaptor: 0        // ผู้รับมือ - ปรับตัวเก่ง, ยืดหยุ่น, ยอมรับความจริง
  });

  const textContentRef = useRef(null);
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const audioRef = useRef(null);
  const windAudioRef = useRef(null);
  const bgMusicRef = useRef(null);
  const rainAudioRef = useRef(null);
  const lightningAudioRef = useRef(null);
  const warpAudioRef = useRef(null);
  const doorAudioRef = useRef(null);
  const alarmAudioRef = useRef(null);

  const TOTAL_STEPS = 169;
  const interactiveSteps = useMemo(() => [5, 8, 28, 65, 74, 79, 82, 84, 98, 103, 105, 119, 121, 126, 133, 137, 141, 144, 149], []);
  const storyJumps = useMemo(() => ({ 33: 49, 38: 49, 43: 49, 48: 49 }), []);

  // ฟังก์ชันเพิ่มคะแนนการ์ด
  const addCardScore = useCallback((cardType, points = 1) => {
    setCardScores(prev => ({
      ...prev,
      [cardType]: prev[cardType] + points
    }));
  }, []);

  // ฟังก์ชันคำนวณการ์ดที่ได้รับ
  const calculateFinalCard = useCallback(() => {
    const gender = userData?.gender || 'ไม่ระบุ';
    
    // หาการ์ดที่มีคะแนนสูงสุด
    const maxScore = Math.max(...Object.values(cardScores));
    const topCards = Object.entries(cardScores)
      .filter(([_, score]) => score === maxScore)
      .map(([cardType, _]) => cardType);
    
    // ถ้ามีหลายการ์ดที่คะแนนเท่ากัน ให้สุ่มเลือก
    const selectedCardType = topCards[Math.floor(Math.random() * topCards.length)];
    
    // แปลงชื่อการ์ดเป็นหมายเลข
    const cardTypeToNumber = {
      pathfinder: 1,
      healer: 2,
      recharger: 3,
      creator: 4,
      adaptor: 5
    };
    
    const cardNumber = cardTypeToNumber[selectedCardType];
    
    // แปลงชื่อการ์ดเป็นชื่อไทย
    const cardTypeToThai = {
      pathfinder: 'ผู้เผชิญหน้า',
      healer: 'ผู้เยียวยา',
      recharger: 'ผู้ฟื้นพลัง',
      creator: 'ผู้สร้างแรงบันดาลใจ',
      adaptor: 'ผู้รับมือ'
    };
    
    const cardTitle = cardTypeToThai[selectedCardType];
    
    // --- FIX: แปลง cardType ให้ถูกต้องตามเพศและชนิดการ์ด ---
    const genderToCardType = {
      'ชาย': `ผู้${selectedCardType === 'pathfinder' ? 'เผชิญหน้า' : 
                selectedCardType === 'healer' ? 'เยียวยา' :
                selectedCardType === 'recharger' ? 'ฟื้นพลัง' :
                selectedCardType === 'creator' ? 'สร้างแรงบันดาลใจ' :
                selectedCardType === 'creator' ? 'สร้างแรงบันดาลใจ' : 'รับมือ'}`,
      'หญิง': `ผู้${selectedCardType === 'pathfinder' ? 'เผชิญหน้า' : 
                 selectedCardType === 'healer' ? 'เยียวยา' :
                 selectedCardType === 'recharger' ? 'ฟื้นพลัง' :
                 selectedCardType === 'creator' ? 'สร้างแรงบันดาลใจ' : 'รับมือ'}`,
      'ไม่ระบุ': `ผู้${selectedCardType === 'pathfinder' ? 'เผชิญหน้า' : 
                   selectedCardType === 'healer' ? 'เยียวยา' :
                   selectedCardType === 'recharger' ? 'ฟื้นพลัง' :
                   selectedCardType === 'creator' ? 'สร้างแรงบันดาลใจ' : 'รับมือ'}`
    };
    
    // เลือกไฟล์ภาพการ์ดตามเพศ
    let cardImageUrl;
    if (gender === 'ชาย') {
      const maleCards = [MCard1, MCard2, MCard3, MCard4, MCard5];
      cardImageUrl = maleCards[cardNumber - 1];
    } else if (gender === 'หญิง') {
      const femaleCards = [FMCard1, FMCard2, FMCard3, FMCard4, FMCard5];
      cardImageUrl = femaleCards[cardNumber - 1];
    } else {
      const nonBinaryCards = [NCard1, NCard2, NCard3, NCard4, NCard5];
      cardImageUrl = nonBinaryCards[cardNumber - 1];
    }
    
    // --- FIX: แปลง imported image เป็น URL string ---
    let imageUrlString;
    if (cardImageUrl) {
      // สำหรับ React import, imported image จะเป็น string URL โดยตรง
      imageUrlString = cardImageUrl;
    } else {
      // fallback เป็น MCard5
      imageUrlString = MCard5;
    }
    
    console.log('Final Card Calculation:', {
      gender,
      selectedCardType,
      cardNumber,
      cardTitle,
      cardScores: JSON.stringify(cardScores),
      maxScore: Math.max(...Object.values(cardScores)),
      cardImageUrl,
      imageUrlString
    });
    
    return {
      cardType: genderToCardType[gender] || 'ผู้รับฟัง',
      cardTitle,
      cardImage: imageUrlString
    };
  }, [cardScores, userData]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('🔥 Starting data fetch for id:', id);
      
      // ลองอ่านจาก localStorage ก่อน
      let localUserData = null;
      let localPlayerName = null;
      
      try {
        const storedUserData = localStorage.getItem('userData');
        const storedPlayerName = localStorage.getItem('playerName');
        const storedFormData = localStorage.getItem('formData');
        const storedPresurvey = localStorage.getItem('presurveyData');
        
        console.log('📱 localStorage userData:', storedUserData);
        console.log('📱 localStorage playerName:', storedPlayerName);
        console.log('📱 localStorage formData:', storedFormData);
        console.log('📱 localStorage presurveyData:', storedPresurvey);
        
        if (storedUserData) {
          localUserData = JSON.parse(storedUserData);
          console.log('✅ Found userData in localStorage:', localUserData);
        }
        
        if (storedPlayerName) {
          localPlayerName = storedPlayerName;
          console.log('✅ Found playerName in localStorage:', localPlayerName);
        }
        
        // ถ้าไม่มีใน userData แต่มีใน formData ลองดึงจาก formData
        if (!localUserData && storedFormData) {
          const formData = JSON.parse(storedFormData);
          localUserData = {
            name: formData.name,
            age: formData.age,
            gender: formData.gender
          };
          console.log('✅ Using data from formData:', localUserData);
        }
        
      } catch (error) {
        console.error('❌ Error reading localStorage:', error);
      }
      
      // ถ้ามีข้อมูลใน localStorage ใช้เลย
      if (localUserData && localUserData.name) {
        console.log('🎯 Using localStorage data');
        setUserData(localUserData);
        return;
      }
      
      // ถ้าไม่มี ลองดึงจาก Firebase (เปลี่ยนจาก presurvey เป็น formdata)
      if (id) {
        console.log('🔥 No localStorage data, fetching from Firebase for id:', id);
        try {
          const docRef = doc(db, "formdata", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('🔥 Raw Firebase data:', data);
            console.log('🔥 Name in Firebase:', data.name);
            
            setUserData(data);
            
            // ตรวจสอบว่า data.name มีค่าหรือไม่
            if (data.name) {
              // บันทึกลง localStorage สำหรับใช้ในหน้าอื่น
              const userDataToSave = {
                name: data.name,
                age: data.age,
                gender: data.gender,
              };
              
              localStorage.setItem('userData', JSON.stringify(userDataToSave));
              localStorage.setItem('playerName', data.name);
              console.log('✅ User data saved to localStorage:', userDataToSave);
            } else {
              console.log('❌ No name found in Firebase data');
            }
          } else {
            console.log("❌ No such document in Firebase!");
          }
        } catch (error) {
          console.error("❌ Error fetching user data from Firebase:", error);
        }
      } else {
        console.log('❌ No id provided to fetch data');
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    let newBg = '';

    if (step >= 1 && step <= 8) {
      newBg = carOnStreetBg;
    } else if (step === 10) {
      newBg = opendoor1;
    } else if (step === 11) {
      newBg = opendoor2;
    } else if (step === 12) {
      newBg = darkroom1;
    } else if (step === 13) {
      newBg = rain1;
    } else if (step === 14) {
      newBg = rain3;
    } else if (step === 15) {
      newBg = rain2;
    } else if (step === 18) {
      newBg = room4;
    } else if (step >= 19 && step <= 20) {
      newBg = room3;
    } else if (step === 21) {
      newBg = room1;
    } else if (step >= 22 && step <= 23) {
      newBg = room2;
    } else if (step >= 24 && step <= 26) {
      newBg = light1;
    } else if (step >= 27 && step <= 48) {
      newBg = light2;
    } else if (step >= 49 && step <= 55) {
      newBg = light3;
    } else if (step >= 56 && step <= 61) {
      newBg = ''; // พื้นหลังสีขาวหลัง case 55
    } else if (step >= 62 && step <= 66) {
      newBg = nature1;
    } else if (step >= 67 && step <= 70) {
      newBg = nature3;
    } else if (step >= 71 && step <= 74) {
      newBg = nature5;
    } else if (step === 75) {
      newBg = whiteman1;
    } else if ([76, 77, 78, 79, 82, 83, 84, 85, 86, 87, 88, 89, 109, 110, 111].includes(step)) {
      newBg = whiteman1gif;
    } else if (step === 80) {
      newBg = whiteman4;
    } else if (step === 81) {
      newBg = whiteman1;
    } else if (step >= 90 && step <= 92) {
      newBg = whiteman5;
    } else if (step === 93) {
      newBg = whiteman3;
    } else if (step >= 94 && step <= 111) {
      newBg = nature3;
    } else if ([112, 114, 116, 118, 120, 122, 124, 126, 128].includes(step)) {
      newBg = whiteman6;
    } else if ([113, 115, 117, 119, 121, 123, 125, 127, 129, 130].includes(step)) {
      newBg = whiteman7;
    } else if (step >= 131 && step <= 139) {
      newBg = whiteman8;
    } else if (step >= 140 && step <= 147) {
      newBg = whiteman9;
    } else if (step >= 148 && step <= 149) {
      newBg = whiteman10;
    } else if (step >= 150 && step <= 151) {
      newBg = whiteman11;
    } else if (step === 152) {
      newBg = whiteman12;
    } else if (step >= 153 && step <= 154) {
      newBg = ''; // พื้นหลังสีขาว
    } else if (step >= 155 && step <= 167) {
      newBg = comehome;
    } else if (step >= 168) {
      newBg = result;
    } else {
      // ถ้าไม่ตรงเงื่อนไขไหน ใช้ภาพล่าสุดที่มี
      newBg = backgroundImage || '';
    }

    // จัดการเพลงพื้นหลัง bgmusic1 (case 1-17)
    if (step === 1) {
      if (bgMusicRef.current) {
        bgMusicRef.current.src = bgmusic1;
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = isMuted ? 0 : 0.3;
        bgMusicRef.current.play().catch(console.error);
      }
    } else if (step === 18) {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    }

    // จัดการเพลงพื้นหลัง bgmusic2 (case 83-152)
    if (step === 83) {
      if (bgMusicRef.current) {
        bgMusicRef.current.src = bgmusic2;
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = isMuted ? 0 : 0.3;
        bgMusicRef.current.play().catch(console.error);
      }
    } else if (step === 153) {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    }

    // จัดการเพลงพื้นหลัง bgmusic3 (case 155-169)
    if (step === 155) {
      if (bgMusicRef.current) {
        bgMusicRef.current.src = bgmusic3;
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = isMuted ? 0 : 0.3;
        bgMusicRef.current.play().catch(console.error);
      }
    } else if (step === 170) {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    }

    // จัดการเสียงประตูเปิด dooropen (case 10-11)
    if (step === 10) {
      if (doorAudioRef.current) {
        doorAudioRef.current.src = dooropen;
        doorAudioRef.current.volume = isMuted ? 0 : 0.4;
        doorAudioRef.current.play().catch(console.error);
      }
    }

    // จัดการเสียงฝน rainsound (case 15-16)
    if (step === 15) {
      if (rainAudioRef.current) {
        rainAudioRef.current.src = rainsound;
        rainAudioRef.current.loop = true;
        rainAudioRef.current.volume = isMuted ? 0 : 0.25;
        rainAudioRef.current.play().catch(console.error);
      }
    } else if (step === 17) {
      if (rainAudioRef.current) {
        rainAudioRef.current.pause();
        rainAudioRef.current.currentTime = 0;
      }
    }

    // จัดการเสียงฟ้าร้อง lightningsound (case 3, 13-14)
    if (step === 3) {
      if (lightningAudioRef.current) {
        lightningAudioRef.current.src = lightningsound;
        lightningAudioRef.current.volume = isMuted ? 0 : 0.4;
        lightningAudioRef.current.play().catch(console.error);
      }
    }

    // จัดการเสียง warpdoorsound (case 18-48 และ case 135-152)
    if (step === 18) {
      if (audioRef.current) {
        audioRef.current.src = warpdoorsound;
        audioRef.current.loop = true;
        audioRef.current.volume = isMuted ? 0 : 0.15;
        audioRef.current.play().catch(console.error);
      }
    } else if (step === 49) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else if (step === 135) {
      if (audioRef.current) {
        audioRef.current.src = warpdoorsound;
        audioRef.current.loop = true;
        audioRef.current.volume = isMuted ? 0 : 0.15;
        audioRef.current.play().catch(console.error);
      }
    } else if (step === 153) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    // จัดการเสียง warpsound (case 56 และ case 152) - ไม่วนลูป
    if (step === 56 || step === 152) {
      if (warpAudioRef.current) {
        warpAudioRef.current.src = warpsound;
        warpAudioRef.current.volume = isMuted ? 0 : 0.35;
        warpAudioRef.current.play().catch(console.error);
      }
    }

    // จัดการเสียง windsound
    if (step === 22) {
      if (windAudioRef.current) {
        windAudioRef.current.src = windsound;
        windAudioRef.current.loop = true;
        windAudioRef.current.volume = isMuted ? 0 : 0.2;
        windAudioRef.current.play().catch(console.error);
      }
    } else if (step === 56) {
      if (windAudioRef.current) {
        windAudioRef.current.pause();
        windAudioRef.current.currentTime = 0;
      }
    }

    // ถ้า newBg ไม่เหมือนกับภาพปัจจุบัน ให้ทำการเปลี่ยน
    if (newBg !== backgroundImage) {
      const isInstantChange = (step === 11 && stepHistory.length > 0 && stepHistory[stepHistory.length - 1] === 10) ||
                              (step === 14 && stepHistory.length > 0 && stepHistory[stepHistory.length - 1] === 13) ||
                              (step === 15 && stepHistory.length > 0 && stepHistory[stepHistory.length - 1] === 14) ||
                              (step >= 24 && step <= 48); // ไม่เฟดระหว่าง light1, light2, light3
      
      // สำหรับ case 62+ ให้เปลี่ยนแบบต่อเนื่องไม่มีการเฟด
      if (step >= 62) {
        setBackgroundImage(newBg);
        // ให้ opacity เป็น 1 เสมอ ไม่ให้มีการกระพริบ
        if (bgRef.current) {
          gsap.set(bgRef.current, { 
            opacity: 1, 
            filter: 'brightness(1)' 
          });
        }
      } else if (isInstantChange) {
        setBackgroundImage(newBg);
        // Force reset opacity และ filter สำหรับ case 60+
        if (step >= 60 && bgRef.current) {
          // ใช้ setTimeout เพื่อให้ทำหลังจาก setBackgroundImage
          setTimeout(() => {
            if (bgRef.current) {
              gsap.set(bgRef.current, { 
                opacity: newBg ? 1 : 0, 
                filter: 'brightness(1)' 
              });
            }
          }, 50);
        }
      } else {
        gsap.to(bgRef.current, {
          opacity: 0,
          duration: 0.8,
          onComplete: () => {
            setBackgroundImage(newBg);
            gsap.to(bgRef.current, {
              opacity: newBg !== '' ? 1 : 0,
              duration: 0.8
            });
          }
        });
      }
      
      // Debug log
      if (step >= 60 && step <= 70) {
        console.log(`Step ${step}: Changing from "${backgroundImage}" to "${newBg}"`);
      }
    }
  }, [step, backgroundImage, stepHistory, isMuted]);

  // จัดการเสียงเมื่อ mute status เปลี่ยน
  useEffect(() => {
    if (bgMusicRef.current && ((step >= 1 && step <= 17) || (step >= 83 && step <= 152) || (step >= 155 && step <= 169))) {
      bgMusicRef.current.volume = isMuted ? 0 : 0.3;
    }
    if (rainAudioRef.current && step >= 15 && step <= 16) {
      rainAudioRef.current.volume = isMuted ? 0 : 0.25;
    }
    if (lightningAudioRef.current) {
      lightningAudioRef.current.volume = isMuted ? 0 : 0.4;
    }
    if (warpAudioRef.current) {
      warpAudioRef.current.volume = isMuted ? 0 : 0.35;
    }
    if (audioRef.current && ((step >= 18 && step <= 48) || (step >= 135 && step <= 152))) {
      audioRef.current.volume = isMuted ? 0 : 0.15;
    }
    if (windAudioRef.current && step >= 22 && step <= 55) {
      windAudioRef.current.volume = isMuted ? 0 : 0.2;
    }
  }, [isMuted, step]);
  
  const advanceToNextStep = useCallback((nextStep) => {
    if (isTransitioning) return;
    
    // ตรวจสอบถ้าจบเรื่องแล้ว ให้ไปหน้า PostSurvey พร้อมข้อมูลการ์ด
    if (nextStep > TOTAL_STEPS) {
      console.log('Game finished! Calculating final card...');
      console.log('Current cardScores:', cardScores);
      
      const finalCard = calculateFinalCard();
      console.log('Final card result:', finalCard);
      
      // ส่งข้อมูลการ์ดไปยัง PostSurvey ผ่าน localStorage เพื่อให้ PostSurvey ส่งต่อไป ResultCard
      localStorage.setItem('userCardData', JSON.stringify({
        cardType: finalCard.cardType,
        cardTitle: finalCard.cardTitle,
        cardImage: finalCard.cardImage
      }));
      
      console.log('Saved to localStorage:', localStorage.getItem('userCardData'));
      navigate(`/postsurvey/${id}`);
      return;
    }
    
    setIsTransitioning(true);
    gsap.to(textContentRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        setStepHistory(prev => [...prev, step]);
        setStep(nextStep);
        gsap.set(textContentRef.current, { opacity: 0 });
        gsap.to(textContentRef.current, {
          opacity: 1,
          duration: 0.5,
          delay: 0.1,
          ease: "power2.inOut",
          onComplete: () => setIsTransitioning(false),
        });
      },
    });
  }, [isTransitioning, step, calculateFinalCard, navigate, id]);

  const goBack = () => {
    if (isTransitioning || stepHistory.length === 0) return;
    setIsTransitioning(true);
    const lastStep = stepHistory[stepHistory.length - 1];

    gsap.to(textContentRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
            setStepHistory(prev => prev.slice(0, -1));
            setStep(lastStep);
            gsap.set(textContentRef.current, { opacity: 0 });
            gsap.to(textContentRef.current, {
                opacity: 1,
                duration: 0.5,
                delay: 0.1,
                ease: "power2.inOut",
                onComplete: () => setIsTransitioning(false),
            });
        },
    });
  };

  const handleChoice = (setter, value, nextStep) => {
    if (setter) setter(value);
    
    // Case 28: การเผชิญหน้ากับแสงประหลาด

    // Case 28: การเผชิญหน้ากับแสงประหลาด
    if (step === 28) {
      if (value === 'พยายามทำความเข้าใจ') {
        addCardScore('pathfinder', 2); // กล้าหาญ, เผชิญความจริง
        console.log('Step 28: Added 2 points to pathfinder');
      } else if (value === 'ยอมจำนน') {
        addCardScore('adaptor', 2); // ยอมรับความจริง
        console.log('Step 28: Added 2 points to adaptor');
      } else if (value === 'สัมผัส') {
        addCardScore('pathfinder', 1);
        addCardScore('creator', 1); // ลองของใหม่
        console.log('Step 28: Added 1 point to pathfinder and creator');
      } else if (value === 'หลบหนี') {
        addCardScore('recharger', 1); // รู้จักพักหลบภัย
        console.log('Step 28: Added 1 point to recharger');
      }
    }

    // Case 74: การตอบสนองต่อร่างสีขาว
    if (step === 74) {
      if (value.includes('สงสัย แต่ยังเว้นระยะห่าง')) {
        addCardScore('pathfinder', 2); // ระมัดระวังแต่กล้าหาญ
      } else if (value.includes('ลองสัมผัส')) {
        addCardScore('healer', 2); // เข้าใจและช่วยเหลือ
      } else if (value.includes('ถอยห่าง')) {
        addCardScore('recharger', 2); // รู้จักป้องกันตัวเอง
      } else if (value.includes('ไถ่ถาม')) {
        addCardScore('adaptor', 2); // พยายามเข้าใจสถานการณ์
      }
    }

    // Case 79: ความรู้สึกเมื่อเครียด
    if (step === 79) {
      if (value.includes('โศกเศร้า สิ้นหวัง')) {
        addCardScore('healer', 2); // เข้าใจความเจ็บปวด
      } else if (value.includes('ผิดหวังในตัวเอง')) {
        addCardScore('healer', 1);
        addCardScore('recharger', 1);
      } else if (value.includes('โกรธที่ควบคุมไม่ได้')) {
        addCardScore('pathfinder', 2); // แสดงความรู้สึกตรงไปตรงมา
      } else if (value.includes('อ่อนแอ ว่างเปล่า')) {
        addCardScore('healer', 2);
        addCardScore('recharger', 1); // ⭐ เพิ่ม: ความรู้สึกว่างเปล่าต้องพักและเติมพลัง
      } else if (value.includes('งงงวย สับสน')) {
        addCardScore('adaptor', 2); // ยอมรับความไม่แน่นอน
      }
    }

    // Case 103: วิธีจัดการเรื่องไม่ดี
    if (step === 103) {
      if (value.includes('หยุดพักจากทุกสิ่ง')) {
        addCardScore('recharger', 3); // รู้จักหยุดพัก
        addCardScore('adaptor', 1); // ⭐ เพิ่ม: การรู้ว่าเมื่อไหร่ควรหยุดคือทักษะการปรับตัว
      } else if (value.includes('หาทางระบาย')) {
        addCardScore('creator', 2); // สร้างสรรค์วิธีระบาย
        addCardScore('healer', 1);
      } else if (value.includes('เผชิญหน้ากับความรู้สึก')) {
        addCardScore('pathfinder', 3); // กล้าเผชิญความจริง
      } else if (value.includes('เรียนรู้ที่จะปฏิเสธ')) {
        addCardScore('recharger', 2);
        addCardScore('adaptor', 1);
      }
    }

    // Case 105: แหล่งพลังงาน
    if (step === 105) {
      if (value.includes('ธรรมชาติ สัมผัสแสงแดด')) {
        addCardScore('recharger', 3); // ฟื้นฟูจากธรรมชาติ
      } else if (value.includes('ทำสิ่งที่รัก')) {
        addCardScore('creator', 3); // สร้างสรรค์จากความรัก
        addCardScore('pathfinder', 1); // ⭐ เพิ่ม: การมีเป้าหมายที่รักต้องการพลังใจที่แน่วแน่
      } else if (value.includes('ระบายหรือพูดคุย')) {
        addCardScore('healer', 3); // เยียวยาผ่านการสื่อสาร
      } else if (value.includes('อยู่เงียบๆ คนเดียว')) {
        addCardScore('recharger', 2);
        addCardScore('adaptor', 1);
      }
    }

    // Case 121: ความช่วยเหลือที่ต้องการ
    if (step === 121) {
      if (value.includes('โอบกอดอย่างอ่อนโยน')) {
        addCardScore('healer', 3); // ความเมตตา
      } else if (value.includes('ยืนยันว่าเรายังมีคุณค่า')) {
        addCardScore('healer', 2);
        addCardScore('pathfinder', 1);
      } else if (value.includes('คำแนะนำที่ชัดเจน')) {
        addCardScore('adaptor', 2);
        addCardScore('creator', 1);
      } else if (value.includes('โอกาสในการให้อภัย')) {
        addCardScore('healer', 3);
      }
    }

    // Case 126: ข้อความส่งให้ตัวตนที่บอบบาง
    if (step === 126) {
      if (value.includes('ให้อภัยคุณแล้ว')) {
        addCardScore('healer', 3);
      } else if (value.includes('คุณมีค่าเสมอ')) {
        addCardScore('healer', 2);
        addCardScore('creator', 1);
      } else if (value.includes('เข้มแข็งมาก')) {
        addCardScore('pathfinder', 2);
        addCardScore('creator', 1);
      } else if (value.includes('เราเข้าใจทุกความเจ็บปวด')) {
        addCardScore('healer', 3);
      }
    }

    // Case 137: การใช้พลังสร้างสรรค์
    if (step === 137) {
      if (value.includes('แรงบันดาลใจให้ผู้อื่น')) {
        addCardScore('creator', 3); // สร้างแรงบันดาลใจ
      } else if (value.includes('สร้างสรรค์ผลงานใหม่')) {
        addCardScore('creator', 3);
      } else if (value.includes('ดูแลความสัมพันธ์')) {
        addCardScore('healer', 2);
        addCardScore('adaptor', 1);
        addCardScore('recharger', 1); // ⭐ เพิ่ม: ความสัมพันธ์ดีต้องมีพลังในตัวก่อน
      } else if (value.includes('เป้าหมายที่แท้จริง')) {
        addCardScore('pathfinder', 2);
        addCardScore('creator', 1);
      }
    }
    
    // --- Debug: แสดงคะแนนปัจจุบันหลังตอบคำถาม ---
    if ([28, 74, 79, 82, 84, 98, 103, 105, 119, 121, 126, 133, 137, 141, 144, 149].includes(step)) {
      setTimeout(() => {
        console.log(`Current card scores after step ${step}:`, cardScores);
      }, 100);
    }
    
    advanceToNextStep(nextStep);
  };

  const handleTextInputSubmit = (nextStep) => {
    advanceToNextStep(nextStep);
  };

  // ฟังก์ชันสำหรับปุ่มปิด/เปิดเสียง
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // ฟังก์ชันสำหรับปุ่มออกไปหน้า Caution
  const exitToHome = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    navigate('/');
  };

  // Flash effect for step 58
  useEffect(() => {
    if (step === 58) {
        const timer = setTimeout(() => {
            advanceToNextStep(59);
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [step, advanceToNextStep]);

  // Lightning effect when transitioning from step 13 to 14
  useEffect(() => {
    const handleStoryClick = (e) => {
      if (interactiveSteps.includes(step) || e.target.closest('form, button') || isTransitioning) {
        return;
      }
      
      // พิเศษสำหรับ case 13 -> 14: เอฟเฟคแสงกระพริบก่อนเปลี่ยนฉาก
      if (step === 13) {
        if (lightningAudioRef.current) {
          lightningAudioRef.current.src = lightningsound;
          lightningAudioRef.current.volume = isMuted ? 0 : 0.4;
          lightningAudioRef.current.play().catch(console.error);
        }
        
        gsap.to(bgRef.current, {
          filter: 'brightness(6)',
          duration: 0.08,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            setTimeout(() => {
              gsap.to(bgRef.current, {
                filter: 'brightness(8)',
                duration: 0.12,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                  gsap.to(bgRef.current, {
                    filter: 'brightness(15)',
                    duration: 0.3,
                    ease: "power2.out",
                    onComplete: () => {
                      gsap.to(bgRef.current, {
                        filter: 'brightness(0)',
                        duration: 0.4,
                        ease: "power2.in",
                        onComplete: () => {
                          advanceToNextStep(14);
                          setTimeout(() => {
                            gsap.set(bgRef.current, { filter: 'brightness(1)' });
                          }, 100);
                        }
                      });
                    }
                  });
                }
              });
            }, 150);
          }
        });
        return;
      }

      // พิเศษสำหรับ case 14: เฟดสว่างแล้วดำไปหน้า 15
      if (step === 14) {
        gsap.to(bgRef.current, {
          filter: 'brightness(10)',
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(bgRef.current, {
              filter: 'brightness(0)',
              duration: 0.5,
              ease: "power2.in",
              onComplete: () => {
                advanceToNextStep(15);
                setTimeout(() => {
                  gsap.set(bgRef.current, { filter: 'brightness(1)' });
                }, 100);
              }
            });
          }
        });
        return;
      }

      // พิเศษสำหรับ case 15: เฟดดำไปหน้าต่อไป
      if (step === 15) {
        gsap.to(bgRef.current, {
          filter: 'brightness(0)',
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            const nextStep = storyJumps[step] || step + 1;
            if (nextStep > TOTAL_STEPS) {
              // เมื่อจบเรื่องแล้วให้ใช้ advanceToNextStep เพื่อคำนวณการ์ดและไปหน้า PostSurvey
              advanceToNextStep(nextStep);
            } else {
              advanceToNextStep(nextStep);
              setTimeout(() => {
                gsap.to(bgRef.current, {
                  filter: 'brightness(1)',
                  duration: 0.8,
                  ease: "power2.out"
                });
              }, 300);
            }
          }
        });
        return;
      }
      
      // สำหรับ case อื่นๆ ทำงานตามปกติ
      const nextStep = storyJumps[step] || step + 1;
      if (nextStep > TOTAL_STEPS) {
        // เมื่อจบเรื่องแล้วให้ใช้ advanceToNextStep เพื่อคำนวณการ์ดและไปหน้า PostSurvey
        advanceToNextStep(nextStep);
      } else {
        advanceToNextStep(nextStep);
      }
    };
    
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('click', handleStoryClick);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('click', handleStoryClick);
      }
    };
  }, [step, navigate, id, advanceToNextStep, isTransitioning, interactiveSteps, storyJumps, isMuted, calculateFinalCard]);

  // เอฟเฟคกระพริบรัวๆ สำหรับ step 14
  useEffect(() => {
    if (step === 14) {
      const flickerEffect = () => {
        gsap.to(bgRef.current, {
          filter: 'brightness(2.5)',
          duration: 0.06,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 5,
        });
      };
      
      const timer = setTimeout(flickerEffect, 500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // เอฟเฟคสั่นไหวสำหรับ step 49-55
  useEffect(() => {
    if (step >= 49 && step <= 55) {
      const container = containerRef.current;
      const shakeAnimation = gsap.to(container, {
        x: () => Math.random() * 4 - 2,
        y: () => Math.random() * 4 - 2,
        duration: 0.1,
        repeat: -1,
        ease: "none"
      });

      return () => {
        shakeAnimation.kill();
        gsap.set(container, { x: 0, y: 0 });
      };
    }
  }, [step]);

  // เอฟเฟคแสงกระพริบเมื่อคลิกจาก case 23 ไป 24
  useEffect(() => {
    const handleBrightFlash = (e) => {
      if (step !== 23 || interactiveSteps.includes(step) || e.target.closest('form, button') || isTransitioning) {
        return;
      }
      
      // เอฟเฟคแฟลชสว่างเมื่อเปลี่ยนจาก case 23 ไป 24
      gsap.to(bgRef.current, {
        filter: 'brightness(8)',
        duration: 0.15,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.to(bgRef.current, {
            filter: 'brightness(12)',
            duration: 0.2,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              // เปลี่ยนไปหน้า 24 พร้อมแฟลชขาว
              gsap.to(bgRef.current, {
                filter: 'brightness(20)',
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                  advanceToNextStep(24);
                  setTimeout(() => {
                    gsap.set(bgRef.current, { filter: 'brightness(1)' });
                  }, 100);
                }
              });
            }
          });
        }
      });
    };
    
    const currentContainer = containerRef.current;
    if (currentContainer && step === 23) {
      currentContainer.addEventListener('click', handleBrightFlash);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('click', handleBrightFlash);
      }
    };
  }, [step, advanceToNextStep, isTransitioning, interactiveSteps]);

  // เอฟเฟคแสงส่องเต็มหน้าจอสำหรับ step 55
  useEffect(() => {
    if (step === 55) {
      const timer = setTimeout(() => {
        // แสงส่องเต็มหน้าจอ
        gsap.to(bgRef.current, {
          filter: 'brightness(20)',
          duration: 1.5,
          ease: "power2.out",
          onComplete: () => {
            // เปลี่ยนไปหน้าถัดไป
            advanceToNextStep(56);
            // รีเซ็ตความสว่างและหยุดสั่นไหว
            setTimeout(() => {
              gsap.set(bgRef.current, { filter: 'brightness(1)' });
              gsap.set(containerRef.current, { x: 0, y: 0 });
            }, 100);
          }
        });
      }, 2000); // รอ 2 วินาทีก่อนเริ่มแสงส่อง

      return () => clearTimeout(timer);
    }
  }, [step, advanceToNextStep]);

  // Force opacity สำหรับ case 60+ ที่มีปัญหา
  useEffect(() => {
    if (step >= 60 && bgRef.current && backgroundImage) {
      // Force set opacity เป็น 1 สำหรับ case ที่มีภาพ
      const timer = setTimeout(() => {
        if (bgRef.current) {
          gsap.set(bgRef.current, { 
            opacity: 1, 
            filter: 'brightness(1)' 
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [step, backgroundImage]);

  const { name = '', age = '' } = userData || {};
  
  // ปรับ text style ให้มี stroke เข้มขึ้นสำหรับ case 62+ เพื่อให้เห็นชัดบนพื้นหลังสว่าง
  const textBaseStyle = step >= 62 
    ? "text-white font-light text-2xl md:text-3xl lg:text-4xl text-center text-balance leading-relaxed [text-shadow:_4px_4px_8px_rgb(0_0_0_/_100%),_-3px_-3px_6px_rgb(0_0_0_/_90%),_3px_-3px_6px_rgb(0_0_0_/_90%),_-3px_3px_6px_rgb(0_0_0_/_90%),_0px_0px_10px_rgb(0_0_0_/_80%)]"
    : "text-white font-light text-2xl md:text-3xl lg:text-4xl text-center text-balance leading-relaxed";
    
  const choiceButtonStyle = step >= 62
    ? "w-full max-w-md p-3 bg-black/40 border-2 border-white/80 rounded-lg text-white text-center text-base md:text-lg hover:bg-black/50 transition-colors duration-300 backdrop-blur-sm [text-shadow:_3px_3px_6px_rgb(0_0_0_/_100%),_-2px_-2px_4px_rgb(0_0_0_/_90%),_2px_-2px_4px_rgb(0_0_0_/_90%),_-2px_2px_4px_rgb(0_0_0_/_90%),_0px_0px_8px_rgb(0_0_0_/_80%)]"
    : "w-full max-w-md p-3 bg-black/20 border-2 border-white/50 rounded-lg text-white text-center text-base md:text-lg hover:bg-white/30 transition-colors duration-300 backdrop-blur-sm";
  
  const renderContent = () => {
    switch (step) {
      // --- บทนำ: คืนที่เหนื่อยล้า ---
      case 1: return <p className={textBaseStyle}>ในเวลาพลบค่ำของคืนวันหนึ่ง</p>;
      case 2: return <p className={textBaseStyle}>บนถนนที่วุ่นวายรถติดยาวเหยียด คุณกำลังเดินทางกลับบ้าน</p>;
      case 3: return <p className={textBaseStyle}>ท้องฟ้ามืดสนิท เมฆเทากำลังก่อตัว ดูเหมือนพายุฝนกำลังมา</p>;
      case 4: return <p className={`${textBaseStyle} italic`}>"อะไรนักหนานะ ชีวิต"</p>;
      case 5: return <InputWrapper question="วันนี้คุณเพิ่งจะ..." value={userAnswerDay} setter={setUserAnswerDay} handleTextInputSubmit={handleTextInputSubmit} nextStep={6} placeholder="...เจออะไรมา" step={step} />;
      case 6: return <p className={textBaseStyle}>คุณถอนหายใจดังเฮือก</p>;
      case 7: return <p className={textBaseStyle}>ความเหน็ดเหนื่อยที่คุณมีในวันนี้ มันยากที่จะบรรยาย</p>;
      case 8: {
        const feelings = ["เฉยๆ", "หมดแรง", "ไร้พลัง", "ท้อแท้", "สิ้นหวัง", "อ้างว้าง", "โดดเดี่ยว", "สับสน", "ลังเล", "ไม่มั่นใจ", "โกรธ", "หงุดหงิด", "กดดัน", "แบกรับ"];
        return (<QuestionWrapper question="คำใดบ้างที่ดูใกล้เคียงกับคุณตอนที่กำลังเหนื่อย?" step={step}><div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">{feelings.map(feeling => (<button key={feeling} className={choiceButtonStyle} onClick={() => handleChoice(setFeelingWhenTired, feeling, 10)}>{feeling}</button>))}</div></QuestionWrapper>);
      }
      // case 9 is skipped
      case 10: return <p className={textBaseStyle}>คุณกลับมาถึงบ้าน</p>;
      case 11: return <p className={textBaseStyle}>คุณรีบเดินเข้าห้องนอน ทิ้งตัวลงบนเตียงอย่างไร้เรี่ยวแรง</p>;
      case 12: return <p className={textBaseStyle}>ใต้แสงไฟสลัว อากาศเย็น มีเพียงเสียงฝนที่โปรยลงมา อยู่นอกหน้าต่าง</p>;
      case 13: return age ? <p className={`${textBaseStyle} italic`}>ตลอด {age} ปีมานี้... เราทำอะไรอยู่กันแน่นะ ?</p> : <p className={`${textBaseStyle} italic`}>เราทำอะไรอยู่กันแน่นะ ?</p>;
      case 14: return <p className={textBaseStyle}>คำถามมากมายในชีวิต กำลังถาโถมเข้ามาในหัวของคุณ</p>;
      case 15: return <p className={textBaseStyle}>คุณคิดวนเวียนอยู่สักพัก และหลับตาลง</p>;
      case 16: return <p className={textBaseStyle}>ร่างกายของคุณกำลังผ่อนคลาย ราวกับคุณจมลงไปเรื่อย ๆ</p>;
      case 17: return <p className={textBaseStyle}>คุณหลับไป..</p>;

      // --- บทที่ 1: การปรากฏตัว ---
      case 18: return <p className={textBaseStyle}>คุณลุกขึ้นจากเตียง ด้วยความงัวเงียกับสถานการณ์อะไร ที่ไม่ชอบมาพากล</p>;
      case 19: return <p className={textBaseStyle}>คุณค่อย ๆ เบิกตาให้กว้าง</p>;
      case 20: return <p className={`${textBaseStyle} italic`}>“นั่นมันเสียงอะไรกันน่ะ?”</p>;
      case 21: return <p className={textBaseStyle}>พึมพำด้วยความงงและเหนื่อยล้า</p>;
      case 22: return <p className={textBaseStyle}>เสียงหวีดวิ้วดังพายุหมุนกำลังโหม</p>;
      case 23: return <p className={textBaseStyle}>พร้อมปฏิทินในห้องที่สั่นพรึ่บพรั่บไหวไปตามเสียง</p>;
      case 24: return <p className={textBaseStyle}>แสงสีขาวค่อย ๆ ปรากฏตรงหน้าคุณ</p>;
      case 25: return <p className={`${textBaseStyle} italic`}>(รูปทรงและขนาดมันประมาณก้อนลูกบอลได้มั้ง) คุณคิดในใจ</p>;
      case 26: return <p className={textBaseStyle}>แสงนั้นสว่างจ้ามาก ราวกับจ้องดวงอาทิตย์ตรงหน้า มันสว่างจนคุณต้องหยีตามอง พลางตื่นตระหนกและไม่เข้าใจในสถานการณ์</p>;
      case 27: return <p className={textBaseStyle}>แสงนั้นเริ่มขยายขนาดเพิ่มขึ้นจนเท่าตัวคุณ แถมด้วยแรงบางอย่างที่สั่นไหวเบา ๆ ที่คุณพอจะจับได้</p>;
      case 28: {
        return (<QuestionWrapper question="เจออะไรแปลก ๆ ขนาดนี้แล้ว คุณว่าจะทำอะไรต่อ ในสถานการณ์นี้ ?" step={step}>
            <button className={choiceButtonStyle} onClick={() => handleChoice(setReactionToStrangeLight, 'พยายามทำความเข้าใจ', 29)}>พยายามทำความเข้าใจ หาคำตอบว่าเกิดอะไรขึ้น</button>
            <button className={choiceButtonStyle} onClick={() => handleChoice(setReactionToStrangeLight, 'ยอมจำนน', 34)}>คงทำอะไรไม่ได้แล้ว อะไรจะเกิดก็เกิดเถอะ</button>
            <button className={choiceButtonStyle} onClick={() => handleChoice(setReactionToStrangeLight, 'สัมผัส', 39)}>แปลก ๆ นะ แต่ลองเอามือไปจับแสงสีขาวนั้นดู คงไม่เป็นไรหรอกมั้ง</button>
            <button className={choiceButtonStyle} onClick={() => handleChoice(setReactionToStrangeLight, 'หลบหนี', 44)}>เจอแสงและเสียงประหลาดในห้องขนาดนี้ หนีสิรออะไรอยู่ล่ะ</button>
        </QuestionWrapper>);
      }
      // --- เส้นทางที่ 1: สังเกตการณ์ ---
      case 29: return <p className={textBaseStyle}>คุณยืนคิดที่มุมห้องซักครู่</p>;
      case 30: return <p className={textBaseStyle}>ในขณะที่แสงนั้นก็อยู่เฉย ๆ กับที่</p>;
      case 31: return <p className={textBaseStyle}>คุณหาข้อสรุปได้ลำบากมากกว่าแสงนี้คืออะไร</p>;
      case 32: return <p className={textBaseStyle}>เอเลี่ยนหรอ หรือโดรนของใครบินเข้ามาในห้องคุณ</p>;
      case 33: return <p className={textBaseStyle}>นึกไม่ออกจริง ๆ แต่จะให้ไปจับหรือสัมผัสก็อันตราย, อยู่ตรงนี้คอยมองดู ว่ามันจะทำอะไรดีกว่า</p>; // Jumps to 49
      // --- เส้นทางที่ 2: ยอมจำนน ---
      case 34: return <p className={textBaseStyle}>คุณนั่งลงคุกเข่า</p>;
      case 35: return <p className={textBaseStyle}>คุณหมดอาลัยในชีวิตที่เหน็ดเหนื่อยของคุณ</p>;
      case 36: return <p className={textBaseStyle}>นี่อาจเป็นสัญญาณวันสิ้นโลกอะไรทำนองนั้น</p>;
      case 37: return <p className={textBaseStyle}>หรือถ้าไม่ใช่ คุณก็ภาวนาว่ามันคือทางที่คุณจะได้สงบสงบจากโลกอันวุ่นวายนี้</p>;
      case 38: return <p className={textBaseStyle}>ถึงอย่างนั้นแสงนั่นก็ไม่ได้ทำอะไรคุณเลย</p>; // Jumps to 49
      // --- เส้นทางที่ 3: สัมผัส ---
      case 39: return <p className={textBaseStyle}>คุณคิดว่ามันอาจเป็นวัตถุบางอย่างจับต้องได้</p>;
      case 40: return <p className={textBaseStyle}>จึงลองเอื้อมมือไปจับมัน</p>;
      case 41: return <p className={textBaseStyle}>เอื้อมไปใกล้ ๆ ในแสงนั้นที่เหมือนเป็นก้อน</p>;
      case 42: return <p className={textBaseStyle}>แสงนั้นลักษณะคล้าย ๆ ก้อนวงกลมขนาดเท่าคุณ</p>;
      case 43: return <p className={textBaseStyle}>คุณได้สัมผัสบางอย่าง แต่ก็บอกไม่ถูกว่ามันคืออะไร, แต่…มันก็แอบมีแรงดึงอะไรบางอย่าง</p>; // Jumps to 49
      // --- เส้นทางที่ 4: หลบหนี ---
      case 44: return <p className={textBaseStyle}>คุณเริ่มตื่นตระหนก</p>;
      case 45: return <p className={textBaseStyle}>ที่นี่ดูไม่ปลอดภัยเท่าไร มีบางอย่างผิดปกติ</p>;
      case 46: return <p className={textBaseStyle}>คุณจึงเริ่มค่อย ๆ ขยับตัวไปใกล้ ๆ ประตู</p>;
      case 47: return <p className={textBaseStyle}>กะจะออกไปเพื่อแจ้งเพื่อนบ้านหรือใครก็ตามที่เจอตอนนั้น</p>;
      case 48: return <p className={textBaseStyle}>ยังไงก็ต้องรีบหาทางออกจากที่นี้ก่อน, ต้องรีบหาใครสักคน</p>; // Jumps to 49
      // --- จุดรวมเรื่องราว ---
      case 49: return <p className={textBaseStyle}>ในตอนนั้นเอง…</p>;
      case 50: return <p className={textBaseStyle}>แสงนั้นเกิดแรงดึงดูดอันมหาศาล</p>;
      case 51: return <p className={textBaseStyle}>แรงนั้นสั่นสะท้านไปทั้งห้องของคุณ</p>;
      case 52: return <p className={textBaseStyle}>เปรียบดังกับหลุมดำขนาดย่อม ๆ</p>;
      case 53: return <p className={textBaseStyle}>ตัวคุณในตอนนั้นไม่ทันได้ป้องกัน หรือเตรียมจับอะไรยึดไว้</p>;
      case 54: return <p className={textBaseStyle}>คุณตกใจสุดขีด ไม่รู้จะทำอะไร</p>;
      case 55: return <p className={textBaseStyle}>และก่อนที่ตัดสินใจอะไรได้ แสงนั้นก็ดูดคุณหายไปในเสี้ยววิ</p>;
      case 56: return <p className={textBaseStyle}>ประดังมันจ้องคุณเป็นเป้าหมาย</p>;
      case 57: return <p className={textBaseStyle}>….</p>;
      case 58: return <div className="fixed inset-0 bg-white z-50"></div>; // Flash Effect
      case 59: return <p className={textBaseStyle}>ห้องได้กลับมาสงบอีกครั้ง</p>;

      // --- บทที่ 2: โลกที่ไม่คุ้นเคย ---
      case 60: return <p className={textBaseStyle}>คุณเริ่มได้สติกลับคืน</p>;
      case 61: return <p className={textBaseStyle}>พลันลืมตาขึ้นและมองไปรอบ ๆ</p>;
      case 62: return <p className={textBaseStyle}>แสงนั้นมันหายไปแล้ว</p>;
      case 63: return <p className={textBaseStyle}>แต่ตอนนี้… คุณอยู่ในสถานที่บางอย่างที่คุณคุ้นเคยมาก</p>;
      case 64: return <p className={textBaseStyle}>แต่จากการตื่นตระหนกมาซักพัก คุณเลยยังนึกไม่ออกว่าที่นี้ คือที่ไหน ?</p>;
      case 65: return <InputWrapper question="คุณคิดว่าที่คุณอยู่ที่นี้คือที่ไหน" value={locationGuess} setter={setLocationGuess} handleTextInputSubmit={handleTextInputSubmit} nextStep={66} step={step} />;
      case 66: return <p className={textBaseStyle}>คุณสรุปได้ว่ากำลังอยู่ที่ {locationGuess || 'ที่แห่งนั้น'}</p>;
      case 67: return <p className={textBaseStyle}>บรรยากาศที่นี้ช่างแตกต่างและแปลกประหลาด, อากาศก็เช่นกัน จะร้อนก็ไม่ใช่แต่จะหนาวก็ไม่เชิง</p>;
      case 68: return <p className={textBaseStyle}>ที่นี้แน่ใจคือ มันไม่รู้สึกสบายเลย</p>;
      case 69: return <p className={textBaseStyle}>ทั้งหมอกสีจางไปมาดังหนังสยองขวัญ, ท้องฟ้าไม่ถึงกับมืด แต่ก็หม่นหมองมาก</p>;
      case 70: return <p className={textBaseStyle}>พื้นดินที่หมอกคลุมและเส้นทางที่เต็มไปเศษบางสิ่ง, แสงจากท้องฟ้าที่สลัวและไร้เงา ทั้งที่อยู่กลางแจ้ง, ไม่ได้สัมผัสถึงความอบอุ่นใด ๆ</p>;
      case 71: return <p className={textBaseStyle}>แต่ในขณะนั้น คุณเห็นใครสักคนนึงที่อยู่ที่ไม่ไกลมาก จากที่คุณมองเห็น</p>;
      case 72: return <p className={textBaseStyle}>คุณได้เข้าหาเขา ด้วยความคิดจะถามทางกลับบ้าน แต่ก็แอบกังวล</p>;
      case 73: return <p className={textBaseStyle}>ร่างนั้นคือร่างที่ส่องแสงสว่างที่คุณไม่ทราบว่าเขาคือใคร</p>;
      case 74: {
        const choices = ["เข้าไปหาอีกฝ่ายด้วยความสงสัย แต่ยังเว้นระยะห่าง", "ลองสัมผัสที่ตัวเขาว่าเขามีลักษณะ เป็นอย่างไร (เขาอาจอยากให้ช่วยเหลือ)", "พยายามถอยห่างเผื่อเตรียมหนี", "ไถ่ถามให้อีกฝ่ายตอบถึงสถานการณ์ตอนนี้ และให้อีกฝ่ายอธิบายทั้งหมด"];
        return (<QuestionWrapper question="ตอนนี้คุณอยู่ใกล้เขาแล้ว คุณจะทำอะไรเมื่อเห็นว่าเขาเป็นร่างแสงสว่างขาว ๆ แต่ดูไม่ออกว่าเป็นคนหรือเปล่า" step={step}>{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setInitialReactionToWhiteFigure, choice, 75)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 75: return <p className={`${textBaseStyle} italic`}>“ไง..” เขาทักคุณสั้น ๆ เมื่อเห็นคุณ</p>;
      case 76: return <p className={`${textBaseStyle} italic`}>“ใจเย็นก่อนนะ”</p>;
      case 77: return <p className={`${textBaseStyle} italic`}>“ที่นี้กำลังพังทลายลง คุณคงไม่ใช่คนที่นี้ เพราะทุกคน..ไปหมดแล้ว”</p>;
      case 78: return <p className={`${textBaseStyle} italic`}>“ที่แห่งนี้.. กำลังล่มสลายน่ะ มันเริ่มพังทีละนิด ทีละนิด จนเป็นแบบนี้”</p>;
      case 79: {
        const choices = ["โศกเศร้า สิ้นหวัง หมดหนทาง", "ผิดหวังในตัวเอง", "โกรธที่ควบคุมมันไม่ได้", "อ่อนแอ ว่างเปล่า", "งงงวย สับสนที่ไม่อาจเข้าใจ"];
        return (<QuestionWrapper question="อ่อ แต่ขอถามอะไรหน่อยสิ คุณดูเป็นคนที่ผ่านอะไรมาเยอะดี เรา..แค่อยากรู้น่ะ ว่า ตอนที่คุณรู้สึกเครียดมาก กับ บางสิ่งหรือปัญหา ที่แก้ไม่ได้หรือไม่ตกซักที คุณรู้สึกยังไงหรอ" step={step}><div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setFeelingWhenStressed, choice, 80)}>{choice}</button>))}</div></QuestionWrapper>);
      }
      case 80: return <p className={`${textBaseStyle} italic`}>“งั้นเองสินะ เราก็เหมือนกันเลย เราก็รู้สึก {feelingWhenStressed || 'แบบนั้น'} เหมือนกัน”</p>;
      case 81: return <p className={`${textBaseStyle} italic`}>“นี่ คุณพอจะช่วยเราได้มั้ย …ช่วยฟื้นฟูที่แห่งนี้ได้หรือเปล่า” ร่างนั้นค่อย ๆ ถามด้วยเสียงแผ่วเบา</p>;
      case 82: return <QuestionWrapper question="" step={step}><button className={choiceButtonStyle} onClick={() => handleChoice(null, null, 83)}>จะให้เราช่วยคุณอย่างไร เราเป็นแค่คนธรรมดา</button></QuestionWrapper>;
      case 83: return <p className={`${textBaseStyle} italic`}>“เป็นคนธรรมดาก็ไม่ได้แปลว่าจะทำอะไรไม่ได้นี่หน่า”</p>;
      case 84: return <QuestionWrapper question="" step={step}><button className={choiceButtonStyle} onClick={() => handleChoice(null, null, 85)}>ที่จักรวาลเรา เราก็แค่คนธรรมดาที่ไม่ได้พิเศษอะไร</button></QuestionWrapper>;
      case 85: return <p className={`${textBaseStyle} italic`}>“แล้วจำเป็นต้องเป็นคนพิเศษด้วยหรอ” ร่างนั้นตอบกลับคุณทันที</p>;
      case 86: return <p className={textBaseStyle}>”ก็ไม่หรอก แต่ถ้าเป็นคนที่พิเศษก็คงจะดีกว่านี้ ได้รับการชื่นชม ได้มีคุณค่า และได้การยอมรับ”</p>;
      case 87: return <p className={textBaseStyle}>ร่างสีขาวยืนนิ่งแล้วหันมาบอกคุณอย่างมั่นใจ</p>;
      case 88: return <p className={`${textBaseStyle} italic`}>“การเป็นคนธรรมดา... ก็ไม่ได้หมายความว่าไร้ซึ่งความหมาย... ท้องฟ้าที่กว้างใหญ่... ก็ประกอบจากหยดน้ำฝนที่แสนธรรมดา... ผืนป่าที่อุดมสมบูรณ์... ก็เริ่มต้นจากเมล็ดพันธุ์เล็กๆ... หรือเครื่องจักรที่ยิ่งใหญ่... ก็ต้องการฟันเฟืองแต่ละน้อยชิ้น”</p>;
      case 89: return <p className={`${textBaseStyle} italic`}>“คุณน่ะมีค่า ไม่จำเป็นต้องพิเศษถึงมีค่า แต่เพราะเรา</p>
      case 90: return <p className={`${textBaseStyle} italic`}>“คุณน่ะประเมินค่าตัวเองต่ำเกินกว่าที่เป็น เอาเถอะนะ เพราะถึงแม้คุณจะไม่สามารถช่วยพวกเราได้ คุณก็ยังคงมีค่าเสมอ”</p>;
      case 91: return <p className={textBaseStyle}>ร่างนั้นบอก แม้จะไม่เห็นหน้าเขา แต่ก็พอสัมผัสได้ว่าเขายิ้มอ่อน ๆ ให้คุณ</p>;
      case 92: return <p className={textBaseStyle}>เมฆทมิฬด้านบนเริ่มขยับเล็กน้อย สภาพแวดล้อมมีกลิ่นอายบางอย่างที่เปลี่ยนแปลง</p>;
      case 93: return <p className={`${textBaseStyle} italic`}>“ถ้าคุณไม่สะดวกจริง ๆ งั้นคุณช่วยไปคุยกับเจ้าเด็กคนนั้นหน่อยสิ”</p>;
      case 94: return <p className={textBaseStyle}>พอร่างสีขาวนั้นพูดจบ เขาก็ผายมือไปอีกทางหนึ่ง เห็นร่างนึงอยู่หลังต้นไม้ที่เหี่ยวเฉา กำลังกอดขาก้มหน้าอยู่</p>;
      case 95: return <p className={textBaseStyle}>คุณเห็นเด็กคนหนึ่ง ร่างเล็ก ๆ อายุน่าจะราว ๆ ไม่เกินแปดถึงเก้าขวบ หน้าตาเหมือนคุณในตอนเด็กเลยก็ว่าได้</p>;
      case 96: return <p className={`${textBaseStyle} italic`}>“เขาน่ะเป็นแบบนี้มาสักระยะแล้วหลังจากที่นี้เป็นแบบนี้ คุณช่วยไปปลอบเขาหน่อยได้มั้ย”</p>;
      case 97: return <p className={textBaseStyle}>คุณพยักหน้ารับแบบเล็กน้อย ก่อนที่จะเดินไปหยุดตรงหน้าเด็กคนนั้น</p>;
      case 98: return <InputWrapper question="เห็นเด็กคนนี้แล้ว คุณคิดว่าเด็กคนนี้กำลังรู้สึกอะไร" value={childFeelingGuess} setter={setChildFeelingGuess} handleTextInputSubmit={handleTextInputSubmit} nextStep={99} step={step} />;
      case 99: return <p className={`${textBaseStyle} italic`}>“ไง..คุณน่าจะเป็นรุ่นราวพี่เรา” เด็กคนนั้นเงยหน้ามองและทักทายคุณ</p>;
      case 100: return <p className={`${textBaseStyle} italic`}>“ตอนนี้เรา {childFeelingGuess || 'รู้สึกไม่ดีเลย' }”</p>;
      case 101: return <p className={`${textBaseStyle} italic`}>“อืม เป็นเพื่อนคุยหน่อยได้มั้ยพี่” เด็กคนนี้ร้องขอเบา ๆ</p>;
      case 102: return <p className={textBaseStyle}>คุณเลยก้มตัวลง นั่งลงใกล้ ๆ เด็กคนนี้</p>;
      case 103: {
        const choices = ["จะยอมหยุดพักจากทุกสิ่ง ให้ร่างกายและจิตใจได้พักผ่อนอย่างเต็มที่ ไม่ฝืน", "จะหาทางระบายความรู้สึกนั้นออกมา อาจจะเขียนบันทึก ดูหนัง เล่นเกม ฟังเพลง หรือพูดคุยกับคนที่ไว้ใจ", "จะเผชิญหน้ากับความรู้สึกนั้น พยายามทำความเข้าใจต้นตอของมัน และหาวิธีแก้ไขปัญหาที่แท้จริง", "เรียนรู้ที่จะปฏิเสธในสิ่งที่ไม่ไหว หรือสิ่งที่ไม่ส่งผลดีต่อจิตใจตัวเอง"];
        return (<QuestionWrapper question="เราถามอะไรพี่ได้มั้ย ตอนพี่เจอเรื่องไม่ดี พี่จัดการและก็ทำอะไรเหรอ ? เราไม่รู้ว่าจะทำอะไร หรือควรทำอะไรได้ เราไม่อยากให้มันฉุดรั้งใจเราแบบนี้" step={step}>{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setHowToManageStress, choice, 104)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 104: return <p className={`${textBaseStyle} italic`}>“เป็นวิธีที่ดีเลยนะ เราคงจะลองทำตามดู”</p>;
      case 105: {
        const choices = ["ได้อยู่ท่ามกลางธรรมชาติ สัมผัสแสงแดด สายลม หรือเสียงของต้นไม้ใบหญ้า", "ได้กลับไปทำสิ่งที่รัก หรืองานอดิเรกที่ทำให้ลืมความกังวลและได้อยู่กับตัวเอง", "การได้ระบายหรือพูดคุยกับคนที่ไว้ใจ คนที่รับฟังและเข้าใจ โดยไม่ตัดสิน(รวมถึงสัตว์เลี้ยงด้วย)", "การได้อยู่เงียบๆ คนเดียว ทำสมาธิ อ่านหนังสือ หรือฟังเพลงที่ผ่อนคลาย"];
        return (<QuestionWrapper question="… เราถามเพิ่มได้มั้ย แล้วในวันที่ 'พลังใจ' ของพี่ไม่มีเหลือเลย อะไรคือ 'แหล่งพลังงาน' เล็กๆ น้อยๆ ที่จะช่วยให้พี่ได้กลับมาเติมเต็มตัวเอง ?" step={step}>{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setEnergySource, choice, 106)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 106: return <p className={textBaseStyle}>เมื่อคุณตอบเด็กคนนี้ไป บรรยากาศรอบข้างเริ่มดีขึ้น อากาศเริ่มอบอุ่นขึ้นมาบ้าง ต้นบางต้น เริ่มฟื้นคืนสภาพตัวเองได้</p>;
      case 107: return <p className={`${textBaseStyle} italic`}>“เราพอเข้าใจบ้างแล้ว ขอบคุณพี่มากนะ เราจะพยายามดู” เด็กคนนั้นลุกขึ้นตอบ</p>;
      case 108: return <p className={`${textBaseStyle} italic`}>“ป่ะ ไปกัน” สิ้นเสียง เด็กคนนี้ก็จูงมือคุณกลับไปหาร่างนั้นอีกครั้ง</p>;
      case 109: return <p className={`${textBaseStyle} italic`}>“อ่ะ อ่าว คุยกันเรียบร้อยแล้วสินะ แล้วนี่คุณพาเด็กคนนี้ออกจากตรงนั้นได้ด้วยหรอ”</p>;
      case 110: return <p className={textBaseStyle}>ร่างสีขาวนั้นพูดด้วยความประหลาดใจ พร้อมกล่าวต่อ</p>;
      case 111: return <p className={`${textBaseStyle} italic`}>“เขาอยู่ตรงนั้นไม่ยอมไปไหนเลย แต่คุณทำได้ เป็นเรื่องที่ดีแล้—-“</p>;
      case 112: return <p className={textBaseStyle}>ก่อนที่ร่างนั้นจะพูดจบ ร่างสีขาวที่ประกายแสง กลับเริ่มมีร่างที่โปร่งใส คล้ายจะสลายหายไปเอง ประดังน้ำระเหยเป็นไอแก๊ส</p>;
      case 113: return <p className={`${textBaseStyle} italic`}>“เกิดอะไรขึ้นน่ะ ทำไมยังเป็นแบบนี้กันล่ะ” เด็กคนนั้นพูดด้วยความตกใจ</p>;
      case 114: return <p className={`${textBaseStyle} italic`}>“ตะ-ตลอดเวลาที่ผ่านมา เราไม่เคยรักตัวเองเลย ภายในจึงอ่อนแอ เลยโดนผลกระทบจากการ-สะ—สลายของที่แห่งนี้</p>;
      case 115: return <p className={`${textBaseStyle} italic`}>“แล้วทำไมคุณไม่รักตัวเองล่ะ” เด็กคนนั้นโพล่งถามออกไป</p>;
      case 116: return <p className={`${textBaseStyle} italic`}>“มั-น ดู แอบเห็นแก่ตัวล่ะมั้-“</p>;
      case 117: return <p className={`${textBaseStyle} italic`}>“รักตัวเองไม่เท่ากับเห็นแก่ตัวซักหน่อย รักตัวเองได้ดี ก็จะรักคนอื่นได้ดีเช่นกัน”</p>;
      case 118: return <p className={`${textBaseStyle} italic`}>“แต่เราไม่รู้สึกว่าตัวเองมีค่าเลย เราไม่เคยรู้สึกว่าตัวเองมีคุณค่าเลย เราขอโทษที่ทำให้ผิดหวังนะ เราพยายามแล้ว”</p>
      case 119: return <QuestionWrapper question="" step={step}><button className={choiceButtonStyle} onClick={() => handleChoice(null, null, 120)}>ไม่ว่าอะไรจะเกิด แต่คุณก็ยังคงเป็นคุณเสมอ</button></QuestionWrapper>;
      case 120: return <p className={textBaseStyle}>สิ้นเสียงคุณ ร่างนั้นเริ่มกลับมาดีขึ้นบ้าง แม้จะยังกระพริบไปมา ระหว่างร่างโปร่งแสงปกติ กับร่างโปร่งใสของเมื่อกี้</p>;
      case 121: {
        const choices = ["เพียงแค่ได้รับการโอบกอดอย่างอ่อนโยน และมีใครสักคนรับฟังความเจ็บปวด โดยไม่ตัดสิน", "ต้องการใครสักคนมายืนยันว่าเรายังมีคุณค่า ไม่ว่าเราจะเคยทำอะไรผิดพลาดมาแค่ไหนก็ตาม", "ต้องการคำแนะนำที่ชัดเจนว่าจะต้องทำอย่างไร เพื่อให้หลุดพ้นจากความทุกข์ทรมานนี้", "อยากได้รับโอกาสในการให้อภัยตัวเอง และโอกาสในการเริ่มต้นชีวิตใหม่ที่ดีกว่า"];
        return (<QuestionWrapper question="คุณได้จินตนาการ ตั้งคำถามกับตัวเอง: ร่างนั้นที่บอบบางและใกล้สลาย... หากเราคือร่างนั้น ในห้วงเวลาที่สิ้นหวังที่สุด เราอยากจะได้รับ 'ความช่วยเหลือ' หรือ 'คำพูด' แบบไหนมากที่สุดกันนะ ?" step={step}>{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setHelpForWhiteFigure, choice, 122)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 122: return <p className={textBaseStyle}>เมื่อคุณตอบเด็กคนนี้ไป บรรยากาศรอบข้างเริ่มดีขึ้น อากาศเริ่มอบอุ่นขึ้นมาบ้าง ต้นบางต้น เริ่มฟื้นคืนสภาพตัวเองได้</p>;
      case 123: return <p className={`${textBaseStyle} italic`}>“เรา..ไม่เป็นอะไรมากแล้วล่ะ.. ขอโทษที่ทำให้เป็นห่วง” ร่างสีขาวนั้นพูดด้วยเสียงเศร้า</p>;
      case 124: return <p className={`${textBaseStyle} italic`}>“เราจะ..พยายาม เป็นตัวเองในทางที่ดีขึ้น เราสัญญา”</p>;
      case 125: return <p className={`${textBaseStyle} italic`}>“แน่นอน!! เราเชื่อ” เด็กคนนั้นตอบกลับ</p>;
      case 126: {
        const choices = ["อยากจะบอกว่า 'ให้อภัยคุณแล้ว... เรายอมรับในทุกสิ่งที่เป็น... ไม่ว่าคุณจะเป็นอย่างไรก็ตาม'", "อยากจะบอกว่า 'คุณมีค่าเสมอ... ไม่จำเป็นต้องพิเศษ... เรารักคุณในแบบที่คุณเป็น'", "อยากจะบอกว่า 'คุณเข้มแข็งมากที่ผ่านเรื่องราวมาได้ถึงตรงนี้… มาเติบโตไปข้างหน้าด้วยกันนะ'", "เราอยากจะบอกว่า 'เราเข้าใจทุกความเจ็บปวดของคุณ... เราจะอยู่เคียงข้างคุณเสมอ... ไม่ว่าอะไรจะเกิดขึ้น'"];
        return (<QuestionWrapper question="ตอนนี้... เมื่อคุณได้เข้าใจความรู้สึกของ 'ตัวตนที่บอบบาง' นั้นแล้ว... หากคุณสามารถส่ง 'คำพูด' หรือ 'ความรู้สึก' ใดไปให้เขาได้ในตอนนี้... คุณอยากจะบอกอะไรกับ 'เขา' มากที่สุด... เพื่อโอบกอดและเยียวยาความเจ็บปวดเหล่านั้น?" step={step}>{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setMessageToPastSelf, choice, 127)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 127: return <p className={textBaseStyle}>คุณบอกร่างนั้นว่า “{messageToPastSelf || '...'}”</p>;
      case 128: return <p className={textBaseStyle}>ทั้งสองคนมองหน้าคุณพร้อมกัน ด้วยสายตาที่เริ่มอ่อนโยน มีความสุขบ้าง</p>;
      case 129: return <p className={`${textBaseStyle} italic`}>“ขอบคุณนะ {name}” ร่างสีขาวนั้นที่เริ่มค่อย ๆ กลับมาดีขึ้น จากเดิม</p>;
      case 130: return <p className={textBaseStyle}>ตอนนี้เหมือนสถานการณ์รอบด้านเริ่มกลับมา สภาพแวดล้อมผิดธรรมชาติ กลับสู่ปกติ ท้องฟ้า บรรยากาศ อากาศ และตลอดสิ่งแวดล้อม ทุกอย่างฟื้นฟูอย่างฉับพลัน</p>;
      case 131: return <p className={`${textBaseStyle} italic`}>“ดูเหมือน ภัยจะเริ่มหายไปแล้วนะพี่” เด็กคนนั้นบอก</p>;
      case 132: return <p className={`${textBaseStyle} italic`}>“อืม ใช่ ทั้งหมดนี้เป็นเพราะคุณจริง ๆ นะ” ร่างสีขาวที่เริ่มกลายเป็นร่างคนแบบปกติพูดต่อ</p>;
      case 133: return <QuestionWrapper question="" step={step}><button className={choiceButtonStyle} onClick={() => handleChoice(null, null, 134)}>ไม่เลยเรายังไม่ได้ทำอะไรเลยนะ</button></QuestionWrapper>;
      case 134: return <p className={`${textBaseStyle} italic`}>“คุณทำมันจริง ๆ คุณช่วยพวกเราไว้ เมื่อจิตใจคุณเริ่มมั่นคง ที่แห่งนี้ก็จะกลับมาสดชื่นเหมือนเดิมดังเคยเป็น คุณเริ่มเรียนรู้ที่จะรู้ว่าการรักตัวเอง มันสำคัญมาก”</p>;
      case 135: return <p className={`${textBaseStyle} italic`}>“ตอนนี้ เราคงต้องส่งคุณกลับแล้ว ต้องขอโทษจริง ๆ ที่พาคุณมาอย่างกระทันหัน แต่คุณน่ะ ‘สำคัญกับที่นี้เสมอนะ’ ” ร่างสีขาวที่เป็นร่างคนเรียบร้อยได้กล่าว</p>;
      case 136: return <p className={`${textBaseStyle} italic`}>“ขอถามอะไรเป็นครั้งสุดท้ายก่อนกลับได้มั้ย”</p>;
      case 137: {
        const choices = ["อยากใช้เรื่องราวและประสบการณ์ที่ได้เรียนรู้ มาเป็นแรงบันดาลใจให้ผู้อื่น ให้พวกเขากล้าที่จะรักและเข้าใจตัวเอง", "อยากนำพลังและความสุขที่ได้กลับมานี้ ไปสร้างสรรค์ผลงานใหม่ๆ ที่เป็นประโยชน์ หรือทำให้ผู้อื่นมีความสุข", "อยากนำความเข้าใจในตัวเองไปใช้กับการดูแลความสัมพันธ์กับคนรอบข้างให้แข็งแรงและมีความสุขยิ่งขึ้น", "อยากใช้พลังทั้งหมดนี้ เพื่อก้าวไปสู่เป้าหมายที่แท้จริงของชีวิต ที่ค้นพบในภารกิจนี้ โดยไม่ลังเลอีกต่อไป"];
        return (<QuestionWrapper question="เมื่อตัวตนภายในของคุณสมบูรณ์ และเต็มไปด้วยพลัง คุณจะใช้พลังนี้เพื่อ 'สร้างสรรค์' หรือ 'แบ่งปัน' สิ่งใด ให้กับโลกที่แท้จริงของท่าน?" step={step}>{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setCreativeUseOfPower, choice, 138)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 138: return <p className={`${textBaseStyle} italic`}>“ขอบคุณที่บอกมาอย่างนั้นนะ พวกเราเชื่อมั่นในตัวคุณเสมอ”</p>;
      case 139: return <p className={`${textBaseStyle} italic`}>“อยากบอกแค่ว่า เพราะคุณสมควรที่จะมีความสุขที่สุดในโลก”</p>;
      case 140: return <p className={textBaseStyle}>เมื่อสิ้นร่างนั้นกล่าวจบ เด็กคนนั้นก็เดินมาหาหาคุณ</p>;
      case 141: return <InputWrapper question="นี่พี่ ถามไรหน่อยก่อนพี่จะไปได้มั้ย พี่เชื่อว่าผมจะไปได้ไกลเท่าพี่มั้ย เพราะผมไม่รู้ ว่าผมเก่งพอหรือดีพอจะทำได้มั้ย พี่น่ะเก่ง เก่งสุดๆจนผมน่าจะเทียบไม่ติด" value={childDreamQuestion} setter={setChildDreamQuestion} handleTextInputSubmit={handleTextInputSubmit} nextStep={142} step={step} />;
      case 142: return <p className={`${textBaseStyle} italic`}>“งั้นหรอ ผมเองก็จะเชื่อมั่นแบบนั้นเช่นกันนะ”</p>;
      case 143: return <p className={`${textBaseStyle} italic`}>“ถึงแม้ความฝันของพวกเรา จะไปได้ไกลหรือไม่ไกล เราเองก็ไม่รู้ แต่มันก็ดีที่เราได้เดินทางร่วมกันนะพี่ และเราอยากเดินทางร่วมกับพี่ไปจนถึงที่สุดเลย”</p>;
      case 144: return <InputWrapper question="คุณอยากบอกเด็กคนนี้ว่าอะไร เป็นการบอกลาเขามั้ย" value={messageToChildSelf} setter={setMessageToChildSelf} handleTextInputSubmit={handleTextInputSubmit} nextStep={145} step={step} />;
      case 145: return <p className={textBaseStyle}>เมื่อคุณบอกเขาเรียบร้อย เด็กคนนั้นก็น้ำตาไหลด้วยความปลื้มปิติ พร้อมกับแสงสีขาวที่เริ่มขยายจากข้างหลังของคุณ พร้อมแรงดึงดูดที่เริ่มแรงขึ้น</p>;
      case 146: return <p className={`${textBaseStyle} italic`}>“ซักวันหนึ่งเราจะได้พบกันนะ พี่{name} ยังไงก็ ‘{messageToChildSelf || '...'}’ นะ”</p>;
      case 147: return <p className={textBaseStyle}>คุณยิ้มตอบกลับเด็กคนนั้นไป</p>;
      case 148: return <p className={`${textBaseStyle} italic`}>“ก่อนที่คุณจะไป ช่วยรับกระดาษนี้ไว้ทีสิ แล้วก็ขอบคุณสำหรับทุกอย่างนะ คุณเป็นคนสำคัญของพวกเรา พวกเราจะไม่มีวันลืมคุณเลย” ร่างสีขาวที่เป็นคนตอนนี้บอกคุณ</p>;
      case 149: return <QuestionWrapper question="" step={step}><button className={choiceButtonStyle} onClick={() => handleChoice(null, null, 150)}>ได้สิ นั่นสินะ แล้วคุณชื่ออะไรนะ</button></QuestionWrapper>;
      case 150: return <p className={textBaseStyle}>คุณพึ่งนึกได้ว่ายังไม่รู้ชื่อของคนที่เคยเป็นร่างสีขาวเลย ที่ตอนนี้เริ่มเห็นหน้าเขาชัดขึ้นเรื่อย ๆ</p>;
        case 151: {
          // เพิ่ม Debug เพื่อตรวจสอบข้อมูล
          console.log('=== Case 151 Debug ===');
          console.log('userData:', userData);
          console.log('name from userData:', userData?.name);
          console.log('localStorage userData:', localStorage.getItem('userData'));
          console.log('localStorage playerName:', localStorage.getItem('playerName'));
          console.log('localStorage formData:', localStorage.getItem('formData'));
          console.log('id:', id);
          
          let displayName = '';
          
          // ลำดับการหาชื่อผู้เล่น
          // 1. จาก userData.name ที่ได้จาก useEffect
          if (userData?.name && userData.name.trim() !== '') {
            displayName = userData.name;
            console.log('✅ Using userData.name:', displayName);
          }
          // 2. จาก localStorage playerName (มาจาก Form.js ที่เพิ่งแก้)
          else {
            const storedPlayerName = localStorage.getItem('playerName');
            if (storedPlayerName && storedPlayerName.trim() !== '') {
              displayName = storedPlayerName;
              console.log('✅ Using localStorage playerName:', displayName);
            }
            // 3. จาก localStorage userData
            else {
              try {
                const storedUserData = localStorage.getItem('userData');
                if (storedUserData) {
                  const parsedData = JSON.parse(storedUserData);
                  if (parsedData.name && parsedData.name.trim() !== '') {
                    displayName = parsedData.name;
                    console.log('✅ Using localStorage userData.name:', displayName);
                  }
                }
              } catch (error) {
                console.error('❌ Error parsing userData localStorage:', error);
              }
              
              // 4. จาก localStorage formData (fallback)
              if (!displayName || displayName.trim() === '') {
                try {
                  const storedFormData = localStorage.getItem('formData');
                  if (storedFormData) {
                    const parsedData = JSON.parse(storedFormData);
                    if (parsedData.name && parsedData.name.trim() !== '') {
                      displayName = parsedData.name;
                      console.log('✅ Using localStorage formData.name:', displayName);
                    }
                  }
                } catch (error) {
                  console.error('❌ Error parsing formData localStorage:', error);
                }
              }
            }
          }
          
          // 5. Fallback สุดท้าย
          if (!displayName || displayName.trim() === '') {
            displayName = 'เพื่อน';
            console.log('❌ Using fallback name:', displayName);
          }
          
          console.log('🎯 Final displayName for case 151:', displayName);
          
          return (
            <p className={`${textBaseStyle} italic`}>
              "เราชื่อ {displayName} น่ะ"
            </p>
          );
        }  
      case 152: return <p className={textBaseStyle}>ก่อนที่จะงงและจะได้บอกลาคนตรงหน้า คุณก็ถูกดึงดูดด้วยแรงดึงดูดของประตูนั้นเข้าไปแล้ว...</p>;
      // --- บทสรุป: การกลับมา ---
      case 153: return <p className={textBaseStyle}>.....</p>;
      case 154: return <TypewriterEffect text="06.58....06.59.......07.00" step={step} onComplete={() => {
        // เล่นเสียง alarm เมื่อพิมพ์เสร็จ
        if (alarmAudioRef.current) {
          alarmAudioRef.current.src = alarm;
          alarmAudioRef.current.volume = isMuted ? 0 : 0.5;
          alarmAudioRef.current.play().catch(console.error);
        }
      }} />;
      case 155: return <p className={textBaseStyle}>เสียงนาฬิกาปลุกดังขึ้น... คุณค่อย ๆ ลืมตาตื่นจากฝันที่ยาวนาน</p>;
      case 156:return <p className={textBaseStyle}>วันนี้คือวันศุกร์... และยังมีบางสิ่งที่คุณต้องรับมือในโลกแห่งความจริง</p>;
      case 157:return <p className={textBaseStyle}>คุณยังคงจำความฝันนั้นได้... มันทั้งชัดเจนและเหมือนจริงอย่างน่าประหลาด</p>;
      case 158:return <p className={textBaseStyle}>คุณค่าต่าง ๆ ที่คุณได้รับจากในฝัน... มันยังคงก้องอยู่ในใจ</p>;
      case 159:return <p className={textBaseStyle}>ความรู้สึกบางอย่างเริ่มเปลี่ยนไป... คุณเริ่มสบายใจกับ 'ตัวตน' ของคุณมากขึ้น</p>;
      case 160:return <p className={textBaseStyle}>แม้จะเป็นเพียงแค่ความฝัน... แต่มันได้หล่อหลอมบางสิ่งในใจคุณไว้แล้ว</p>;
      case 161:return <p className={textBaseStyle}>คุณลุกขึ้นจากเตียง... พร้อมจะก้าวออกไปสู่วันใหม่ ด้วยใจที่แข็งแกร่งกว่าเดิม</p>;
      case 162: return <p className={textBaseStyle}>วันนี้คุณคิดว่าเสร็จทุกอย่างแล้ว คุณอาจจะไปหาอะไรทำ</p>;
      case 163: return <p className={textBaseStyle}>ไปเที่ยวซักที่ในวันหยุดที่จะถึง</p>;
      case 164: return <p className={textBaseStyle}>พบปะผู้คนบ้าง</p>;
      case 165: return <p className={textBaseStyle}>มีอะไรหลายอย่างให้คุณทำ</p>;
      case 166: return <p className={textBaseStyle}>รู้สึกดีจริง ๆ</p>;
      case 167: return <p className={textBaseStyle}>ในตอนนั้นเอง คุณได้รู้สึกว่ามีกระดาษอะไรอยู่ที่มือ</p>;
      case 168: return <p className={textBaseStyle}>เป็นกระดาษสีแปลก ๆ มีข้อความข้างใน นี่คงเป็นของร่างสีขาวนั่นหรอกหรอ</p>;
      case 169: return <p className={textBaseStyle}>คุณเลยหยิบขึ้นมาอ่าน</p>;

      default:
        return <p className={textBaseStyle}>กำลังโหลดเนื้อเรื่อง... (Step: {step})</p>;
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black overflow-hidden">
      {/* Audio Elements */}
      <audio ref={audioRef} preload="auto" />
      <audio ref={windAudioRef} preload="auto" />
      <audio ref={bgMusicRef} preload="auto" />
      <audio ref={rainAudioRef} preload="auto" />
      <audio ref={lightningAudioRef} preload="auto" />
      <audio ref={warpAudioRef} preload="auto" />
      <audio ref={doorAudioRef} preload="auto" />
      <audio ref={alarmAudioRef} preload="auto" />
      
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ 
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundColor: (step >= 56 && step <= 61) || (step >= 153 && step <= 154) ? 'white' : 'black'
        }}
      />
      {/* Dark Overlay - ปิดสำหรับ case 60+ */}
      <div className="absolute inset-0 w-full h-full bg-black/50" style={{
        display: step >= 60 ? 'none' : 'block'
      }} />
      
      {/* Top Control Buttons */}
      <div className="absolute top-5 right-5 z-20 flex gap-3">
        {/* Mute/Unmute Button */}
        <button 
          onClick={toggleMute}
          className={`p-2 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm ${
            step >= 60 ? 'text-black' : 'text-white'
          }`}
          disabled={isTransitioning}
          title={isMuted ? "เปิดเสียง" : "ปิดเสียง"}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
        
        {/* Exit Button */}
        <button 
          onClick={exitToHome}
          className={`p-2 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm ${
            step >= 60 ? 'text-black' : 'text-white'
          }`}
          disabled={isTransitioning}
          title="ออกจากเกม"
        >
          ✕
        </button>
      </div>
      
      {/* Back Button */}
      {step > 1 && step !== 58 && (
        <button 
          onClick={goBack} 
          className={`absolute top-5 left-5 z-20 px-4 py-2 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm ${
            step >= 60 ? 'text-black' : 'text-white'
          }`}
          disabled={isTransitioning}
        >
          ย้อนกลับ
        </button>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div ref={textContentRef} className="w-full h-full flex items-center justify-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Story;