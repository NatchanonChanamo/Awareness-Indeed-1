import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useNavigate, useParams } from 'react-router-dom';
import caronstreet from './assets/caronstreet.gif';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const textShadowStyle = { textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' };

// --- Helper Components & Styles (moved outside Story component to prevent re-rendering issues) ---

const textBaseStyle = "text-white font-light leading-relaxed text-balance";
const fluidTextStyle = { ...textShadowStyle, fontSize: 'clamp(1.2rem, 1rem + 0.6vw, 1.5rem)' };
const inputStyle = "w-full p-3 border-2 border-white/50 bg-black/30 rounded-lg text-white text-left text-lg placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm";
const buttonStyle = "px-6 py-2 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/20 transition-colors duration-300 font-semibold backdrop-blur-sm";

const QuestionWrapper = ({ question, children }) => (
  <div className="w-full max-w-3xl text-center flex flex-col items-center">
    <p className={textBaseStyle} style={{ ...fluidTextStyle, marginBottom: '2rem' }}>{question}</p>
    <div className="flex flex-col items-center gap-4 w-full">{children}</div>
  </div>
);

const InputWrapper = ({ question, value, setter, handleTextInputSubmit, nextStep, isTextArea = true, placeholder = "...พิมพ์คำตอบของคุณที่นี่" }) => (
  <div className="w-full max-w-md text-center">
    <p className={textBaseStyle} style={{ ...fluidTextStyle, marginBottom: '1.5rem' }}>{question}</p>
    {isTextArea ? (
      <textarea value={value} onChange={(e) => setter(e.target.value)} className={`${inputStyle} min-h-[100px]`} placeholder={placeholder} />
    ) : (
      <input type="text" value={value} onChange={(e) => setter(e.target.value)} className={inputStyle} placeholder={placeholder} />
    )}
    <div className="w-full flex justify-end mt-4">
      <button onClick={() => handleTextInputSubmit(value, nextStep)} className={buttonStyle}>ต่อไป</button>
    </div>
  </div>
);


function Story() {
  const storyContainerRef = useRef(null);
  const textContentRef = useRef(null);
  const whiteFlashRef = useRef(null);
  
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const TOTAL_STEPS = 357; // อัปเดตจำนวนหน้ารวม

  // --- State for User Data & Story Choices ---
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedChoice, setSelectedChoice] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [locationGuess, setLocationGuess] = useState('');
  const [reactionChoice, setReactionChoice] = useState('');
  const [finalQuestion, setFinalQuestion] = useState('');
  const [confidence, setConfidence] = useState('');
  const [compliment, setCompliment] = useState('');
  
  // --- New States for Added Story ---
  const [feelingAfterTruth, setFeelingAfterTruth] = useState('');
  const [bodySignal, setBodySignal] = useState('');
  const [intrusiveThought, setIntrusiveThought] = useState('');
  const [reactionToTruth, setReactionToTruth] = useState('');
  const [responseToFatigue, setResponseToFatigue] = useState('');
  const [energySource, setEnergySource] = useState('');
  const [helpForWhiteFigure, setHelpForWhiteFigure] = useState('');
  const [messageToPastSelf, setMessageToPastSelf] = useState('');
  const [creativeUseOfPower, setCreativeUseOfPower] = useState('');
  const [childFeelingGuess, setChildFeelingGuess] = useState('');
  const [dreamAnswer, setDreamAnswer] = useState('');
  const [happinessAnswer, setHappinessAnswer] = useState('');
  const [messageToChildSelf, setMessageToChildSelf] = useState('');

  // Effect to fetch user data (age and name)
  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const docRef = doc(db, "formdata", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setAge(data.age);
            setName(data.name);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [id]);

  // Effect for scene fade-in
  useEffect(() => {
    gsap.to(storyContainerRef.current, { opacity: 1, duration: 1.5, ease: "power2.inOut" });
  }, []);

  const advanceToNextStep = useCallback((nextStep) => {
    setIsTransitioning(isCurrentlyTransitioning => {
      // ถ้ากำลังเปลี่ยนหน้าอยู่แล้ว ให้ข้ามไป ไม่ทำอะไร
      if (isCurrentlyTransitioning) {
        return true;
      }

      // เริ่มการเปลี่ยนหน้า (Fade out)
      gsap.to(textContentRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          setStep(nextStep);
          // การแสดงข้อความใหม่ (Fade in) จะถูกจัดการโดย useEffect ที่ขึ้นอยู่กับ 'step'
        }
      });

      // ตั้งค่า state ว่ากำลังเปลี่ยนหน้า
      return true;
    });
  }, [setStep, setIsTransitioning]);

  // --- Specific Handlers for Branching Logic ---
  const handleActionChoiceClick = useCallback((action) => {
    setSelectedAction(action);
    let nextStep = 70; // Default for "พยายามทำความเข้าใจ..."
    if (action.includes("อะไรจะเกิดก็เกิด")) {
      nextStep = 80;
    } else if (action.includes("เอามือไปจับ")) {
      nextStep = 90;
    } else if (action.includes("หนีสิรออะไร")) {
      nextStep = 100;
    }
    advanceToNextStep(nextStep);
  }, [advanceToNextStep, setSelectedAction]);

  const handleConfidenceChoice = useCallback((choice) => {
    setConfidence(choice);
    if (choice === 'มั่นใจ') {
      advanceToNextStep(200);
    } else {
      advanceToNextStep(190);
    }
  }, [advanceToNextStep, setConfidence]);

  // Effect for text transitions and click handling
  useEffect(() => {
    const container = storyContainerRef.current;
    const textContent = textContentRef.current;
    if (!container || !textContent) return;

    // --- Animation Logic ---
    if (step === 121) {
      gsap.to(textContent, { opacity: 0, duration: 0.2 });
      gsap.to(whiteFlashRef.current, {
        opacity: 1, duration: 0.4, ease: "power2.in",
        onComplete: () => {
          gsap.to(whiteFlashRef.current, {
            opacity: 0, duration: 2, delay: 1, ease: "power2.out",
            onStart: () => { setStep(122); setIsTransitioning(false); }
          });
        }
      });
      return; // Skip default animation and click handler
    }
    
    // Default text fade-in
    gsap.fromTo(textContent, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.inOut", onComplete: () => setIsTransitioning(false) });

    // --- Click/Auto-Advance Handling Logic ---
    const choiceSteps = [5, 26, 43, 69, 130, 161, 168, 176, 178, 183, 202, 207, 212, 214, 226, 230, 234, 235, 236, 254, 256, 267, 271, 279, 283, 284, 290, 303, 306, 308, 312, 327, 337];
    const autoAdvanceSteps = [342, 343, 344]; // Steps for time display
    let handleClick = null;
    let timeoutId = null;

    if (autoAdvanceSteps.includes(step)) {
      // Auto-advance after 2 seconds for the clock sequence
      timeoutId = setTimeout(() => {
        advanceToNextStep(step + 1);
      }, 2000);
    } else if (!choiceSteps.includes(step)) {
      // Add click handler for regular steps
      handleClick = () => {
        let nextStep = step + 1;
        // Special navigation cases
        if ([75, 85, 95, 105].includes(step)) nextStep = 110;
        if (step === 196) nextStep = 200;

        if (nextStep <= TOTAL_STEPS) {
          advanceToNextStep(nextStep);
        } else {
          gsap.to(container, {
            opacity: 0, duration: 1,
            onComplete: () => navigate(`/postsurvey/${id}`)
          });
        }
      };
      container.addEventListener('click', handleClick);
    }

    // Cleanup function
    return () => {
      if (handleClick) {
        container.removeEventListener('click', handleClick);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [step, navigate, id, advanceToNextStep]);

  const handleBackClick = () => {
    if (step > 1) {
      // Add specific back navigation logic if needed
      setStep(prev => prev - 1);
    }
  };

  // --- Generic Handlers for Choices and Inputs ---
  const handleMultiChoice = useCallback((setter, value, nextStep) => {
    if (setter) setter(value);
    advanceToNextStep(nextStep);
  }, [advanceToNextStep]);

  const handleTextInputSubmit = useCallback((value, nextStep) => {
    if (value.trim() === '') {
      const inputElement = textContentRef.current.querySelector('input, textarea');
      if (inputElement) {
        gsap.fromTo(inputElement, { x: -10 }, { x: 10, clearProps: "x", duration: 0.1, repeat: 3 });
      }
      return;
    }
    advanceToNextStep(nextStep);
  }, [advanceToNextStep]);

  // --- Render Logic ---
  const renderContent = () => {
    const subTextStyle = { ...textShadowStyle, fontSize: 'clamp(1rem, 0.8rem + 0.5vw, 1.25rem)' };
    const choiceButtonStyle = "w-full max-w-xl p-4 bg-black/20 border-2 border-white/50 rounded-lg text-white text-center text-base md:text-lg hover:bg-white/30 transition-colors duration-300 backdrop-blur-sm";
    const singleChoiceButtonStyle = "w-full max-w-xl p-4 bg-black/30 border-2 border-white/70 rounded-lg text-white text-center text-lg hover:bg-white/40 transition-colors duration-300 backdrop-blur-md";

    switch (step) {
      // --- Existing Cases (1-228) ---
      case 1: return <p className={textBaseStyle} style={fluidTextStyle}>ในเวลาพลบค่ำอันสงัด</p>;
      case 2: return <p className={textBaseStyle} style={fluidTextStyle}>เสียงรถตามท้องถนนติดขัดยาวเหยียด</p>;
      case 3: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>กับบรรยากาศคืนวันพฤหัสบดี</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>ที่แฝงความเย็นและอบอ้าวของฤดูร้อน</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>คล้ายฝนจะตก</p></div>);
      case 4: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>"ชีวิตในวัยนี้มันก็เป็นแบบนี้สินะ"</p><p className="text-white font-light" style={{...subTextStyle, marginTop: '1rem'}}>คุณพึมพำกับตัวเอง</p><p className="text-white font-light" style={{...subTextStyle, marginTop: '0.5rem'}}>ด้วยความรู้สึกที่ยากจะบรรยาย</p></div>);
      case 5: return <InputWrapper question="วันนี้คุณเพิ่งจะ..." value={userAnswer} setter={setUserAnswer} handleTextInputSubmit={handleTextInputSubmit} nextStep={6} isTextArea={false} placeholder="...อะไรกันที่ทำให้คุณเหนื่อยขนาดนี้"/>;
      case 6: return <p className={textBaseStyle} style={fluidTextStyle}>คุณถอนหายใจดังเฮือก</p>;
      case 7: return <p className={textBaseStyle} style={fluidTextStyle}>มองเส้นทางกลับบ้านในทุกวัน</p>;
      case 8: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>ความเหน็ดเหนื่อยในวันนี้มากมาย</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>เกินกว่าคำบรรยายใด ๆ ที่คุณจะเอ่ยได้</p></div>);
      case 9: return <p className={textBaseStyle} style={fluidTextStyle}>คำถามมากมายผุดขึ้นในหัวและจิตใจของคุณ</p>;
      case 10: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>'ทำไมนะ ทำไมต้องเหนื่อยขนาดนี้กับชีวิต ?’</p>;
      case 11: return <p className={textBaseStyle} style={fluidTextStyle}>ในจิตสำนึก</p>;
      case 12: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>คุณย้อนนึกกลับไปในวันวาน</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>ไม่ทราบวันและเวลา</p></div>);
      case 13: return <p className={textBaseStyle} style={fluidTextStyle}>แต่ความรู้สึกนั้นแตกต่างจากตอนนี้...</p>;
      case 14: return <p className={textBaseStyle} style={fluidTextStyle}>…โดยสิ้นเชิง</p>;
      case 15: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>ชีวิตในช่วงเวลานั้น จริง ๆ</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>แล้วก็ไม่ได้ดีและสวยหรูเท่าไรนัก</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>ในหลายมุม มันก็ไม่ได้ดีขนาดนั้น</p></div>);
      case 16: return <p className={textBaseStyle} style={fluidTextStyle}>แต่ในตอนนี้...กลับทำให้ช่วงเวลานั้น</p>;
      case 17: return <p className={textBaseStyle} style={fluidTextStyle}>ช่วงที่ยังสามารถสัมผัสความสุข</p>;
      case 18: return <p className={textBaseStyle} style={fluidTextStyle}>สัมผัสถึงคุณค่าของตัวเราเอง</p>;
      case 19: return <p className={textBaseStyle} style={fluidTextStyle}>เป็นช่วงเวลาที่มีค่าเกินจะนึกถึง</p>;
      case 20: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>ฝนตกหนัก ท้องฟ้าส่งเสียงคำราม</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>เป็นสัญญาณของพายุฤดูร้อนอันรุนแรง</p></div>);
      case 21: return <p className={textBaseStyle} style={fluidTextStyle}>ตอนนี้คุณกำลังจะเปิดประตูบ้าน</p>;
      case 22: return <p className={textBaseStyle} style={fluidTextStyle}>ทีนี้ก็พอจะเป็นที่ของคุณบ้างล่ะนะ</p>;
      case 23: return <p className={textBaseStyle} style={fluidTextStyle}>ในห้องมืด ๆ กับเฟอร์นิเจอร์ที่เรียงรายอยู่บ้าง</p>;
      case 24: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>คุณกลับมายังพื้นที่ของตัวเองอีกครั้ง</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>หลังหายไปทั้งวันกับสิ่งที่คุณจำเป็นต้องทำ</p></div>);
      case 25: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>ทว่า กลับมีความรู้สึกบางอย่างที่คุณ...</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>...บอกไม่ถูก</p></div>);
      case 26: return (<QuestionWrapper question="โดยปกติแล้ว ครั้งแรกที่คุณก้าวเข้ามาในบ้าน หลังจากเปิดไฟ คุณมักจะมองไปที่อะไรก่อน?"><button className={choiceButtonStyle} onClick={() => handleMultiChoice(setSelectedChoice, 'ที่หน้าต่างของบ้าน ที่มองเห็นฝนโปรยปรายอย่างไม่ขาดสาย', 27)}>มองไปที่หน้าต่างของบ้าน ที่มองเห็นฝนโปรยปรายอย่างไม่ขาดสาย</button><button className={choiceButtonStyle} onClick={() => handleMultiChoice(setSelectedChoice, 'ที่เตียงนอนอันนุ่มสงบกับบรรยากาศที่แอบสบาย ๆ แบบนี้', 27)}>มองไปที่เตียงนอนอันนุ่มสงบกับบรรยากาศที่แอบสบาย ๆ แบบนี้</button><button className={choiceButtonStyle} onClick={() => handleMultiChoice(setSelectedChoice, 'ที่ห้องใดห้องหนึ่ง อาจเป็นห้องครัว หรือเป็นห้องน้ำ', 27)}>มองไปที่ห้องใดห้องหนึ่ง อาจเป็นห้องครัว หรือเป็นห้องน้ำ</button><button className={choiceButtonStyle} onClick={() => handleMultiChoice(setSelectedChoice, 'ที่มุมอับ ๆ มืด ๆ อาจมีอะไรอยู่ตรงนั้นหรือเปล่านะ', 27)}>มองไปที่มุมอับ ๆ มืด ๆ อาจมีอะไรอยู่ตรงนั้นหรือเปล่านะ</button></QuestionWrapper>);
      case 27: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>คุณมองไปที่...{selectedChoice}...</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>แล้วถอนหายใจเบา ๆ อย่างไม่สบอารมณ์</p></div>);
      case 28: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>แววตาอันว่างเปล่าและไร้ชีวิตชีวา</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>แฝงไปด้วยความคิดอันสับสนไม่อาจคาดเดา</p></div>);
      case 29: return <p className={textBaseStyle} style={fluidTextStyle}>คุณนั่งลงในท่าห่อตัว ก้มหน้าเล็กน้อย</p>;
      case 30: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>ตอนนี้คุณคิดทบทวนเรื่องราวต่าง ๆ</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>ทั้งในวันวานและวันนี้</p></div>);
      case 31: return <p className={textBaseStyle} style={fluidTextStyle}>โดยเฉพาะเรื่องราวในวัยเด็ก</p>;
      case 32: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>เด็กคนนี้ในตอนนั้น คิดว่าสามารถทำได้ทุกอย่าง</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>ตามแต่ใจปราถนาอย่างแรงกล้าและมีคุณค่าในตน</p></div>);
      case 33: return <p className={textBaseStyle} style={fluidTextStyle}>แต่ในตอนนี้คุณทำได้เพียงแค่ นั่งก้มหน้าย้อนวันวาน</p>;
      case 34: return <p className={textBaseStyle} style={fluidTextStyle}>พลางมีความสุขกับช่วงเวลาที่ห่างไกลเกินนับ</p>;
      case 35: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>เด็กคนนั้นที่ปราถนาจะมีความสุข</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>และอยากเติบโตไปกับความฝันอันแสนวิเศษและกว้างไกล</p></div>);
      case 36: return <p className={textBaseStyle} style={fluidTextStyle}>แต่ตอนนี้กลับเป็นเพียงคนธรรมดาคนหนึ่ง</p>;
      case 37: return <p className="text-center text-white font-light leading-relaxed text-balance" style={fluidTextStyle}>ที่ไม่รู้แม้แต่ว่าในวันนี้...</p>;
      case 38: return age ? <p className={`${textBaseStyle} italic text-center`} style={fluidTextStyle}>{`ตลอด ${age} ปีมานี้... เรามีค่าอะไรอยู่กันแน่นะ ?`}</p> : null;
      case 39: return <p className={textBaseStyle} style={fluidTextStyle}>ใช้ชีวิตไปวัน ๆ</p>;
      case 40: return <p className={textBaseStyle} style={fluidTextStyle}>มีจุดหมายบ้าง</p>;
      case 41: return <p className={textBaseStyle} style={fluidTextStyle}>ไร้จุดหมายบ้าง</p>;
      case 42: return <p className={textBaseStyle} style={fluidTextStyle}>ลองถามใจตัวเอง</p>;
      case 43: {
        const feelingButtonStyle = "w-full p-3 bg-black/20 border-2 border-white/50 rounded-lg text-white text-center text-sm md:text-base hover:bg-white/30 transition-colors duration-300 backdrop-blur-sm";
        const feelings = ["ไม่ได้รู้สึกอะไร ก็ปกติดี", "หมดแรง ไร้พลัง", "ท้อแท้ สิ้นหวัง", "อ้างว้าง โดดเดี่ยว", "สับสน ไม่แน่ใจ", "โกรธ หงุดหงิด", "กดดัน แบกรับ", "สงสัยในเป้าหมายชีวิต"];
        return (<QuestionWrapper question="ตอนนี้คุณรู้สึกอย่างไร ?"><div className="grid grid-cols-2 gap-4 w-full">{feelings.map(feeling => (<button key={feeling} className={feelingButtonStyle} onClick={() => handleMultiChoice(setSelectedFeeling, feeling, 44)}>{feeling}</button>))}</div></QuestionWrapper>);
      }
      case 44: return <p className={textBaseStyle} style={fluidTextStyle}>ความรู้สึกเหล่านี้ก่ายกองในหัวของคุณ</p>;
      case 45: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>มันทั้งชวนให้คุณไม่เข้าใจตัวเอง</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>และก็ไม่รู้ว่าตัวเอง..</p></div>);
      case 46: return <p className={textBaseStyle} style={fluidTextStyle}>..จะมีค่าอะไรไปมากกว่าที่กำลังเป็น</p>;
      case 47: return <p className={textBaseStyle} style={fluidTextStyle}>ในตอนนี้…</p>;
      case 48: return <p className={textBaseStyle} style={fluidTextStyle}>แต่..</p>;
      case 49: return <p className={textBaseStyle} style={fluidTextStyle}>คิดอะไรแบบนี้มากไปก็ปวดหัวเปล่า ๆ</p>;
      case 50: return <p className={textBaseStyle} style={fluidTextStyle}>ยังไงตอนนี้เราก็ทำอะไรไม่ได้ล่ะมั้ง</p>;
      case 51: return <p className={textBaseStyle} style={fluidTextStyle}>อดทนต่อไปก็ไม่เสียหายอะไร</p>;
      case 52: return <p className={textBaseStyle} style={fluidTextStyle}>ใช้ชีวิตไปวัน ๆ แบบนี้ก็คงไม่เป็นไร</p>;
      case 53: return <p className={textBaseStyle} style={fluidTextStyle}>แม้..จิตใจเรา</p>;
      case 54: return <p className={textBaseStyle} style={fluidTextStyle}>จะไม่มีที่มีทางจะดีขึ้น</p>;
      case 55: return <p className={textBaseStyle} style={fluidTextStyle}>รวมทั้งมีแต่แย่ลงก็ตาม</p>;
      case 56: return <p className={textBaseStyle} style={fluidTextStyle}>………….</p>;
      case 57: return (<div className="text-center"><p className={`${textBaseStyle} italic`} style={fluidTextStyle}>(คุณหลับตาลง</p><p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>ปล่อยความเหนื่อยล้าทั้งกายและใจให้ได้พักผ่อน</p><p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>ในเวลาอันแสนสั้นของสายธารแห่งชีวิต</p><p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>คุณก็ได้หลับไป</p><p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>เช่นเดิมแบบทุกวัน)</p></div>);
      case 58: return <p className={textBaseStyle} style={fluidTextStyle}>………….</p>;
      case 59: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>คุณลุกขึ้นจากเตียง</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>ด้วยความงัวเงียกับสถานการณ์อะไร ที่ไม่ชอบมาพากล</p></div>);
      case 60: return <p className={textBaseStyle} style={fluidTextStyle}>คุณค่อย ๆ ถ่างตาให้สว่าง</p>;
      case 61: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“นั่นมันเสียงอะไรกันน่ะ?”</p>;
      case 62: return <p className={textBaseStyle} style={fluidTextStyle}>พึมพำด้วยความงงและเหนื่อยล้า</p>;
      case 63: return <p className={textBaseStyle} style={fluidTextStyle}>เสียงหวีดวิ้วดังพายุหมุนกำลังโหม</p>;
      case 64: return <p className={textBaseStyle} style={fluidTextStyle}>พร้อมปฏิทินในห้องที่สั่นพรึ่บพรั่บไหวไปตามเสียง</p>;
      case 65: return <p className={textBaseStyle} style={fluidTextStyle}>แสงสีขาวค่อย ๆ ปรากฏตรงหน้าคุณ</p>;
      case 66: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>(รูปทรงและขนาดมันประมาณก้อนลูกบอลได้มั้ง) คุณคิดในใจ</p>;
      case 67: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>แสงนั้นสว่างจ้ามาก ราวกับจ้องดวงอาทิตย์ตรงหน้า</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>มันสว่างจนคุณต้องหยีตามอง พลางตื่นตระหนกและไม่เข้าใจในสถานการณ์</p></div>);
      case 68: return (<div className="text-center"><p className={textBaseStyle} style={fluidTextStyle}>แสงนั้นเริ่มขยายขนาดเพิ่มขึ้นจนเท่าตัวคุณ</p><p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>แถมด้วยแรงบางอย่างที่สั่นไหวเบา ๆ ที่คุณพอจะจับได้</p></div>);
      case 69: {
        const actionChoices = ["พยายามทำความเข้าใจ หาคำตอบว่าเกิดอะไรขึ้น", "คงทำอะไรไม่ได้แล้ว อะไรจะเกิดก็เกิดเถอะ", "แปลก ๆ นะ แต่ลองเอามือไปจับแสงสีขาวนั้นดู คงไม่เป็นไรหรอกมั้ง", "เจอแสงและเสียงประหลาดในห้องขนาดนี้ หนีสิรออะไรอยู่ล่ะ"];
        return (<QuestionWrapper question="เจออะไรแปลก ๆ ขนาดนี้แล้ว คุณว่าจะทำอะไรต่อ ในสถานการณ์นี้ ?">{actionChoices.map(action => (<button key={action} className={choiceButtonStyle} onClick={() => handleActionChoiceClick(action)}>{action}</button>))}</QuestionWrapper>);
      }
      case 70: return <p className={textBaseStyle} style={fluidTextStyle}>คุณยืนคิดที่มุมห้องซักครู่</p>;
      case 71: return <p className={textBaseStyle} style={fluidTextStyle}>ในขณะที่แสงนั้นก็อยู่เฉย ๆ กับที่</p>;
      case 72: return <p className={textBaseStyle} style={fluidTextStyle}>คุณหาข้อสรุปได้ลำบากมากกว่าแสงนี้คืออะไร</p>;
      case 73: return <p className={textBaseStyle} style={fluidTextStyle}>เอเลี่ยนหรอ หรือโดรนของใครบินเข้ามาในห้องคุณ</p>;
      case 74: return <p className={textBaseStyle} style={fluidTextStyle}>นึกไม่ออกจริง ๆ แต่จะให้ไปจับหรือสัมผัสก็อันตราย</p>;
      case 75: return <p className={textBaseStyle} style={fluidTextStyle}>อยู่ตรงนี้คอยมองดู ว่ามันจะทำอะไรดีกว่า</p>;
      case 80: return <p className={textBaseStyle} style={fluidTextStyle}>คุณนั่งลงคุกเข่า</p>;
      case 81: return <p className={textBaseStyle} style={fluidTextStyle}>คุณหมดอาลัยในชีวิตที่เหน็ดเหนื่อยของคุณ</p>;
      case 82: return <p className={textBaseStyle} style={fluidTextStyle}>นี่อาจเป็นสัญญาณวันสิ้นโลกอะไรทำนองนั้น</p>;
      case 83: return <p className={textBaseStyle} style={fluidTextStyle}>หรือถ้าไม่ใช่ คุณก็ภาวนาว่า</p>;
      case 84: return <p className={textBaseStyle} style={fluidTextStyle}>มันคือทางที่คุณจะได้สงบสงบจากโลกอันวุ่นวายนี้</p>;
      case 85: return <p className={textBaseStyle} style={fluidTextStyle}>ถึงอย่างนั้นแสงนั่นก็ไม่ได้ทำอะไรคุณเลย</p>;
      case 90: return <p className={textBaseStyle} style={fluidTextStyle}>คุณคิดว่ามันอาจเป็นวัตถุบางอย่างจับต้องได้</p>;
      case 91: return <p className={textBaseStyle} style={fluidTextStyle}>จึงลองเอื้อมมือไปจับมัน</p>;
      case 92: return <p className={textBaseStyle} style={fluidTextStyle}>เอื้อมไปใกล้ ๆ ในแสงนั้นที่เหมือนเป็นก้อน</p>;
      case 93: return <p className={textBaseStyle} style={fluidTextStyle}>แสงนั้นลักษณะคล้าย ๆ ก้อนวงกลมขนาดเท่าคุณ</p>;
      case 94: return <p className={textBaseStyle} style={fluidTextStyle}>คุณได้สัมผัสบางอย่าง แต่ก็บอกไม่ถูกว่ามันคืออะไร</p>;
      case 95: return <p className={textBaseStyle} style={fluidTextStyle}>แต่…มันก็แอบมีแรงดึงอะไรบางอย่าง</p>;
      case 100: return <p className={textBaseStyle} style={fluidTextStyle}>คุณเริ่มตื่นตระหนก</p>;
      case 101: return <p className={textBaseStyle} style={fluidTextStyle}>นี่มันไม่ค่อยจะปลอดภัยเท่าไรหากมันเป็นสิ่งผิดปกติ</p>;
      case 102: return <p className={textBaseStyle} style={fluidTextStyle}>คุณจึงเริ่มค่อย ๆ ขยับตัวไปใกล้ ๆ ประตู</p>;
      case 103: return <p className={textBaseStyle} style={fluidTextStyle}>กะจะออกไปเพื่อแจ้งเพื่อนบ้าน</p>;
      case 104: return <p className={textBaseStyle} style={fluidTextStyle}>หรือใครก็ตามที่เจอตอนนั้น</p>;
      case 105: return <p className={textBaseStyle} style={fluidTextStyle}>ยังไงก็ต้องออกจากที่นี้ก่อน</p>;
      case 110: return <p className={textBaseStyle} style={fluidTextStyle}>ในตอนนั้นเอง…</p>;
      case 111: return <p className={textBaseStyle} style={fluidTextStyle}>แสงนั้นได้เกิดแรงดึงดูดอันมหาศาล</p>;
      case 112: return <p className={textBaseStyle} style={fluidTextStyle}>แรงนั้นสั่นสะท้านไปทั้งห้องของคุณ</p>;
      case 113: return <p className={textBaseStyle} style={fluidTextStyle}>เปรียบดังกับหลุมดำขนาดย่อม ๆ</p>;
      case 114: return <p className={textBaseStyle} style={fluidTextStyle}>ตัวคุณในตอนนั้นไม่ทันได้ป้องกัน</p>;
      case 115: return <p className={textBaseStyle} style={fluidTextStyle}>หรือเตรียมจับอะไรยึดไว้</p>;
      case 116: return <p className={textBaseStyle} style={fluidTextStyle}>คุณตกใจสุดขีด ไม่รู้จะทำอะไร</p>;
      case 117: return <p className={textBaseStyle} style={fluidTextStyle}>และก่อนที่ตัดสินใจอะไรได้</p>;
      case 118: return <p className={textBaseStyle} style={fluidTextStyle}>แสงนั้นก็ดูดคุณหายไปในเสี้ยววิ</p>;
      case 119: return <p className={textBaseStyle} style={fluidTextStyle}>ประดังมันจ้องคุณเป็นเป้าหมาย</p>;
      case 120: return <p className={textBaseStyle} style={fluidTextStyle}>….</p>;
      case 121: return null; // หน้าสำหรับ Trigger แสงวาบ จะไม่มีข้อความ
      case 122: return <p className={textBaseStyle} style={fluidTextStyle}>ห้องได้กลับมาสงบอีกครั้ง</p>;
      case 123: return <p className={textBaseStyle} style={fluidTextStyle}>คุณเริ่มได้สติกลับคืน</p>;
      case 124: return <p className={textBaseStyle} style={fluidTextStyle}>พลันลืมตาขึ้นและมองไปรอบ ๆ</p>;
      case 125: return <p className={textBaseStyle} style={fluidTextStyle}>แสงนั้นมันหายไปแล้ว</p>;
      case 126: return <p className={textBaseStyle} style={fluidTextStyle}>แต่ตอนนี้…</p>;
      case 127: return <p className={textBaseStyle} style={fluidTextStyle}>…คุณอยู่ในสถานที่บางอย่างที่คุณคุ้นเคยมาก</p>;
      case 128: return <p className={textBaseStyle} style={fluidTextStyle}>แต่จากการตื่นตระหนกมาซักพัก</p>;
      case 129: return <p className={textBaseStyle} style={fluidTextStyle}>คุณเลยยังนึกไม่ออกว่าที่นี้ คือที่ไหน ?</p>;
      case 130: return <InputWrapper question="คุณคิดว่าที่คุณอยู่ที่นี้คือที่ไหน" value={locationGuess} setter={setLocationGuess} handleTextInputSubmit={handleTextInputSubmit} nextStep={131} isTextArea={false} placeholder="...ลองเดาสถานที่ (จำเป็นต้องตอบ)" />;
      case 131: return <p className={textBaseStyle} style={fluidTextStyle}>คุณสรุปได้ว่ากำลังอยู่ที่ {locationGuess}</p>;
      case 132: return <p className={textBaseStyle} style={fluidTextStyle}>บรรยากาศที่นี้ช่างแตกต่างและแปลกประหลาด</p>;
      case 133: return <p className={textBaseStyle} style={fluidTextStyle}>อากาศก็เช่นกัน จะร้อนก็ไม่ใช่แต่จะหนาวก็ไม่เชิง</p>;
      case 134: return <p className={textBaseStyle} style={fluidTextStyle}>ที่นี้แน่ใจคือ มันไม่รู้สึกสบายเลย</p>;
      case 135: return <p className={textBaseStyle} style={fluidTextStyle}>ทั้งหมอกสีจางไปมาดังหนังสยองขวัญ</p>;
      case 136: return <p className={textBaseStyle} style={fluidTextStyle}>ท้องฟ้าไม่ถึงกับมืด แต่ก็หม่นหมองมาก</p>;
      case 137: return <p className={textBaseStyle} style={fluidTextStyle}>พื้นดินที่หมอกคลุมและเส้นทางที่เต็มไปเศษบางสิ่ง</p>;
      case 138: return <p className={textBaseStyle} style={fluidTextStyle}>แสงจากท้องฟ้าที่สลัวและไร้เงา ทั้งที่อยู่กลางแจ้ง</p>;
      case 139: return <p className={textBaseStyle} style={fluidTextStyle}>ไม่ได้สัมผัสถึงความอบอุ่นใด ๆ</p>;
      case 140: return <p className={textBaseStyle} style={fluidTextStyle}>อ่อ มีเศษสิ่งนั้นบนพื้นลอยอยู่บนอากาศด้วย แปลกดี</p>;
      case 141: return <p className={textBaseStyle} style={fluidTextStyle}>คุณเดินต่อไป ด้วยความงุนงง</p>;
      case 142: return <p className={textBaseStyle} style={fluidTextStyle}>จนตอนนี้คิดจะหาทางกลับไปที่ที่ปกติของคุณ</p>;
      case 143: return <p className={textBaseStyle} style={fluidTextStyle}>เพราะที่แห่งนี้ยิ่งกว่าไม่ปกติสักนิด</p>;
      case 144: return <p className={textBaseStyle} style={fluidTextStyle}>สิ่งก่อสร้างที่บิดเบี้ยว ไม่สมบูรณ์</p>;
      case 145: return <p className={textBaseStyle} style={fluidTextStyle}>ทั้งไร้ต้นไม้ที่มีใบเขียวขจี มีแต่ต้นไม้ที่ตายแล้ว</p>;
      case 146: return <p className={textBaseStyle} style={fluidTextStyle}>แม้แต่สิ่งมีชีวิตเล็กใหญ่ก็ไม่มีปรากฎ</p>;
      case 147: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>‘นี่เราอยู่ที่ไหนกันวะเนี่ย’</p>;
      case 148: return name ? <p className={textBaseStyle} style={fluidTextStyle}>มีเสียงเรียก ‘{name}’... ‘{name}’... มาจากที่ไกล</p> : null;
      case 149: return <p className={textBaseStyle} style={fluidTextStyle}>คุณได้ยินใครบางคนเรียกคุณ</p>;
      case 150: return <p className={textBaseStyle} style={fluidTextStyle}>จึงลองตามเสียงนั้นไป</p>;
      case 151: return <p className={textBaseStyle} style={fluidTextStyle}>เผื่ออาจทราบสถานการณ์ หรือดีที่สุดคือสามารถออกจากที่นี้ไ้ด้</p>;
      case 152: return name ? <p className={textBaseStyle} style={fluidTextStyle}>เสียงเรียก ‘{name}’... ‘{name}’... ดังมาจากที่ไกลอีกครั้ง</p> : null;
      case 153: return <p className={textBaseStyle} style={fluidTextStyle}>คุณเข้าใกล้เสียงนั้นมาเรื่อย ๆ</p>;
      case 154: return <p className={textBaseStyle} style={fluidTextStyle}>แต่หมอกที่เต็มทั้งพื้นและอากาศ ทำให้คุณสะดุดล้มเล็กน้อย แต่ก็ไม่เป็นอะไรมาก</p>;
      case 155: return <p className={textBaseStyle} style={fluidTextStyle}>และเมื่อคุณเงยหน้ามองทางข้างหน้า</p>;
      case 156: return <p className={textBaseStyle} style={fluidTextStyle}>คุณได้พบกับต้นเสียงนั้น…</p>;
      case 157: return <p className={textBaseStyle} style={fluidTextStyle}>เจ้าของเสียงนั้นเป็นร่างสีขาวโพลน</p>;
      case 158: return <p className={textBaseStyle} style={fluidTextStyle}>ไร้หน้า ไร้ลวดลาย เดาไม่ออกว่าคือตัวอะไร</p>;
      case 159: return <p className={textBaseStyle} style={fluidTextStyle}>แต่รูปร่างทรงคล้ายมนุษย์ทุกประการ</p>;
      case 160: return <p className={textBaseStyle} style={fluidTextStyle}>ต่างแค่ตัวของเขาเป็นสีขาวทั้งตัว แต่ก็แอบส่องแสงเบา ๆ เห็นเป็นร่างโปร่งใสบ้าง</p>;
      case 161: {
        const reactionChoices = ["เข้าไปหาอีกฝ่ายด้วยความสงสัย แต่ยังเว้นระยะห่าง", "ลองสัมผัสที่ตัวเขาว่าเขามีลักษณะ เป็นอย่างไร (เขาอาจอยากให้ช่วยเหลือ)", "รู้สึกตกใจ กลัว พยายามถอยห่างเผื่อเตรียมหนี", "ไถ่ถามให้อีกฝ่ายตอบถึงสถานการณ์ตอนนี้ และให้อีกฝ่ายอธิบายทั้งหมด"];
        return (<QuestionWrapper question="คุณจะแสดงออกอย่างไรเมื่อพบร่างสีขาวนี้">{reactionChoices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleMultiChoice(setReactionChoice, choice, 162)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 162: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“ฮาฮ่า ใจเย็น ๆ ก่อนนะ”</p>;
      case 163: return <p className={textBaseStyle} style={fluidTextStyle}>ร่างสีขาวนั้นพูด หลังเขาเห็นท่าทีของคุณ</p>;
      case 164: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“เราไม่ได้มาเพื่อทำร้ายคุณหรอก”</p>;
      case 165: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“และ…ขอโทษด้วย…”</p>;
      case 166: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“ที่คุณต้องมาที่นี้ก็เพราะเราเอง”</p>;
      case 167: return <p className={textBaseStyle} style={fluidTextStyle}>ร่างนั้นอธิบาย คุณรู้สึกทั้งไม่เข้าใจ ทั้งปนอารมณ์เสียเล็กน้อย</p>;
      case 168: {
        const finalQuestions = ["แล้วคุณพามาที่นี้ทำไม?", "ที่นี่คือที่ไหนกันแน่?", "คุณเป็นใคร?", "ส่งฉันกลับไปเดี๋ยวนี้"];
        return (<QuestionWrapper question="คุณถามกลับไปว่า...">{finalQuestions.map(q => (<button key={q} className={choiceButtonStyle} onClick={() => handleMultiChoice(setFinalQuestion, q, 169)}>{q}</button>))}</QuestionWrapper>);
      }
      case 169: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"{finalQuestion}"</p>;
      case 170: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“รู้มั้ย..?..ทำไมคุณถึงไม่เจอใครนอกจากเราในที่แห่งนี้ ?”</p>;
      case 171: return <p className={textBaseStyle} style={fluidTextStyle}>นั่นสิ ตั้งแต่เรามาก็ยังไม่พบเจอใครคนอื่นเลยนี่สิ</p>;
      case 172: return name ? <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“บันทึกโบราณของที่นี้ได้กล่าวไว้ คนจากมิติอื่นที่ชื่อว่า {name} คือผู้ที่จะมาช่วยเราให้รอดภัย”</p> : <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“บันทึกโบราณของที่นี้ได้กล่าวไว้...คือผู้ที่จะมาช่วยเราให้รอดภัย”</p>;
      case 173: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“จากทุกภัยระดับร้ายแรงที่เกิดขึ้นในระดับจักรวาลของเรา”</p>;
      case 174: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ตอนนี้พลังงานของจักรวาลแห่งนี้กำลังจะหมดลงและกลับสู่จุดต้นกำเนิดก่อนการเกิดจักรวาล พลังนี้อยู่ในทุกคนของจักรวาลนี้"</p>;
      // --- สลับเนื้อหาตามที่ร้องขอ ---
      case 175: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“พวกเราจึงรวบรวมผู้มีความรู้จากทุกแขนงทั่วสารทิศ ร่วมสร้าง’อุโมงค์ข้ามจักรวาลเพื่อติดต่อกับคุณ”</p>;
      case 176: return (<QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(177)}>“อุโมงค์อะไรนะ”</button></QuestionWrapper>);
      // --- สิ้นสุดการสลับ ---
      case 177: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“แต่การส่งการติดต่อไปหาคุณนั้น จำเป็นต้องใช้พลังงานบริสุทธิ์ที่เหลือไม่พอใช้เลยด้วยซ้ำ”</p>;
      case 178: return (<QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(179)}>“พวกคุณเลยใช้สิ่งมีชีวิตทั้งหมดเพื่อเป็นพลังงานหรอ”</button></QuestionWrapper>);
      case 179: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“..ใช่…ทุกคนจำเป็นต้องสละเพื่อให้จักรวาลนี้ยังคงอยู่”</p>;
      case 180: return <p className={textBaseStyle} style={fluidTextStyle}>ร่างนั้นพูดด้วยน้ำเสียงแผ่วเบา</p>;
      case 181: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“สาเหตุที่เรายังอยู่ ก็เพราะเราได้รับหน้าที่ให้เป็นผู้ช่วยคุณ และรอรับคุณให้ช่วยเหลือพวกเรา จึงถูกสั่งให้ไม่ต้องร่วมให้พลังแก่การสร้างอุโมงค์เช่นคนอื่น ๆ ”</p>;
      case 182: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>พูดเสร็จ ร่างนั้นเริ่มคุกเข่าหรืออะไรก็ตามที่ดูทีท่าล้มลง</p>;
      case 183: return (<QuestionWrapper question="คุณคิดว่าคุณมั่นใจในตัวเอง ว่าสามารถช่วยพวกเขาได้มั้ย"><button className={choiceButtonStyle} onClick={() => handleConfidenceChoice('มั่นใจ')}>มั่นใจ</button><button className={choiceButtonStyle} onClick={() => handleConfidenceChoice('ไม่มั่นใจ')}>ไม่มั่นใจ</button></QuestionWrapper>);
      case 190: return <p className={textBaseStyle} style={fluidTextStyle}>สิ้นเสียงและท่าทางขอร้อง คุณรู้สึกสงสารพวกเขาบ้าง</p>;
      case 191: return <p className={textBaseStyle} style={fluidTextStyle}>แต่ยังไงคุณก็ต้องกลับ เพราะคุณเองก็ไม่รู้จะช่วยได้มั้ย และคุณก็ไม่ได้เกี่ยวข้องกับที่แห่งนี้</p>;
      case 192: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“คือ..เราไม่ได้เกี่ยวข้องกับที่แห่งนี้ ต้องขอโทษด้วยนะ แต่คงช่วยอะไรพวกคุณไม่ได้”</p>;
      case 193: return <p className={textBaseStyle} style={fluidTextStyle}>คุณตอบด้วยความไม่มั่นใจ และไม่รู้จะช่วยพวกเขายังไง</p>;
      case 194: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“อืม เราเข้าใจคุณนะ และหากทำได้เราคงส่งคุณ..กลับไป”</p>;
      case 195: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“การสร้างอุโมงค์ข้ามมิติต้องใช้พลังงานเป็นจำนวนมมากในตอนนี้พลังงานมีให้ใช้แค่ไม่กี่ชั่วโมงเท่านั้น…”</p>;
      case 196: return <p className={textBaseStyle} style={fluidTextStyle}>ตรงจุดนี่คุณเริ่มคิดได้และรู้สึกผิดที่บอกแบบนั้นไป</p>;
      case 200: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“เอาอย่างนั้นก็ได้” คุณตัดสินใจตอบจะช่วยอีกฝ่าย</p>;
      case 201: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“คุณจะช่วยพวกเราจริง ๆ หรอ”</p>;
      case 202: return (<QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(203)}>“แน่นอน แล้วต้องทำอะไรบ้าง”</button></QuestionWrapper>);
      case 203: return <p className={textBaseStyle} style={fluidTextStyle}>ร่างนั้นค่อย ๆ ลุกขึ้นพร้อมสีที่เริ่มจางใสขึ้น</p>;
      case 204: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“งั้นขอให้คุณโปรดฟังเราอธิบายแล้วเดินตามเรามา…”</p>;
      case 205: return <p className={textBaseStyle} style={fluidTextStyle}>คุณพยักหน้ารับอีกฝ่ายแล้วเดินตามเขาไป</p>;
      case 206: return <p className={textBaseStyle} style={fluidTextStyle}>คุณทั้งสองได้มาถึงสถานที่แห่งหนึ่งที่ไม่ไกลจากที่นี้นัก</p>;
      case 207: {
        const compliments = ["คุณทำได้ดีเลย เรามาพยายามไปพร้อมกันนะ", "(ขอบคุณอีกฝ่ายในใจ)", "(เขาจะพาเราไปไหนกันนะ เตรียมตัวไว้ดีกว่า)", "(เงียบเฉย ไม่ได้สนใจ)"];
        return (<QuestionWrapper question="คุณที่เห็นการเตรียมตัวและการจัดการของร่างนี้จึงอยากชม จึงชมเขาว่า">{compliments.map(c => (<button key={c} className={choiceButtonStyle} onClick={() => handleMultiChoice(setCompliment, c, 208)}>{c}</button>))}</QuestionWrapper>);
      }
      case 208: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“เอาล่ะ เรามาถึงกันแล้ว”</p>;
      case 209: return <p className={textBaseStyle} style={fluidTextStyle}>ตรงหน้าของคุณคือบ่อขนาดใหญ่ที่ดูลึกและไร้ที่สิ้นสุด</p>;
      case 210: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ต้องโดดลงไปจริง ๆ ใช่มั้ย"</p>;
      case 211: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ใช่ ตามที่เราคุยกันก่อนหน้านี้ ไม่ต้องห่วง คุณจะปลอดภัยด้วยพลังที่คุณมี"</p>;
      case 212: return (<QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(213)}>“นี่เดิมพันด้วยชีวิตเลยนะ”</button></QuestionWrapper>);
      case 213: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“พวกเราเอง..ก็เดิมพันด้วยชีวิตเช่นกัน"</p>;
      case 214: return (<QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(215)}>“ถ้างั้น…ขอให้เราช่วยพวกคุณได้”</button></QuestionWrapper>);
      case 215: return <p className={textBaseStyle} style={fluidTextStyle}>คุณหันมามองอีกฝ่ายพร้อมเดินไปที่หน้าบ่อยักษ์นั้น</p>;
      case 216: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“ขอให้ทุกอย่างสำเร็จผล ขอให้คุณโชคดี”อีกพยักหน้าฝ่ายตอบกลับคุณ</p>;
      case 217: return <p className={textBaseStyle} style={fluidTextStyle}>ก่อนที่คุณจะโดดลงบ่อยักษ์นั่นไป และสติก็ได้ดับอีกครั้งจากแรงรอบตัวคุณ</p>;
      case 218: return <p className={textBaseStyle} style={fluidTextStyle}>......</p>;
      case 219: return <p className={textBaseStyle} style={fluidTextStyle}>…..</p>;
      case 220: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>‘บันทึกบอกว่า การที่พลังคุณตื่น จะต้องอยู่ในสถานการณ์ที่เสี่ยงและคุณได้อยู่กับตัวเองอย่างสงบโดยแท้จริง‘</p>;
      case 221: return <p className={textBaseStyle} style={fluidTextStyle}>เสียงของร่างสีขาวนั่นดังในหัว ทำให้คุณได้สติ</p>;
      case 222: return <p className={textBaseStyle} style={fluidTextStyle}>นั่นคือการพูดคุยกันตอนระหว่างเดินทางมาที่นี่</p>;
      case 223: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>‘อาจมีบททดสอบสำหรับคุณในการช่วยพวกเรานะ’</p>;
      case 224: return <p className={textBaseStyle} style={fluidTextStyle}>เสียงของร่างสีขาวนั้นดังขึ้นในหัวอีกครั้ง</p>;
      case 225: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“หลังจากนี้ ขอให้ท่านซื่อสัตย์ในตัวเอง..”</p>;
      case 226: return (<QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(227)}>“นั่นเสียงใครน่ะ”</button></QuestionWrapper>);
      case 227: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“โปรดซื่อสัตย์ต่อตัวเอง และตอบคำถามอย่างตรงไปตรงมา”</p>;
      case 228: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>“ได้ งั้นลองถามมา” คุณได้ตะโกนกลับไป</p>;
      case 229: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ก่อนที่จะให้รู้คำถาม ขอบอกไว้เลยนะว่า ตัวท่านเองไม่สามารถช่วยอะไรได้อีกต่อไปแล้ว ท่านเข้าใจใช่มั้ย"</p>;
      case 230: return <QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(231)}>"ห้ะ" คุณถามด้วยความตกใจ</button></QuestionWrapper>;
      case 231: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ท่านช่วยอะไรไม่ได้อีกแล้ว ไม่มีประโยชน์อีกต่อไป"</p>;
      case 232: return <p className={textBaseStyle} style={fluidTextStyle}>สิ้นเสียงนั้นทุกอย่างในใจคุณสับสนเป็นอย่างมาก</p>;
      case 233: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"การที่ท่านมาที่นี่นั่นมันสายเกินไป สายเกินที่จะแก้ไขแล้ว ตอนนี้ทุกอย่างจบสิ้น และท่านก็ยังคงล้มเหลว เสียใจด้วยนะ"</p>;
      case 234: {
        const truthFeelings = ["สิ้นหวังและหมดหนทาง", "ผิดหวังในตัวเองอย่างรุนแรง", "โกรธที่ควบคุมไม่ได้จากการต่อว่าว่าล้มเหลว", "รู้สึกชาและว่างเปล่า", "สับสนที่ไม่อาจเข้าใจ"];
        return (<QuestionWrapper question="'นี่ทำให้ตัวคุณรู้สึกแบบเดียวกับตอนก่อนที่คุณจะมาที่นี่และการเผชิญกับเรื่องราวในชีวิต' ในตอนนี้ท่านรู้สึกอย่างไรเมื่อได้ยินถ้อยคำความจริงดังกล่าว">
          {truthFeelings.map(q => (<button key={q} className={choiceButtonStyle} onClick={() => handleMultiChoice(setFeelingAfterTruth, q, 235)}>{q}</button>))}
        </QuestionWrapper>);
      }
      case 235: {
        const bodySignals = ["รู้สึกอ่อนล้า อ่อนเพลียจนไม่อยากทำอะไรเลย อยากหลับหนีไปให้พ้นจากทุกสิ่ง", "ปวดหัว ปวดตามตัว หรือรู้สึกแน่นหน้าอก", "ร่างกายเรียกร้องให้หยุดพัก ให้ทุกอย่างสงบลง อยากทิ้งทุกอย่างไว้ชั่วขณะ", "กินไม่ได้ นอนไม่หลับ หรือทำกิจกรรมที่เคยชอบแล้วไม่รู้สึกสนุกอีกต่อไป"];
        return (<QuestionWrapper question="แล้วร่างกายของพยายามบอกอะไรกับท่านมากที่สุด? ทั้งในตอนนี้ และสถานการณ์ที่ท่านเหน็ดเหนื่อยเกินบรรยาย">
          {bodySignals.map(q => (<button key={q} className={choiceButtonStyle} onClick={() => handleMultiChoice(setBodySignal, q, 236)}>{q}</button>))}
        </QuestionWrapper>);
      }
      case 236: {
          const thoughts = [
              "เรามันไม่เอาไหน ไม่มีความสามารถ ไม่คู่ควรกับสิ่งดีๆ", 
              "ไม่มีใครเข้าใจในสิ่งที่เราเป็น ไม่มีใครสนใจหรอกว่าฉันรู้สึกยังไง", 
              "อยากหายไปจากตรงนี้ ไม่ต้องรับรู้อะไรอีกแล้ว", // <-- แก้ไขตรงนี้
              "ทุกอย่างมันผิดที่ตัวเราเองทั้งหมด" // <-- เพิ่มตัวเลือกถ้ามี
          ];
          return (
              <QuestionWrapper question="เมื่อร่างกายาของส่งสัญญาณเตือนเหล่านั้น ...แล้วความคิดอะไรที่มักจะผุดขึ้นมาในหัวของท่านบ่อยที่สุด?">
                  {thoughts.map(q => (
                      <button key={q} className={choiceButtonStyle} onClick={() => handleMultiChoice(setIntrusiveThought, q, 237)}>
                          {q}
                      </button>
                  ))}
              </QuestionWrapper>
          );
      }
      case 237: return <p className={textBaseStyle} style={fluidTextStyle}>ความรู้สึกเหล่านั้นถาโถมใส่คุณ หลังคุณตอบคำถามจากใจจริง</p>;
      case 238: return <p className={textBaseStyle} style={fluidTextStyle}>แม้รอบด้านจะยังคงมืดมิด แต่คุณรู้สึกเหมือนมีบางสิ่งบางอย่างเคลื่อนไหวอยู่ภายในใจ</p>;
      case 239: return <p className={textBaseStyle} style={fluidTextStyle}>ความเจ็บปวดนั้นไม่ได้หายไป แต่กลับชัดเจนขึ้น</p>;
      case 240: return <p className={textBaseStyle} style={fluidTextStyle}>คุณได้ยินเสียงในหัวดังขึ้นอีกครั้ง แต่รอบนี้เป็นเสียงของคุณเองกับร่างสีขาวนั่นคุยกันอีกครั้ง</p>;
      case 241: return <p className={textBaseStyle} style={fluidTextStyle}>.....</p>;
      case 242: return <p className={textBaseStyle} style={fluidTextStyle}>คุณทั้งคู่กำลังเดินไปจุดหมายกันอยู่</p>;
      case 243: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>'แต่ตัวเราเองก็ทำอะไรไม่ได้เลย ที่จักรวาลเรา เราก็แค่คนธรรมดาที่ไม่ได้พิเศษอะไร'</p>;
      case 244: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>'แล้วจำเป็นต้องเป็นคนพิเศษด้วยหรอ'</p>;
      case 245: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>'ก็ไม่หรอก แต่ถ้าเป็นคนที่พิเศษก็คงจะดีกว่านี้ ได้รับการชื่นชม ได้มีคุณค่า และได้การยอมรับ'</p>;
      case 246: return <p className={textBaseStyle} style={fluidTextStyle}>ร่างสีขาวยืนนิ่งแล้วหันมาบอกคุณ</p>;
      case 247: return (
        <div className="text-center">
          <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>'การเป็นคนธรรมดา... ก็ไม่ได้หมายความว่าไร้ซึ่งความหมาย...'</p>
          <p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>'ท้องฟ้าที่กว้างใหญ่... ก็ประกอบจากหยดน้ำฝนที่แสนธรรมดา...'</p>
          <p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>'ผืนป่าที่อุดมสมบูรณ์... ก็เริ่มต้นจากเมล็ดพันธุ์เล็กๆ...'</p>
          <p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>'หรือเครื่องจักรที่ยิ่งใหญ่... ก็ต้องการฟันเฟืองแต่ละน้อยชิ้น'</p>
        </div>
      );
      case 248: return (
        <div className="text-center">
          <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>'คุณน่ะมีค่า ไม่จำเป็นต้องพิเศษถึงมีค่า แต่เพราะเราเป็นคนเราจึงมีค่า'</p>
          <p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>'แค่คุณยังมีชีวิตอยู่ไปซื้อหมูปิ้งหน้าบ้านคุณก็มีค่าต่อแม่ค้า คนเลี้ยงหมู รวมถึงระบบเศรษฐกิจแล้วล่ะ'</p>
        </div>
      );
      case 249: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>'คุณน่ะประเมินค่าตัวเองต่ำเกินไป และถึงแม้คุณจะไม่สามารถช่วยพวกเราได้ คุณก็ยังคงมีค่าเสมอ'</p>;
      case 250: return <p className={textBaseStyle} style={fluidTextStyle}>ร่างสีขาวบอกคุณทั้งหมด คุณเองก็ยิ้มตอบเขาเล็กน้อย</p>;
      case 251: return <p className={textBaseStyle} style={fluidTextStyle}>.....</p>;
      case 252: return <p className={textBaseStyle} style={fluidTextStyle}>นั่นสิ แค่การที่ไอนั่นบอกเราทำอะไรไม่ได้ ไม่ได้แปลว่าเราจะทำอะไรไม่ได้จริง ๆ นิ</p>;
      case 253: return <p className={textBaseStyle} style={fluidTextStyle}>นี่น่าจะเป็นบททดสอบแบบที่เขาว่า</p>;
      case 254: return <QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(255)}>"แล้วยังไงต่อล่ะ"</button></QuestionWrapper>;
      case 255: return <p className={textBaseStyle} style={fluidTextStyle}>เสียงในหัวก็ดังขึ้นอีกครั้ง... คราวนี้เป็นเสียงที่มั่นคงและชัดเจนยิ่งกว่าเดิม</p>;
      case 256: {
        const reactionChoices = ["โกรธกับคำพูดนั้น ไม่เชื่อว่าตัวเองไร้ค่า และจะไม่มีวันเปลี่ยนแปลงอะไรไม่ได้", "คำพูดนั้นมันเจ็บปวด...แต่มันคือความจริงใช่ไหม...ก็ควรจะยอมรับมันดีกว่า", "สับสน ไม่รู้จะเชื่ออะไรดี เรามีค่าจริงๆ ใช่ไหม? อยากให้ใครซักคนมายืนยันสิ่งนั้น", "เสียใจกับตัวเองที่ต้องมาได้ยินอะไรแบบนี้ และหมดกำลังใจที่จะทำอะไรต่อแล้ว"];
        return (<QuestionWrapper question="ยอมรับเถอะ... ตอนนั้นเองท่านรู้สึกอย่างไร... เมื่อได้ยินความจริงอันน่าสมเพชนี้? ที่ท่านเอง ไม่สามารถทำอะไรได้อีกต่อไป">
          {reactionChoices.map(q => (<button key={q} className={choiceButtonStyle} onClick={() => handleMultiChoice(setReactionToTruth, q, 257)}>{q}</button>))}
        </QuestionWrapper>);
      }
      case 257: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>'ไม่ว่าคนอื่นจะมองคุณอย่างไร แต่คุณก็ยังคงเป็นคุณเสมอ'</p>;
      case 258: return <p className={textBaseStyle} style={fluidTextStyle}>เสียงของร่างสีขาวดังขึ้นอีกครั้ง</p>;
      case 259: return <p className={textBaseStyle} style={fluidTextStyle}>...</p>;
      case 260: return <p className={textBaseStyle} style={fluidTextStyle}>รอบนี้คุณเริ่มเข้าใจในตัวเองมากขึ้น</p>;
      case 261: return <p className={textBaseStyle} style={fluidTextStyle}>แสงในความมืดมิดดูเหมือนจะทอแสงแรงขึ้น</p>;
      case 262: return <p className={textBaseStyle} style={fluidTextStyle}>คุณรู้สึกถึงการเชื่อมโยงที่ชัดเจนระหว่างความคิด ความรู้สึก และร่างกายของตัวเอง</p>;
      case 263: return <p className={textBaseStyle} style={fluidTextStyle}>และเสียงในหัวก็ดังขึ้น คราวนี้มันดูเหมือนจะ "ยอมรับ" คุณมากขึ้น</p>;
      case 264: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ความเข้าใจ... คือก้าวแรก... แต่การจะปลดปล่อยตัวเองอย่างแท้จริง ท่านต้องเรียนรู้ 'วิธีควบคุม' พลังที่อยู่ภายใน ที่อาจก่อตัวเป็น 'โซ่ตรวน' ที่มองไม่เห็น..."</p>;
      case 265: return <p className={textBaseStyle} style={fluidTextStyle}>สรุปเจ้าเสียงนี้คือ แอบ ๆ ช่วยเราสินะเนี่ย</p>;
      case 266: return <p className={textBaseStyle} style={fluidTextStyle}>แต่คำถามก็แอบแปลก ๆ คำถามแบบนี้จะช่วยจักรวาลยังไง</p>;
      case 267: {
        const fatigueResponses = ["จะยอมหยุดพักจากทุกสิ่ง ให้ร่างกายและจิตใจได้พักผ่อนอย่างเต็มที่ ไม่ฝืน", "จะหาทางระบายความรู้สึกนั้นออกมา อาจจะเขียนบันทึก ดูหนัง เล่นเกม ฟังเพลง หรือพูดคุยกับคนที่ไว้ใจ", "จะเผชิญหน้ากับความรู้สึกนั้น พยายามทำความเข้าใจต้นตอของมัน และหาวิธีแก้ไขปัญหาที่แท้จริง", "เรียนรู้ที่จะปฏิเสธในสิ่งที่ไม่ไหว หรือสิ่งที่ไม่ส่งผลดีต่อจิตใจตัวเอง"];
        return (<QuestionWrapper question="คำถามต่อไปคือ เมื่อความเหนื่อยล้าคืบคลานกลับมาเยือน... ท่านจะเลือก 'วิธีตอบสนอง' อย่างไร เพื่อไม่ให้มันฉุดรั้งตัวเองไว้?">
          {fatigueResponses.map(q => (<button key={q} className={choiceButtonStyle} onClick={() => handleMultiChoice(setResponseToFatigue, q, 268)}>{q}</button>))}
        </QuestionWrapper>);
      }
      case 268: return <p className={textBaseStyle} style={fluidTextStyle}>แสงเรืองรองรอบกายดูเหมือนจะส่องประกายชัดเจนและมั่นคงขึ้น คุณรู้สึกถึงความแข็งแกร่งภายในที่เริ่มก่อตัวขึ้น ราวกับได้พบกับ 'กุญแจ' ที่ซ่อนอยู่</p>;
      case 269: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"การเลือกที่จะ 'ตอบสนอง' อย่างมีสติ คือพลังที่แท้จริง ที่จะทำให้ท่านไม่ถูกอารมณ์เชิงลบนั้นกลืนกิน"</p>;
      case 270: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"จงอย่าปล่อยให้มันเป็นผู้ควบคุมอีกต่อไป" เสียงนั้นพูดเชิงเชยชม</p>;
      case 271: {
        const energySources = ["ได้อยู่ท่ามกลางธรรมชาติ สัมผัสแสงแดด สายลม หรือเสียงของต้นไม้ใบหญ้า", "ได้กลับไปทำสิ่งที่รัก หรืองานอดิเรกที่ทำให้ลืมความกังวลและได้อยู่กับตัวเอง", "การได้ระบายหรือพูดคุยกับคนที่ไว้ใจ คนที่รับฟังและเข้าใจ โดยไม่ตัดสิน", "การได้อยู่เงียบๆ คนเดียว ทำสมาธิ อ่านหนังสือ หรือฟังเพลงที่ผ่อนคลาย"];
        return (<QuestionWrapper question="แล้วในวันที่ 'พลังชีวิต' ของท่านไม่เหลือ และรู้สึกว่าแสงภายในกำลังจะดับลง... อะไรคือ 'แหล่งพลังงาน' เล็กๆ น้อยๆ ที่จะช่วยให้ท่านได้กลับมาเติมเต็มตัวเอง และพร้อมที่จะก้าวต่อไปได้อีกครั้ง?">
          {energySources.map(q => (<button key={q} className={choiceButtonStyle} onClick={() => handleMultiChoice(setEnergySource, q, 272)}>{q}</button>))}
        </QuestionWrapper>);
      }
      case 272: return <p className={textBaseStyle} style={fluidTextStyle}>...</p>;
      case 273: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>'รักตัวเองไม่เท่ากับการเห็นแก่ตัวนะ รักตัวเองได้ดีก็สามารถรักคนอื่นได้ดีเช่นกัน'</p>;
      case 274: return <p className={textBaseStyle} style={fluidTextStyle}>เสียงจากร่างสีขาวได้เข้ามาในหัวอีกครั้ง</p>;
      case 275: return <p className={textBaseStyle} style={fluidTextStyle}>...</p>;
      case 276: return <p className={textBaseStyle} style={fluidTextStyle}>แสงเรืองรองรอบกายคุณก็สว่างเจิดจ้ายิ่งขึ้น จนคุณรู้สึกเหมือนกำลังยืนอยู่ใน 'วงกลมแห่งพลัง' ที่มั่นคงและอบอุ่น</p>;
      case 277: return <p className={textBaseStyle} style={fluidTextStyle}>ความสงบและพลังงานไหลเวียนอยู่ในตัวคุณอย่างเต็มเปี่ยม</p>;
      case 278: return (
              <div className="text-center">
                <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ยอดเยี่ยม ท่านได้พบ 'แหล่งพลัง' ของตัวเองแล้ว"</p>
                <p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>"พลังที่จะช่วยฟื้นฟูจิตใจและทำให้ท่าน 'ยืนหยัด' ได้แม้ในยามที่จิตใจมืดมิด"</p>
                <p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>"ภารกิจ 'การควบคุมอารมณ์ตนเอง' ได้สำเร็จแล้ว"</p>
              </div>
            );
      // ...existing>"ยอดเยี่ยม ท่านได้พบ 'แหล่งพลัง' ของตัวเองแล้ว พลังที่จะช่วยฟื้นฟูจิตใจและทำให้ท่าน 'ยืนหยัด' ได้แม้ในยามที่จิตใจมืดมิด ภารกิจ 'การควบคุมอารมณ์ตนเอง' ได้สำเร็จแล้ว"</p>;
      case 279: return <QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(280)}>"แล้วการควบคุมอารมณ์ตัวเองเกี่ยวอะไรกับสิ่งที่เราต้องทำอะ"</button></QuestionWrapper>;
      case 280: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"การควบคุมอารมณ์ตัวเองก็เปรียบเสมือนการเข้าถึงตัวตนท่านเอง หากต้องการพลังที่จะเปลี่ยนแปลง ก็ต้องเริ่มที่ตัวท่าน จากข้างใน"</p>;
      case 281: return <p className={textBaseStyle} style={fluidTextStyle}>คุณเริ่มดำดิ่งไปเรื่อย ๆ กับสถานการณ์รอบข้างที่เริ่มเปลี่ยนแปลง</p>;
      case 282: return <p className={textBaseStyle} style={fluidTextStyle}>นี่อาจเป็นครึ่งทางแล้ว</p>;
      case 283: {
        const helpChoices = ["เพียงแค่ได้รับการโอบกอดอย่างอ่อนโยน และมีใครสักคนรับฟังความเจ็บปวด โดยไม่ตัดสิน", "ต้องการใครสักคนมายืนยันว่าเเรายังมีคุณค่า ไม่ว่าเราจะเคยทำอะไรผิดพลาดมาแค่ไหนก็ตาม", "ต้องการคำแนะนำที่ชัดเจนว่าจะต้องทำอย่างไร เพื่อให้หลุดพ้นจากความทุกข์ทรมานนี้", "อยากได้รับโอกาสในการให้อภัยตัวเอง และโอกาสในการเริ่มต้นชีวิตใหม่ที่ดีกว่า"];
        return (<QuestionWrapper question="จงหลับตาลง... แล้วจินตนาการถึงร่างสีขาวโพลนที่เคยพบ... ร่างนั้นที่บอบบางและใกล้สลาย... หากท่านคือร่างนั้น ในห้วงเวลาที่สิ้นหวังที่สุด เธออยากจะได้รับ 'ความช่วยเหลือ' หรือ 'คำพูด' แบบไหนมากที่สุด?">
          {helpChoices.map(q => (<button key={q} className={choiceButtonStyle} onClick={() => handleMultiChoice(setHelpForWhiteFigure, q, 284)}>{q}</button>))}
        </QuestionWrapper>);
      }
      case 284: {
        const messageChoices = ["อยากจะบอกว่า 'ให้อภัยคุณแล้ว... เรายอมรับในทุกสิ่งที่เป็น... ไม่ว่าคุณจะเป็นอย่างไรก็ตาม'", "อยากจะบอกว่า 'คุณมีค่าเสมอ... ไม่จำเป็นต้องพิเศษ... เรารักคุณในแบบที่คุณเป็น'", "อยากจะบอกว่า 'คุณเข้มแข็งมากที่ผ่านเรื่องราวมาได้ถึงตรงนี้... จงเติบโตไปข้างหน้าด้วยกันนะ'", "ฉันอยากจะบอกว่า 'เราเข้าใจทุกความเจ็บปวดของคุณ... เราจะอยู่เคียงข้างคุณเสมอ... ไม่ว่าอะไรจะเกิดขึ้น'"];
        return (<QuestionWrapper question="ตอนนี้... เมื่อท่านได้เข้าใจความรู้สึกของ 'ตัวตนที่บอบบาง' นั้นแล้ว... หากเธอสามารถส่ง 'คำพูด' หรือ 'ความรู้สึก' ใดไปให้เขาได้ในตอนนี้... ท่านอยากจะบอกอะไรกับ 'เขา' มากที่สุด... เพื่อโอบกอดและเยียวยาความเจ็บปวดเหล่านั้น?">
          {messageChoices.map(q => (<button key={q} className={choiceButtonStyle} onClick={() => handleMultiChoice(setMessageToPastSelf, q, 285)}>{q}</button>))}
        </QuestionWrapper>);
      }
      case 285: return <p className={textBaseStyle} style={fluidTextStyle}>เมื่อคุณเลือกคำตอบ... 'ร่างสีขาวโพลน' ที่อยู่รอคุณก็เริ่มทอประกายแสงสีทองอ่อนๆ คล้ายกำลังได้รับการเยียวยาอย่างสมบูรณ์</p>;
      case 286: return <p className={textBaseStyle} style={fluidTextStyle}>ร่างนั้นค่อยๆ มีชีวิตชีวาและเป็นรูปเป็นร่างมากขึ้น... คุณรู้สึกถึงความรักและความเมตตาที่เอ่อล้นอยู่ในใจ</p>;
      case 287: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ความเมตตาและความเข้าใจที่มอบให้... คือพลังที่จะประสานรอยร้าว... ภารกิจ 'การเข้าใจอารมณ์ผู้อื่น' ได้สำเร็จแล้ว"</p>;
      case 288: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ยินดีด้วย ท่านได้ค้นพบ 'ตัวตนที่แท้จริง' ที่สมบูรณ์แล้ว"</p>;
      case 289: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"แต่การจะรักษาสมดุลของ 'จักรวาล' แห่งนี้ไว้... ท่านต้องเรียนรู้ 'วิธีปฏิสัมพันธ์' กับ 'ตัวตนที่สมบูรณ์' นี้ เพื่อให้แสงสว่างนี้คงอยู่ตลอดไป..."</p>;
      case 290: {
        const creationChoices = ["อยากใช้เรื่องราวและประสบการณ์ที่ได้เรียนรู้ มาเป็นแรงบันดาลใจให้ผู้อื่น ให้พวกเขากล้าที่จะรักและเข้าใจตัวเอง", "อยากนำพลังและความสุขที่ได้กลับมานี้ ไปสร้างสรรค์ผลงานใหม่ๆ ที่เป็นประโยชน์ หรือทำให้ผู้อื่นมีความสุข", "อยากนำความเข้าใจในตัวเองไปใช้กับการดูแลความสัมพันธ์กับคนรอบข้างให้แข็งแรงและมีความสุขยิ่งขึ้น", "อยากใช้พลังทั้งหมดนี้ เพื่อก้าวไปสู่เป้าหมายที่แท้จริงของชีวิต ที่ค้นพบในภารกิจนี้ โดยไม่ลังเลอีกต่อไป"];
        return (<QuestionWrapper question="เมื่อ 'จักรวาล' หรือตัวตนภายในของท่านสมบูรณ์ และเต็มไปด้วยพลัง ท่านจะใช้พลังนี้เพื่อ 'สร้างสรรค์' หรือ 'แบ่งปัน' สิ่งใด ให้กับโลกที่แท้จริงของท่าน?">
          {creationChoices.map(q => (<button key={q} className={choiceButtonStyle} onClick={() => handleMultiChoice(setCreativeUseOfPower, q, 291)}>{q}</button>))}
        </QuestionWrapper>);
      }
      case 291: return (
        <div className="text-center">
          <p className={textBaseStyle} style={fluidTextStyle}>เมื่อคุณเลือกคำตอบ... แสงสว่างจ้าจาก 'ตัวตนที่สมบูรณ์' ของคุณก็แผ่ขยายออกไปอย่างไร้ขีดจำกัด</p>
          <p className={textBaseStyle} style={{...fluidTextStyle, marginTop: '0.5rem'}}>โอบล้อม 'จักรวาล' ทั้งหมดที่เคยแตกร้าวให้กลับมาสมบูรณ์และงดงามอีกครั้ง</p>
        </div>
      );      
      case 292: return <p className={textBaseStyle} style={fluidTextStyle}>คุณรู้สึกถึงความสมดุล ความสุข และความภาคภูมิใจที่ไม่อาจบรรยายได้... ในที่สุด 'จักรวาล' แห่งนี้ก็ได้ถูกกอบกู้โดยตัวคุณเอง!</p>;
      case 293: return <p className={textBaseStyle} style={fluidTextStyle}>ก่อนที่คุณจะรู้สึกตัวอีกที คุณก็ได้กลับมาที่เดิม ที่ที่คุณนั้นมาที่นี้ครั้งแรก</p>;
      case 294: return <p className={textBaseStyle} style={fluidTextStyle}>สภาพแวดล้อมต่าง ๆ นั้นเริ่มค่อย ๆ ฟื้นฟู</p>;
      case 295: return <p className={textBaseStyle} style={fluidTextStyle}>ท้องฟ้าเริ่มกลับมีฟ้าครามปกติ</p>;
      case 296: return <p className={textBaseStyle} style={fluidTextStyle}>เมฆและหมอกหนาได้หายไป</p>;
      case 297: return <p className={textBaseStyle} style={fluidTextStyle}>สิ่งที่ลอยบนฟ้านั้นก็ไม่มีอีกแล้ว</p>;
      case 298: return <p className={textBaseStyle} style={fluidTextStyle}>หรือนี่ทุกอย่างจะจบแล้วอย่างนั้นหรอ</p>;
      case 299: return <p className={textBaseStyle} style={fluidTextStyle}>ในขณะที่คุณมองสถานการณ์ที่กำลังเกิด หางตาคุณได้เห็นร่างเล็ก ๆ ที่เหมือนยืนรอ และมองคุณอยู่</p>;
      case 300: return <p className={textBaseStyle} style={fluidTextStyle}>คุณเดินเข้าไปหา แต่ร่างนั้น มีหน้าตาที่คุ้น ๆ</p>;
      case 301: return <p className={textBaseStyle} style={fluidTextStyle}>ร่างเล็ก ๆ อายุน่าจะราว ๆ ไม่เกินแปดถึงเก้าขวบ หน้าตาเหมือนคุณในตอนเด็กเลยก็ว่าได้</p>;
      case 302: return <p className={textBaseStyle} style={fluidTextStyle}>มันทำให้คุณนึกถึงตัวเองวัยเด็กในเสี้ยววิที่สบตา</p>;
      case 303: return <InputWrapper question="คุณคิดว่าเด็กคนนี้กำลังรู้สึกอะไรในตอนนั้น" value={childFeelingGuess} setter={setChildFeelingGuess} handleTextInputSubmit={handleTextInputSubmit} nextStep={304} />;
      case 304: return <p className={textBaseStyle} style={fluidTextStyle}>เด็กคนนี้ตอนนี้กำลัง{childFeelingGuess}</p>;
      case 305: return <p className={textBaseStyle} style={fluidTextStyle}>ก่อนที่คุณจะได้พูดอะไร เด็กคนนี้ก็ได้เริ่มถามคุณก่อน</p>;
      case 306: return <InputWrapper question="โตขึ้นแล้ว ยังได้ทำตามที่พวกเราฝันหรือเปล่า" value={dreamAnswer} setter={setDreamAnswer} handleTextInputSubmit={handleTextInputSubmit} nextStep={307} />;
      case 307: return <p className={textBaseStyle} style={fluidTextStyle}>"งั้นหรอ... อืม" เด็กคนนั้นพยักหน้ารับเบา ๆ</p>;
      case 308: return <InputWrapper question="แล้วมีความสุขมั้ยที่ได้โตขึ้น" value={happinessAnswer} setter={setHappinessAnswer} handleTextInputSubmit={handleTextInputSubmit} nextStep={309} />;
      case 309: return <p className={textBaseStyle} style={fluidTextStyle}>"{happinessAnswer}" สินะ</p>;
      case 310: return (
              <div className="text-center">
                <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"แต่เราเองก็ไม่รู้ว่าจะโตได้แบบพี่หรือเปล่า ทางข้างหน้าน่าจะยากเย็นแสนเข็ญ คงมีสุขและทุกข์วนกัน"</p>
                <p className={`${textBaseStyle} italic`} style={{...fluidTextStyle, marginTop: '0.5rem'}}>"เราเองรู้สึกกลัว.. ..กลัวว่าจะรับมือมันไม่ได้ และคงทำได้ไม่ดีเท่าพี่"</p>
              </div>
            );      
      case 311: return <p className={textBaseStyle} style={fluidTextStyle}>เด็กคนนั้นพูดด้วยน้ำเสียงเศร้าสร้อย</p>;
      case 312: return <InputWrapper question="คุณอยากบอกเด็กคนนี้ว่าอะไร" value={messageToChildSelf} setter={setMessageToChildSelf} handleTextInputSubmit={handleTextInputSubmit} nextStep={313} />;
      case 313: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ขอบคุณนะ"</p>;
      case 314: return <p className={textBaseStyle} style={fluidTextStyle}>เด็กคนนั้นเริ่มยิ้ม ก่อนที่จะพูดต่อ</p>;
      case 315: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"พี่เองก็อย่ายอมแพ้นะ เพราะเราเองก็จะไม่ยอมแพ้ พี่น่ะ เก่งที่สุดแล้ว เราจะสู้ไปพร้อมกันกับพี่ และถึงตอนนั้น เราจะได้พบกันอีกครั้ง"</p>;
      case 316: return <p className={textBaseStyle} style={fluidTextStyle}>เด็กคนนั้นพูดด้วยความมั่นใจและอมยิ้มให้</p>;
      case 317: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ถ้าหากพี่ท้อ หรือเริ่มหมดแรง เราอยากจะบอกพี่ว่า '${messageToChildSelf}'"</p>;
      case 318: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ไปก่อนนะ แล้วเจอกัน...ลาก่อนพี่ ${name}"</p>;
      case 319: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"คุณ เป็นอะไรรึเปล่า"</p>;
      case 320: return <p className={textBaseStyle} style={fluidTextStyle}>เมื่อลืมตาอีกที คุณก็ยืนต่อหน้าร่างสีขาวนั้น ที่ตอนนี้มีหน้าและตา อวัยวะครบถ้วนสมบูรณ์</p>;
      case 321: return <p className={textBaseStyle} style={fluidTextStyle}>เมื่อคุณมองไปรอบ ๆ เพื่อหาเด็กคนนั้น คุณก็ไม่พบเขาอีกเลย</p>;
      case 322: return <p className={textBaseStyle} style={fluidTextStyle}>แต่คุณเห็นรอบข้างนั้นเริ่มมีชีวิตชีวา เริ่มเห็นผู้คนที่เดินเตร่กันไปมา สิ่งก่อสร้างเข้าที่ ธรรมชาติเริ่มปกติ</p>;
      case 323: return <p className={textBaseStyle} style={fluidTextStyle}>ราวกับว่าไม่เคยมีอะไรเกิดขึ้น</p>;
      case 324: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"นี่แหละคือสภาพความเป็นอยู่ของพวกเราก่อนหน้านี้ แต่ทุกคนคงไม่รู้ตัว ว่าหายนะได้เริ่มเกิดไปแล้ว"</p>;
      case 325: return <p className={textBaseStyle} style={fluidTextStyle}>ร่างสีขาวที่ตอนนี้มีหน้ามีตา แม้รอบนี้ จะไม่ได้หน้าเหมือนคุณ ตามที่คุณคิด แต่ก็ดีแล้วแหละอย่าหน้าเหมือนเยอะเลย</p>;
      case 326: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ยังไงก็ตาม..เรา ในฐานะที่เป็นคนของจักรวาลนี้ เราขอขอบคุณแทนทุกคนที่คุณช่วยเรา เสียดายที่เราไม่มีอะไรจะให้ตอบแทนคุณเลย"</p>;
      case 327: return <QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(328)}>"ขอแค่ส่งเรากลับบ้านเดิมก็พอแล้วล่ะ"</button></QuestionWrapper>;
      case 328: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"ไม่ว่าอย่างไร ถึงแม้ตอนนี้คนอื่นจะยังจำคุณไม่ได้ แต่พวกเขาจะเริ่มจำได้จากเศษเสี้ยวของพลัง"</p>;
      case 329: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"คุณจะเป็นผู้มีคุณูปการต่อพวกเราเป็นอย่างมาก"</p>;
      case 330: return <p className={textBaseStyle} style={fluidTextStyle}>คุณยิ้มรับ ในตอนนี้ ทุกอย่างกลับมาดีขึ้นแล้ว ไม่เพียงแต่สภาพแวดล้อม แต่นั้นรวมถึงตัวคุณเองด้วย</p>;
      case 331: return <p className={textBaseStyle} style={fluidTextStyle}>การเดินทางนี้ทำให้คุณเข้าใจอะไรบ้าง เกี่ยวคุณค่าของตัวเอง และการรักตัวเองนั้น มันมีค่าเพียงใด ทั้งต่อผู้อื่น และตัวเอง</p>;
      case 332: return <p className={textBaseStyle} style={fluidTextStyle}>ถึงอย่างนั้นคุณก็ยังไม่ค่อยเข้าใจ ว่าทำไมต้องเป็นคุณถึงช่วยที่นี้ได้</p>;
      case 333: return <p className={textBaseStyle} style={fluidTextStyle}>คนอื่นในจักรวาลคุณก็อาจทำได้เหมือนกัน เป็นเรื่องที่น่าสงสัย</p>;
      case 334: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"เราได้สร้างประตูขนาดย่อม ๆ ให้แล้วนะ มันจะเปิดเป็นเวลาสั้น ๆ เลยไม่กินพลังเรามาก"</p>;
      case 335: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>"เอาล่ะ ขอให้คุณดูแลตัวคุณเองด้วยนะ"</p>;
      case 336: return <p className={textBaseStyle} style={fluidTextStyle}>คุณพยักหน้ารับ กอปรกับนึกขึ้นอย่างหนึ่งได้</p>;
      case 337: return <QuestionWrapper question=""><button className={singleChoiceButtonStyle} onClick={() => advanceToNextStep(338)}>"ว่าแต่ คุณชื่ออะไรหรอ"</button></QuestionWrapper>;
      case 338: return <p className={textBaseStyle} style={fluidTextStyle}>อีกฝ่ายยิ้มตอบ แล้วพูดด้วยสีหน้ายิ้มแย้มให้ พร้อมเอากระดาษแผ่นเล็ก ๆ จับใส่มือคุณ</p>;
      case 339: return <p className={`${textBaseStyle} italic`} style={fluidTextStyle}>เราชื่อ {name}</p>;
      case 340: return <p className={textBaseStyle} style={fluidTextStyle}>ก่อนที่จะงงและจะได้บอกลาคนตรงหน้า คุณก็ถูกดึงดูดด้วยแรงดึงดูดของประตูนั้นเข้าไปแล้ว...</p>;
      case 341: return <p className={textBaseStyle} style={fluidTextStyle}>.....</p>;
      case 342: return <p className={textBaseStyle} style={fluidTextStyle}>06.58</p>;
      case 343: return <p className={textBaseStyle} style={fluidTextStyle}>06.59</p>;
      case 344: return <p className={textBaseStyle} style={fluidTextStyle}>07.00</p>;
      case 345: return <p className={textBaseStyle} style={fluidTextStyle}>เสียงนาฬิกาปลุกดังขึ้น กับเช้าวันใหม่ที่ผ่านไปอย่างรวดเร็ว</p>;
      case 346: return <p className={textBaseStyle} style={fluidTextStyle}>วันนี้คือวันศุกร์ และคุณยังคงมีเรื่องที่คุณต้องทำ</p>;
      case 347: return <p className={textBaseStyle} style={fluidTextStyle}>สรุปแล้วนี่คงเป็นฝันที่ยาวนานที่สุดที่คุณเคยฝัน มันทั้งเหมือนจริงและเหมือนคุณอยู่ที่นั้นจริง ๆ</p>;
      case 348: return <p className={textBaseStyle} style={fluidTextStyle}>แต่ถึงจะแค่ฝัน คุณก็รู้เริ่มสบายภายใน 'ตัวตน' ขึ้นมาบ้าง</p>;
      case 349: return <p className={textBaseStyle} style={fluidTextStyle}>คุณค่าต่าง ๆ ที่ได้รับในฝัน มันเริ่มปรับเปลี่ยนมุมมองคุณ ทีละน้อย ทีละน้อย ทีละน้อย</p>;
      case 350: return <p className={textBaseStyle} style={fluidTextStyle}>วันนี้คุณคิดว่าเสร็จทุกอย่างแล้ว คุณอาจจะไปหาอะไรทำ</p>;
      case 351: return <p className={textBaseStyle} style={fluidTextStyle}>ไปเที่ยวซักที่ในวันหยุดที่จะถึง</p>;
      case 352: return <p className={textBaseStyle} style={fluidTextStyle}>พบปะผู้คนบ้าง</p>;
      case 353: return <p className={textBaseStyle} style={fluidTextStyle}>มีอะไรหลายอย่างให้คุณทำ</p>;
      case 354: return <p className={textBaseStyle} style={fluidTextStyle}>รู้สึกดีจริง ๆ</p>;
      case 355: return <p className={textBaseStyle} style={fluidTextStyle}>ในตอนนั้นเอง คุณได้รู้สึกว่ามีกระดาษอะไรอยู่ที่มือ</p>;
      case 356: return <p className={textBaseStyle} style={fluidTextStyle}>เป็นกระดาษสีแปลก ๆ มีข้อความข้างใน</p>;
      case 357: return <p className={textBaseStyle} style={fluidTextStyle}>คุณเลยหยิบขึ้นมาอ่าน</p>;
      // The story ends here, the click handler will navigate to the next page.
      
      default:
        // Fallback for any missing case to avoid blank screen
        return <p className={textBaseStyle} style={fluidTextStyle}>กำลังโหลดเนื้อเรื่อง... (Case: {step})</p>;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Div */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${caronstreet})` }}
      />
      <div
        ref={storyContainerRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 opacity-0"
      >
        <div ref={textContentRef} className="absolute inset-0 flex items-center justify-center p-4">
        {renderContent()}
        </div>
      </div>
      <div
        ref={whiteFlashRef}
        className="absolute inset-0 z-20 bg-white opacity-0 pointer-events-none"
      />
      {step > 1 && (
        <button
          onClick={handleBackClick}
          className="absolute bottom-5 right-5 z-30 px-4 py-2 bg-gray-800/50 text-white font-semibold rounded-lg backdrop-blur-sm hover:bg-gray-700/70 transition-colors"
        >
          ย้อนกลับ (ทดสอบ)
        </button>
      )}
      {/* --- ปุ่มข้ามสำหรับ Development --- */}
      <button
        onClick={() => navigate(`/postsurvey/${id}`)}
        className="fixed bottom-5 left-5 z-[9999] px-4 py-2 bg-black/50 text-white border border-white/50 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
      >
        ข้ามไป Post-Survey
      </button>
    </div>
  );
}

export default Story;