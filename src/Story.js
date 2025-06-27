import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import gsap from 'gsap';

// --- BG IMAGES ---
import carOnStreetBg from './assets/caronstreet.gif';

// --- Helper Components ---
const InputWrapper = ({ question, value, setter, handleTextInputSubmit, nextStep, placeholder }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      handleTextInputSubmit(nextStep);
    }
  };
  return (
    <div className="w-full max-w-lg text-center z-10">
      <form onSubmit={handleSubmit}>
        <label className="block text-white text-xl md:text-2xl lg:text-3xl mb-4 text-balance">{question}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setter(e.target.value)}
          className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          placeholder={placeholder}
          required
        />
        <button type="submit" className="mt-4 px-8 py-3 bg-white/80 text-black font-semibold rounded-lg hover:bg-white transition-colors">
          ตกลง
        </button>
      </form>
    </div>
  );
};

const QuestionWrapper = ({ question, children }) => (
  <div className="w-full max-w-2xl text-center z-10">
    {question && <h2 className="text-white text-xl md:text-2xl lg:text-3xl mb-6 text-balance">{question}</h2>}
    <div className="flex flex-col items-center gap-4 w-full">
      {children}
    </div>
  </div>
);

function Story() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [stepHistory, setStepHistory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(carOnStreetBg);

  // --- Story State Variables ---
  const [userAnswerDay, setUserAnswerDay] = useState('');
  const [feelingWhenTired, setFeelingWhenTired] = useState('');
  const [reactionToStrangeLight, setReactionToStrangeLight] = useState('');
  const [locationGuess, setLocationGuess] = useState('');
  const [initialReactionToWhiteFigure, setInitialReactionToWhiteFigure] = useState('');
  const [feelingWhenStressed, setFeelingWhenStressed] = useState('');
  const [howToHelp, setHowToHelp] = useState(''); // This seems unused in the new script but kept for safety
  const [ordinaryFeeling, setOrdinaryFeeling] = useState(''); // This seems unused in the new script but kept for safety
  const [childFeelingGuess, setChildFeelingGuess] = useState('');
  const [howToManageStress, setHowToManageStress] = useState('');
  const [energySource, setEnergySource] = useState('');
  const [helpForWhiteFigure, setHelpForWhiteFigure] = useState('');
  const [messageToPastSelf, setMessageToPastSelf] = useState('');
  const [creativeUseOfPower, setCreativeUseOfPower] = useState('');
  const [childDreamQuestion, setChildDreamQuestion] = useState('');
  const [messageToChildSelf, setMessageToChildSelf] = useState('');

  const textContentRef = useRef(null);
  const containerRef = useRef(null);
  const bgRef = useRef(null);

  const TOTAL_STEPS = 169;
  const interactiveSteps = [5, 8, 28, 65, 74, 79, 82, 84, 98, 103, 105, 119, 121, 126, 133, 137, 141, 144, 149];
  const storyJumps = { 33: 49, 38: 49, 43: 49, 48: 49 };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const docRef = doc(db, "presurvey", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    let newBg = '';
    if (step >= 1 && step <= 8) {
      newBg = carOnStreetBg;
    } else {
      newBg = ''; // No background after step 8
    }

    if (newBg !== backgroundImage) {
      gsap.to(bgRef.current, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          setBackgroundImage(newBg);
          if (newBg) {
            gsap.to(bgRef.current, { opacity: 1, duration: 0.8 });
          }
        }
      });
    }
  }, [step, backgroundImage]);

  const advanceToNextStep = useCallback((nextStep) => {
    if (isTransitioning) return;
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
  }, [isTransitioning, step]);

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
    advanceToNextStep(nextStep);
  };

  const handleTextInputSubmit = (nextStep) => {
    advanceToNextStep(nextStep);
  };

  useEffect(() => {
    const handleStoryClick = (e) => {
      if (interactiveSteps.includes(step) || e.target.closest('form, button') || isTransitioning) {
        return;
      }
      const nextStep = storyJumps[step] || step + 1;
      if (nextStep > TOTAL_STEPS) {
        navigate(`/postsurvey/${id}?cardType=ผู้รับฟัง`);
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
  }, [step, navigate, id, advanceToNextStep, isTransitioning, interactiveSteps, storyJumps]);

  // Flash effect for step 58
  useEffect(() => {
    if (step === 58) {
        const timer = setTimeout(() => {
            advanceToNextStep(59);
        }, 500); // Flash duration
        return () => clearTimeout(timer);
    }
  }, [step, advanceToNextStep]);


  const { name = '', age = '' } = userData || {};
  const textBaseStyle = "text-white font-light text-2xl md:text-3xl lg:text-4xl text-center text-balance leading-relaxed";
  const choiceButtonStyle = "w-full max-w-md p-3 bg-black/20 border-2 border-white/50 rounded-lg text-white text-center text-base md:text-lg hover:bg-white/30 transition-colors duration-300 backdrop-blur-sm";
  
  const renderContent = () => {
    switch (step) {
      // --- บทนำ: คืนที่เหนื่อยล้า ---
      case 1: return <p className={textBaseStyle}>ในเวลาพลบค่ำของคืนวันหนึ่ง</p>;
      case 2: return <p className={textBaseStyle}>บนถนนที่วุ่นวายรถติดยาวเหยียด คุณกำลังเดินทางกลับบ้าน</p>;
      case 3: return <p className={textBaseStyle}>ท้องฟ้ามืดสนิท เมฆเทากำลังก่อตัว ดูเหมือนพายุฝนกำลังมา</p>;
      case 4: return <p className={`${textBaseStyle} italic`}>"อะไรนักหนานะ ชีวิต"</p>;
      case 5: return <InputWrapper question="วันนี้คุณเพิ่งจะ..." value={userAnswerDay} setter={setUserAnswerDay} handleTextInputSubmit={handleTextInputSubmit} nextStep={6} placeholder="...เจออะไรมา" />;
      case 6: return <p className={textBaseStyle}>คุณถอนหายใจดังเฮือก</p>;
      case 7: return <p className={textBaseStyle}>ความเหน็ดเหนื่อยที่คุณมีในวันนี้ มันยากที่จะบรรยาย</p>;
      case 8: {
        const feelings = ["เฉยๆ", "หมดแรง", "ไร้พลัง", "ท้อแท้", "สิ้นหวัง", "อ้างว้าง", "โดดเดี่ยว", "สับสน", "ลังเล", "ไม่มั่นใจ", "โกรธ", "หงุดหงิด", "กดดัน", "แบกรับ"];
        return (<QuestionWrapper question="คำใดบ้างที่ดูใกล้เคียงกับคุณตอนที่กำลังเหนื่อย?"><div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">{feelings.map(feeling => (<button key={feeling} className={choiceButtonStyle} onClick={() => handleChoice(setFeelingWhenTired, feeling, 10)}>{feeling}</button>))}</div></QuestionWrapper>);
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
        return (<QuestionWrapper question="เจออะไรแปลก ๆ ขนาดนี้แล้ว คุณว่าจะทำอะไรต่อ ในสถานการณ์นี้ ?">
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
      case 65: return <InputWrapper question="คุณคิดว่าที่คุณอยู่ที่นี้คือที่ไหน" value={locationGuess} setter={setLocationGuess} handleTextInputSubmit={handleTextInputSubmit} nextStep={66} />;
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
        return (<QuestionWrapper question="ตอนนี้คุณอยู่ใกล้เขาแล้ว คุณจะทำอะไรเมื่อเห็นว่าเขาเป็นร่างแสงสว่างขาว ๆ แต่ดูไม่ออกว่าเป็นคนหรือเปล่า">{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setInitialReactionToWhiteFigure, choice, 75)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 75: return <p className={`${textBaseStyle} italic`}>“ไง..” เขาทักคุณสั้น ๆ เมื่อเห็นคุณ</p>;
      case 76: return <p className={`${textBaseStyle} italic`}>“ใจเย็นก่อนนะ”</p>;
      case 77: return <p className={`${textBaseStyle} italic`}>“ที่นี้กำลังพังทลายลง คุณคงไม่ใช่คนที่นี้ เพราะทุกคน..ไปหมดแล้ว”</p>;
      case 78: return <p className={`${textBaseStyle} italic`}>“ที่แห่งนี้.. กำลังล่มสลายน่ะ มันเริ่มพังทีละนิด ทีละนิด จนเป็นแบบนี้”</p>;
      case 79: {
        const choices = ["โศกเศร้า สิ้นหวัง หมดหนทาง", "ผิดหวังในตัวเอง", "โกรธที่ควบคุมมันไม่ได้", "อ่อนแอ ว่างเปล่า", "งงงวย สับสนที่ไม่อาจเข้าใจ"];
        return (<QuestionWrapper question="“อ่อ แต่ขอถามอะไรหน่อยสิ คุณดูเป็นคนที่ผ่านอะไรมาเยอะดี เรา..แค่อยากรู้น่ะ ว่า ตอนที่คุณรู้สึกเครียดมาก กับ บางสิ่งหรือปัญหา ที่แก้ไม่ได้หรือไม่ตกซักที คุณรู้สึกยังไงหรอ”">{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setFeelingWhenStressed, choice, 80)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 80: return <p className={`${textBaseStyle} italic`}>“งั้นเองสินะ เราก็เหมือนกันเลย เราก็รู้สึก {feelingWhenStressed || 'แบบนั้น'} เหมือนกัน”</p>;
      case 81: return <p className={`${textBaseStyle} italic`}>“นี่ คุณพอจะช่วยเราได้มั้ย …ช่วยฟื้นฟูที่แห่งนี้ได้หรือเปล่า” ร่างนั้นค่อย ๆ ถามด้วยเสียงแผ่วเบา</p>;
      case 82: return <QuestionWrapper question="“จะให้เราช่วยคุณอย่างไร เราเป็นแค่คนธรรมดา” คุณบอกร่างนั้นไป แม้ใจจะมีอยากช่วยบ้าง แต่ก็ทั้งนึกไม่ออกและไม่รู้จะช่วยอะไรได้"><button className={choiceButtonStyle} onClick={() => handleChoice(null, null, 83)}>บอกเขาไป</button></QuestionWrapper>;
      case 83: return <p className={`${textBaseStyle} italic`}>“เป็นคนธรรมดาก็ไม่ได้แปลว่าจะทำอะไรไม่ได้นี่หน่า”</p>;
      case 84: return <QuestionWrapper question="“ที่จักรวาลเรา เราก็แค่คนธรรมดาที่ไม่ได้พิเศษอะไร”"><button className={choiceButtonStyle} onClick={() => handleChoice(null, null, 85)}>พูดต่อไป</button></QuestionWrapper>;
      case 85: return <p className={`${textBaseStyle} italic`}>“แล้วจำเป็นต้องเป็นคนพิเศษด้วยหรอ” ร่างนั้นตอบกลับคุณทันที</p>;
      case 86: return <p className={textBaseStyle}>”ก็ไม่หรอก แต่ถ้าเป็นคนที่พิเศษก็คงจะดีกว่านี้ ได้รับการชื่นชม ได้มีคุณค่า และได้การยอมรับ”</p>;
      case 87: return <p className={textBaseStyle}>ร่างสีขาวยืนนิ่งแล้วหันมาบอกคุณอย่างมั่นใจ</p>;
      case 88: return <p className={`${textBaseStyle} italic`}>“การเป็นคนธรรมดา... ก็ไม่ได้หมายความว่าไร้ซึ่งความหมาย... ท้องฟ้าที่กว้างใหญ่... ก็ประกอบจากหยดน้ำฝนที่แสนธรรมดา... ผืนป่าที่อุดมสมบูรณ์... ก็เริ่มต้นจากเมล็ดพันธุ์เล็กๆ... หรือเครื่องจักรที่ยิ่งใหญ่... ก็ต้องการฟันเฟืองแต่ละน้อยชิ้น”</p>;
      case 89: return <p className={`${textBaseStyle} italic`}>“คุณน่ะมีค่า ไม่จำเป็นต้องพิเศษถึงมีค่า แต่เพราะเราเป็นคนเราจึงมีค่า” “แค่คุณยังมีชีวิตอยู่ไปซื้อหมูปิ้งหน้าบ้านคุณก็มีค่าต่อแม่ค้า คนเลี้ยงหมู รวมถึงระบบเศรษฐกิจแล้วล่ะ”</p>;
      case 90: return <p className={`${textBaseStyle} italic`}>“คุณน่ะประเมินค่าตัวเองต่ำเกินกว่าที่เป็น เอาเถอะนะ เพราะถึงแม้คุณจะไม่สามารถช่วยพวกเราได้ คุณก็ยังคงมีค่าเสมอ”</p>;
      case 91: return <p className={textBaseStyle}>ร่างนั้นบอก แม้จะไม่เห็นหน้าเขา แต่ก็พอสัมผัสได้ว่าเขายิ้มอ่อน ๆ ให้คุณ</p>;
      case 92: return <p className={textBaseStyle}>เมฆทมิฬด้านบนเริ่มขยับเล็กน้อย สภาพแวดล้อมมีกลิ่นอายบางอย่างที่เปลี่ยนแปลง</p>;
      case 93: return <p className={`${textBaseStyle} italic`}>“ถ้าคุณไม่สะดวกจริง ๆ งั้นคุณช่วยไปคุยกับเจ้าเด็กคนนั้นหน่อยสิ”</p>;
      case 94: return <p className={textBaseStyle}>พอร่างสีขาวนั้นพูดจบ เขาก็ผายมือไปอีกทางหนึ่ง เห็นร่างนึงอยู่หลังต้นไม้ที่เหี่ยวเฉา กำลังกอดขาก้มหน้าอยู่</p>;
      case 95: return <p className={textBaseStyle}>คุณเห็นเด็กคนหนึ่ง ร่างเล็ก ๆ อายุน่าจะราว ๆ ไม่เกินแปดถึงเก้าขวบ หน้าตาเหมือนคุณในตอนเด็กเลยก็ว่าได้</p>;
      case 96: return <p className={`${textBaseStyle} italic`}>“เขาน่ะเป็นแบบนี้มาสักระยะแล้วหลังจากที่นี้เป็นแบบนี้ คุณช่วยไปปลอบเขาหน่อยได้มั้ย”</p>;
      case 97: return <p className={textBaseStyle}>คุณพยักหน้ารับแบบเล็กน้อย ก่อนที่จะเดินไปหยุดตรงหน้าเด็กคนนั้น</p>;
      case 98: return <InputWrapper question="เห็นเด็กคนนี้แล้ว คุณคิดว่าเด็กคนนี้กำลังรู้สึกอะไร" value={childFeelingGuess} setter={setChildFeelingGuess} handleTextInputSubmit={handleTextInputSubmit} nextStep={99} />;
      case 99: return <p className={`${textBaseStyle} italic`}>“ไง..คุณน่าจะเป็นรุ่นราวพี่เรา” เด็กคนนั้นเงยหน้ามองและทักทายคุณ</p>;
      case 100: return <p className={`${textBaseStyle} italic`}>“ตอนนี้เรา {childFeelingGuess || 'รู้สึกไม่ดีเลย' }”</p>;
      case 101: return <p className={`${textBaseStyle} italic`}>“อืม เป็นเพื่อนคุยหน่อยได้มั้ยพี่” เด็กคนนี้ร้องขอเบา ๆ</p>;
      case 102: return <p className={textBaseStyle}>คุณเลยก้มตัวลง นั่งลงใกล้ ๆ เด็กคนนี้</p>;
      case 103: {
        const choices = ["จะยอมหยุดพักจากทุกสิ่ง ให้ร่างกายและจิตใจได้พักผ่อนอย่างเต็มที่ ไม่ฝืน", "จะหาทางระบายความรู้สึกนั้นออกมา อาจจะเขียนบันทึก ดูหนัง เล่นเกม ฟังเพลง หรือพูดคุยกับคนที่ไว้ใจ", "จะเผชิญหน้ากับความรู้สึกนั้น พยายามทำความเข้าใจต้นตอของมัน และหาวิธีแก้ไขปัญหาที่แท้จริง", "เรียนรู้ที่จะปฏิเสธในสิ่งที่ไม่ไหว หรือสิ่งที่ไม่ส่งผลดีต่อจิตใจตัวเอง"];
        return (<QuestionWrapper question="“เราถามอะไรพี่ได้มั้ย ตอนพี่เจอเรื่องไม่ดี พี่จัดการและก็ทำอะไรเหรอ ? เราไม่รู้ว่าจะทำอะไร หรือควรทำอะไรได้ เราไม่อยากให้มันฉุดรั้งใจเราแบบนี้”">{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setHowToManageStress, choice, 104)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 104: return <p className={`${textBaseStyle} italic`}>“เป็นวิธีที่ดีเลยนะ เราคงจะลองทำตามดู”</p>;
      case 105: {
        const choices = ["ได้อยู่ท่ามกลางธรรมชาติ สัมผัสแสงแดด สายลม หรือเสียงของต้นไม้ใบหญ้า", "ได้กลับไปทำสิ่งที่รัก หรืองานอดิเรกที่ทำให้ลืมความกังวลและได้อยู่กับตัวเอง", "การได้ระบายหรือพูดคุยกับคนที่ไว้ใจ คนที่รับฟังและเข้าใจ โดยไม่ตัดสิน(รวมถึงสัตว์เลี้ยงด้วย)", "การได้อยู่เงียบๆ คนเดียว ทำสมาธิ อ่านหนังสือ หรือฟังเพลงที่ผ่อนคลาย"];
        return (<QuestionWrapper question="“… เราถามเพิ่มได้มั้ย แล้วในวันที่ 'พลังใจ’ ของพี่ไม่มีเหลือเลย อะไรคือ 'แหล่งพลังงาน' เล็กๆ น้อยๆ ที่จะช่วยให้พี่ได้กลับมาเติมเต็มตัวเอง ?”">{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setEnergySource, choice, 106)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 106: return <p className={textBaseStyle}>เมื่อคุณตอบเด็กคนนี้ไป บรรยากาศรอบข้างเริ่มดีขึ้น อากาศเริ่มอบอุ่นขึ้นมาบ้าง ต้นบางต้น เริ่มฟื้นคืนสภาพตัวเองได้</p>;
      case 107: return <p className={`${textBaseStyle} italic`}>“เราพอเข้าใจบ้างแล้ว ขอบคุณพี่มากนะ เราจะพยายามดู” เด็กคนนั้นลุกขึ้นตอบ</p>;
      case 108: return <p className={`${textBaseStyle} italic`}>“ป่ะ ไปกัน” สิ้นเสียง เด็กคนนี้ก็จูงมือคุณกลับไปหาร่างนั้นอีกครั้ง</p>;
      case 109: return <p className={`${textBaseStyle} italic`}>“อ่ะ อ่าว คุยกันเรียบร้อยแล้วสินะ แล้วนี่คุณพาเด็กคนนี้ออกจากตรงนั้นได้ด้วยหรอ”</p>;
      case 110: return <p className={textBaseStyle}>ร่างสีขาวนั้นพูดด้วยความประหลาดใจ พร้อมกล่าวต่อ</p>;
      case 111: return <p className={`${textBaseStyle} italic`}>“เขาอยู่ตรงนั้นไม่ยอมไปไหนเลย แต่คุณทำได้ เป็นเรื่องที่ดีแล้—-“</p>;
      case 112: return <p className={textBaseStyle}>ก่อนที่ร่างนั้นจะพูดจบ ร่างสีขาวที่ประกายแสง กลับเริ่มมีร่างที่โปร่งใส คล้ายจะสลายหายไปเอง ประดังน้ำระเหยเป็นไอแก๊ส</p>;
      case 113: return <p className={`${textBaseStyle} italic`}>“เกิดอะไรขึ้นน่ะ ทำไมยังเป็นแบบนี้กันล่ะ” เด็กคนนั้นพูดด้วยความตกใจ</p>;
      case 114: return <p className={`${textBaseStyle} italic`}>“ตะ-ตลอดเวลาที่ผ่านมา เราไม่เคยรักตัวเองเลย ภายในจึงอ่อนแอ เลยโดนผลกระทบจากการ-สะ—สลายของที่แห่งนี้ไปด้—ว-ย” ร่างสีขาวเริ่มพูดติด ๆ ขัด ๆ</p>;
      case 115: return <p className={`${textBaseStyle} italic`}>“แล้วทำไมคุณไม่รักตัวเองล่ะ” เด็กคนนั้นโพล่งถามออกไป</p>;
      case 116: return <p className={`${textBaseStyle} italic`}>“มั-น ดู แอบเห็นแก่ตัวล่ะมั้-“</p>;
      case 117: return <p className={`${textBaseStyle} italic`}>“รักตัวเองไม่เท่ากับเห็นแก่ตัวซักหน่อย รักตัวเองได้ดี ก็จะรักคนอื่นได้ดีเช่นกัน”</p>;
      case 118: return <p className={`${textBaseStyle} italic`}>“เราขอโทษที่ทำให้ผิดหวังนะ เราพยายามแล้ว”</p>;
      case 119: return <QuestionWrapper question="“ไม่ว่าอะไรจะเกิด แต่คุณก็ยังคงเป็นคุณเสมอ” คุณกล่าวซ้ำไป"><button className={choiceButtonStyle} onClick={() => handleChoice(null, null, 120)}>กล่าวซ้ำไป</button></QuestionWrapper>;
      case 120: return <p className={textBaseStyle}>สิ้นเสียงคุณ ร่างนั้นเริ่มกลับมาดีขึ้นบ้าง แม้จะยังกระพริบไปมา ระหว่างร่างโปร่งแสงปกติ กับร่างโปร่งใสของเมื่อกี้</p>;
      case 121: {
        const choices = ["เพียงแค่ได้รับการโอบกอดอย่างอ่อนโยน และมีใครสักคนรับฟังความเจ็บปวด โดยไม่ตัดสิน", "ต้องการใครสักคนมายืนยันว่าเรายังมีคุณค่า ไม่ว่าเราจะเคยทำอะไรผิดพลาดมาแค่ไหนก็ตาม", "ต้องการคำแนะนำที่ชัดเจนว่าจะต้องทำอย่างไร เพื่อให้หลุดพ้นจากความทุกข์ทรมานนี้", "อยากได้รับโอกาสในการให้อภัยตัวเอง และโอกาสในการเริ่มต้นชีวิตใหม่ที่ดีกว่า"];
        return (<QuestionWrapper question="คุณได้จินตนาการ ตั้งคำถามกับตัวเอง: ร่างนั้นที่บอบบางและใกล้สลาย... หากเราคือร่างนั้น ในห้วงเวลาที่สิ้นหวังที่สุด เราอยากจะได้รับ 'ความช่วยเหลือ' หรือ 'คำพูด' แบบไหนมากที่สุดกันนะ ?">{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setHelpForWhiteFigure, choice, 122)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 122: return <p className={textBaseStyle}>เมื่อคุณตอบ '{helpForWhiteFigure || '...'}' เป็นคำตอบในใจแล้ว คุณก็เริ่มเข้าใจ ทั้งตัวร่างนั้นและตัวเองขึ้นมาบ้าง</p>;
      case 123: return <p className={`${textBaseStyle} italic`}>“เรา..ไม่เป็นอะไรมากแล้วล่ะ.. ขอโทษที่ทำให้เป็นห่วง” ร่างสีขาวนั้นพูดด้วยเสียงเศร้า</p>;
      case 124: return <p className={`${textBaseStyle} italic`}>“เราจะ..พยายาม เป็นตัวเองในทางที่ดีขึ้น เราสัญญา”</p>;
      case 125: return <p className={`${textBaseStyle} italic`}>“แน่นอน!! เราเชื่อ” เด็กคนนั้นตอบกลับ</p>;
      case 126: {
        const choices = ["อยากจะบอกว่า 'ให้อภัยคุณแล้ว... เรายอมรับในทุกสิ่งที่เป็น... ไม่ว่าคุณจะเป็นอย่างไรก็ตาม'", "อยากจะบอกว่า 'คุณมีค่าเสมอ... ไม่จำเป็นต้องพิเศษ... เรารักคุณในแบบที่คุณเป็น'", "อยากจะบอกว่า 'คุณเข้มแข็งมากที่ผ่านเรื่องราวมาได้ถึงตรงนี้… มาเติบโตไปข้างหน้าด้วยกันนะ'", "เราอยากจะบอกว่า 'เราเข้าใจทุกความเจ็บปวดของคุณ... เราจะอยู่เคียงข้างคุณเสมอ... ไม่ว่าอะไรจะเกิดขึ้น'"];
        return (<QuestionWrapper question="ตอนนี้... เมื่อคุณได้เข้าใจความรู้สึกของ 'ตัวตนที่บอบบาง' นั้นแล้ว... หากคุณสามารถส่ง 'คำพูด' หรือ 'ความรู้สึก' ใดไปให้เขาได้ในตอนนี้... คุณอยากจะบอกอะไรกับ 'เขา' มากที่สุด... เพื่อโอบกอดและเยียวยาความเจ็บปวดเหล่านั้น?">{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setMessageToPastSelf, choice, 127)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 127: return <p className={textBaseStyle}>คุณบอกร่างนั้นว่า “{messageToPastSelf || '...'}”</p>;
      case 128: return <p className={textBaseStyle}>ทั้งสองคนมองหน้าคุณพร้อมกัน ด้วยสายตาที่เริ่มอ่อนโยน มีความสุขบ้าง</p>;
      case 129: return <p className={`${textBaseStyle} italic`}>“ขอบคุณนะ {name}” ร่างสีขาวนั้นที่เริ่มค่อย ๆ กลับมาดีขึ้น จากเดิม</p>;
      case 130: return <p className={textBaseStyle}>ตอนนี้เหมือนสถานการณ์รอบด้านเริ่มกลับมา สภาพแวดล้อมผิดธรรมชาติ กลับสู่ปกติ ท้องฟ้า บรรยากาศ อากาศ และตลอดสิ่งแวดล้อม ทุกอย่างฟื้นฟูอย่างฉับพลัน</p>;
      case 131: return <p className={`${textBaseStyle} italic`}>“ดูเหมือน ภัยจะเริ่มหายไปแล้วนะพี่” เด็กคนนั้นบอก</p>;
      case 132: return <p className={`${textBaseStyle} italic`}>“อืม ใช่ ทั้งหมดนี้เป็นเพราะคุณจริง ๆ นะ” ร่างสีขาวที่เริ่มกลายเป็นร่างคนแบบปกติพูดต่อ</p>;
      case 133: return <QuestionWrapper question="“ไม่เลยเรายังไม่ได้ทำอะไรเลยนะ”"><button className={choiceButtonStyle} onClick={() => handleChoice(null, null, 134)}>พูดออกไป</button></QuestionWrapper>;
      case 134: return <p className={`${textBaseStyle} italic`}>“คุณทำมันจริง ๆ คุณช่วยพวกเราไว้ เมื่อจิตใจคุณเริ่มมั่นคง ที่แห่งนี้ก็จะกลับมาสดชื่นเหมือนเดิมดังเคยเป็น คุณเริ่มเรียนรู้ที่จะรู้ว่าการรักตัวเอง มันสำคัญมาก”</p>;
      case 135: return <p className={`${textBaseStyle} italic`}>“ตอนนี้ เราคงต้องส่งคุณกลับแล้ว ต้องขอโทษจริง ๆ ที่พาคุณมาอย่างกระทันหัน แต่คุณน่ะ ‘สำคัญกับที่นี้เสมอนะ’ ” ร่างสีขาวที่เป็นร่างคนเรียบร้อยได้กล่าว</p>;
      case 136: return <p className={`${textBaseStyle} italic`}>“ขอถามอะไรเป็นครั้งสุดท้ายก่อนกลับได้มั้ย”</p>;
      case 137: {
        const choices = ["อยากใช้เรื่องราวและประสบการณ์ที่ได้เรียนรู้ มาเป็นแรงบันดาลใจให้ผู้อื่น ให้พวกเขากล้าที่จะรักและเข้าใจตัวเอง", "อยากนำพลังและความสุขที่ได้กลับมานี้ ไปสร้างสรรค์ผลงานใหม่ๆ ที่เป็นประโยชน์ หรือทำให้ผู้อื่นมีความสุข", "อยากนำความเข้าใจในตัวเองไปใช้กับการดูแลความสัมพันธ์กับคนรอบข้างให้แข็งแรงและมีความสุขยิ่งขึ้น", "อยากใช้พลังทั้งหมดนี้ เพื่อก้าวไปสู่เป้าหมายที่แท้จริงของชีวิต ที่ค้นพบในภารกิจนี้ โดยไม่ลังเลอีกต่อไป"];
        return (<QuestionWrapper question="”เมื่อตัวตนภายในของคุณสมบูรณ์ และเต็มไปด้วยพลัง คุณจะใช้พลังนี้เพื่อ 'สร้างสรรค์' หรือ 'แบ่งปัน' สิ่งใด ให้กับโลกที่แท้จริงของท่าน?”">{choices.map(choice => (<button key={choice} className={choiceButtonStyle} onClick={() => handleChoice(setCreativeUseOfPower, choice, 138)}>{choice}</button>))}</QuestionWrapper>);
      }
      case 138: return <p className={`${textBaseStyle} italic`}>“ขอบคุณที่บอกมาอย่างนั้นนะ พวกเราเชื่อมั่นในตัวคุณเสมอ”</p>;
      case 139: return <p className={`${textBaseStyle} italic`}>“อยากบอกแค่ว่า เพราะคุณสมควรที่จะมีความสุขที่สุดในโลก”</p>;
      case 140: return <p className={textBaseStyle}>เมื่อสิ้นร่างนั้นกล่าวจบ เด็กคนนั้นก็เดินมาหาหาคุณ</p>;
      case 141: return <InputWrapper question="“นี่พี่ ถามไรหน่อยก่อนพี่จะไปได้มั้ย พี่เชื่อว่าผมจะไปได้ไกลเท่าพี่มั้ย เพราะผมไม่รู้ ว่าผมเก่งพอหรือดีพอจะทำได้มั้ย พี่น่ะเก่ง เก่งสุดๆจนผมน่าจะเทียบไม่ติด”" value={childDreamQuestion} setter={setChildDreamQuestion} handleTextInputSubmit={handleTextInputSubmit} nextStep={142} />;
      case 142: return <p className={`${textBaseStyle} italic`}>“งั้นหรอ ผมเองก็จะเชื่อมั่นแบบนั้นเช่นกันนะ”</p>;
      case 143: return <p className={`${textBaseStyle} italic`}>“ถึงแม้ความฝันของพวกเรา จะไปได้ไกลหรือไม่ไกล เราเองก็ไม่รู้ แต่มันก็ดีที่เราได้เดินทางร่วมกันนะพี่ และเราอยากเดินทางร่วมกับพี่ไปจนถึงที่สุดเลย”</p>;
      case 144: return <InputWrapper question="“คุณอยากบอกเด็กคนนี้ว่าอะไร เป็นการบอกลาเขามั้ย”" value={messageToChildSelf} setter={setMessageToChildSelf} handleTextInputSubmit={handleTextInputSubmit} nextStep={145} />;
      case 145: return <p className={textBaseStyle}>เมื่อคุณบอกเขาเรียบร้อย เด็กคนนั้นก็น้ำตาไหลด้วยความปลื้มปิติ พร้อมกับแสงสีขาวที่เริ่มขยายจากข้างหลังของคุณ พร้อมแรงดึงดูดที่เริ่มแรงขึ้น</p>;
      case 146: return <p className={`${textBaseStyle} italic`}>“ซักวันหนึ่งเราจะได้พบกันนะ พี่{name} ยังไงก็ ‘{messageToChildSelf || '...'}’ นะ”</p>;
      case 147: return <p className={textBaseStyle}>คุณยิ้มตอบกลับเด็กคนนั้นไป</p>;
      case 148: return <p className={`${textBaseStyle} italic`}>“ก่อนที่คุณจะไป ช่วยรับกระดาษนี้ไว้ทีสิ แล้วก็ขอบคุณสำหรับทุกอย่างนะ คุณเป็นคนสำคัญของพวกเรา พวกเราจะไม่มีวันลืมคุณเลย” ร่างสีขาวที่เป็นคนตอนนี้บอกคุณ</p>;
      case 149: return <QuestionWrapper question="“ได้สิ นั่นสินะ แล้วคุณชื่ออะไรนะ”"><button className={choiceButtonStyle} onClick={() => handleChoice(null, null, 150)}>ถามชื่อของเขา</button></QuestionWrapper>;
      case 150: return <p className={textBaseStyle}>คุณพึ่งนึกได้ว่ายังไม่รู้ชื่อของคนที่เคยเป็นร่างสีขาวเลย ที่ตอนนี้เริ่มเห็นหน้าเขาชัดขึ้นเรื่อย ๆ</p>;
      case 151: return <p className={`${textBaseStyle} italic`}>“เราชื่อ {name} น่ะ”</p>;
      case 152: return <p className={textBaseStyle}>ก่อนที่จะงงและจะได้บอกลาคนตรงหน้า คุณก็ถูกดึงดูดด้วยแรงดึงดูดของประตูนั้นเข้าไปแล้ว...</p>;
      
      // --- บทสรุป: การกลับมา ---
      case 153: return <p className={textBaseStyle}>.....</p>;
      case 154: return <p className={textBaseStyle}>06.58</p>;
      case 155: return <p className={textBaseStyle}>06.59</p>;
      case 156: return <p className={textBaseStyle}>07.00</p>;
      case 157: return <p className={textBaseStyle}>เสียงนาฬิกาปลุกดังขึ้น กับเช้าวันใหม่ที่ผ่านไปอย่างรวดเร็ว</p>;
      case 158: return <p className={textBaseStyle}>วันนี้คือวันศุกร์ และคุณยังคงมีเรื่องที่คุณต้องทำ</p>;
      case 159: return <p className={textBaseStyle}>สรุปแล้วนี่คงเป็นฝันที่ยาวนานที่สุดที่คุณเคยฝัน มันทั้งเหมือนจริงและเหมือนคุณอยู่ที่นั้นจริง ๆ</p>;
      case 160: return <p className={textBaseStyle}>แต่ถึงจะแค่ฝัน คุณก็รู้เริ่มสบายภายใน 'ตัวตน' ขึ้นมาบ้าง</p>;
      case 161: return <p className={textBaseStyle}>คุณค่าต่าง ๆ ที่ได้รับในฝัน มันเริ่มปรับเปลี่ยนมุมมองคุณ ทีละน้อย ทีละน้อย ทีละน้อย</p>;
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
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none', opacity: backgroundImage ? 1 : 0 }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 w-full h-full bg-black/50" />
      
      {/* Back Button */}
      {step > 1 && step !== 58 && (
        <button 
          onClick={goBack} 
          className="absolute top-5 left-5 z-20 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
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