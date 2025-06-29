import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './Quote.css';

const quotes = [
  {
    thai: "การรักตัวเองคือจุดเริ่มต้นของความโรแมนติกที่ยืนยาวไปตลอดชีวิต",
    english: "To love oneself is the beginning of a lifelong romance.",
    author: "Oscar Wilde",
    description: "นักเขียนและกวีชาวไอริช"
  },
  {
    thai: "ไม่มีใครสามารถทำให้คุณรู้สึกด้อยค่าได้ หากไม่ได้รับความยินยอมจากคุณ",
    english: "No one can make you feel inferior without your consent.",
    author: "Eleanor Roosevelt",
    description: "อดีตสุภาพสตรีหมายเลขหนึ่งของสหรัฐอเมริกา"
  },
  {
    thai: "คุณอาจไม่สมบูรณ์แบบ คุณถูกสร้างมาให้ต้องดิ้นรนต่อสู้ แต่คุณก็คู่ควรกับความรักและการเป็นส่วนหนึ่งเสมอ",
    english: "You are imperfect, you are wired for struggle, but you are worthy of love and belonging.",
    author: "Dr. Brené Brown",
    description: "นักวิจัยและศาสตราจารย์ด้านสังคมสงเคราะห์"
  },
  {
    thai: "ฉันไม่ไว้ใจคนที่ไม่รักตัวเองแล้วมาบอกว่า 'ฉันรักคุณ'... ฉะนั้นจงระวัง เมื่อคนเปลือยกายหยิบยื่นเสื้อให้คุณ",
    english: "I don't trust people who don't love themselves and tell me, 'I love you.' ... Be careful when a naked person offers you a shirt.",
    author: "Maya Angelou",
    description: "กวีและนักเขียนชาวอเมริกัน"
  },
  {
    thai: "ในโลกใบนี้ คนที่ฉันควรจะรักก็คือตัวฉันเอง แสงที่ส่องประกายในตัวฉัน คือตัวตนอันมีค่าของฉันเอง",
    english: "I'm the one I should love in this world. The shining me, the precious soul of mine.",
    author: "BTS",
    description: "จากเพลง Answer: Love Myself"
  },
  {
    thai: "ฉันงดงามในแบบของฉัน เพราะพระเจ้าไม่เคยทำสิ่งใดผิดพลาด ฉันมาถูกทางแล้ว ที่รัก ฉันเกิดมาเป็นแบบนี้",
    english: "I'm beautiful in my way, 'cause God makes no mistakes. I'm on the right track, baby, I was born this way.",
    author: "Lady Gaga",
    description: "จากเพลง Born This Way"
  },
  {
    thai: "ฉันงดงาม ไม่ว่าใครจะพูดยังไง คำพูดเหล่านั้นไม่สามารถทำร้ายฉันได้... คุณงดงามในทุกๆ ทาง ใช่แล้ว คำพูดไม่สามารถทำร้ายคุณได้เลย",
    english: "I am beautiful, no matter what they say. Words can't bring me down... You are beautiful in every single way. Yes, words can't bring you down.",
    author: "Christina Aguilera",
    description: "จากเพลง Beautiful"
  },
  {
    thai: "การเป็นตัวของตัวเองในโลกที่พยายามจะเปลี่ยนคุณไปเป็นอย่างอื่นอยู่ตลอดเวลา คือความสำเร็จที่ยิ่งใหญ่ที่สุด",
    english: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    author: "Ralph Waldo Emerson",
    description: "นักปรัชญาและกวี"
  },
  {
    thai: "ความสิ้นหวังในรูปแบบที่พบได้บ่อยที่สุด คือการไม่ได้เป็นตัวของตัวเอง",
    english: "The most common form of despair is not being who you are.",
    author: "Søren Kierkegaard",
    description: "นักปรัชญา (บิดาแห่งอัตถิภาวนิยม)"
  },
  {
    thai: "วิธีที่คุณรักตัวเอง คือวิธีที่คุณสอนให้คนอื่นมารักคุณ",
    english: "How you love yourself is how you teach others to love you.",
    author: "Rupi Kaur",
    description: "กวีและนักเขียน"
  },
  {
    thai: "ความอยากที่จะเป็นคนอื่น คือการสูญเสียตัวตนที่คุณเป็น",
    english: "Wanting to be someone else is a waste of the person you are.",
    author: "Kurt Cobain",
    description: "นักร้องและนักแต่งเพลง (Nirvana)"
  },
  {
    thai: "ถ้าคุณรักตัวเองไม่ได้ แล้วคุณจะไปรักคนอื่นได้ยังไงกัน?",
    english: "If you can't love yourself, how in the hell you gonna love somebody else?",
    author: "RuPaul",
    description: "ศิลปินแดร็กควีนและพิธีกร"
  },
  {
    thai: "ฉันไม่อยากให้คนอื่นมาตัดสินว่าฉันเป็นใคร ฉันอยากเป็นคนตัดสินเรื่องนั้นด้วยตัวเอง",
    english: "I don't want other people to decide who I am. I want to decide that for myself.",
    author: "Emma Watson",
    description: "นักแสดงและนักเคลื่อนไหว"
  },
  {
    thai: "ความงามที่แท้จริงของผู้หญิงสะท้อนออกมาจากจิตวิญญาณของเธอ มันคือความเอาใจใส่ที่เธอมอบให้อย่างรักใคร่ คือแรงปรารถนาที่เธอแสดงออกมา",
    english: "The beauty of a woman is not in a facial mode but the true beauty in a woman is reflected in her soul. It is the caring that she lovingly gives the passion that she shows.",
    author: "Audrey Hepburn",
    description: "นักแสดงและนักมนุษยธรรม"
  },
  {
    thai: "จงเป็นเวอร์ชันที่ดีที่สุดของตัวเอง ไม่ใช่เป็นแค่สำเนาลอกเลียนแบบของคนอื่น",
    english: "Always be a first-rate version of yourself, instead of a second-rate version of somebody else.",
    author: "Judy Garland",
    description: "นักแสดงและนักร้อง"
  },
  {
    thai: "ฉันอาจจำเป็นต้องสูญเสียเธอไป เพื่อที่จะได้รักตัวเอง",
    english: "I needed to lose you to love me.",
    author: "Selena Gomez",
    description: "จากเพลง Lose You to Love Me"
  },
  {
    thai: "ฉันอยากถูกนิยามด้วยสิ่งที่ฉันรัก ไม่ใช่สิ่งที่ฉันเกลียด",
    english: "I wanna be defined by the things that I love, not the things I hate.",
    author: "Taylor Swift",
    description: "จากเพลง Daylight"
  },
  {
    thai: "ฉันคือ soulmate ของตัวเอง ฉันรู้ว่าฉันเป็นควีน แต่ฉันไม่ต้องการมงกุฎใดๆ",
    english: "I'm my own soulmate... I know I'm a queen but I don't need no crown.",
    author: "Lizzo",
    description: "จากเพลง Soulmate"
  },
  {
    thai: "ฉันภูมิใจในสิ่งที่ฉันเป็น ไม่ เธอไม่มีวันทำลายจิตวิญญาณของฉันได้",
    english: "I'm proud of who I am. No, you're not breaking my soul.",
    author: "Kesha",
    description: "จากเพลง Praying"
  },
  {
    thai: "ไม่มีใครเขาตาย เพียงเพราะคนอื่นไม่รัก มีแต่คนที่ตาย เพราะไม่รักตัวเอง",
    english: "",
    author: "เฉาก๊วย จีสอง",
    description: "จากเพลง ไม่มีใครตาย เพราะคนอื่นไม่รัก"
  },
  {
    thai: "ถ้าคุณได้รับความสามารถที่จะให้รักในบางสิ่ง จงรักตัวเองก่อน",
    english: "If you have the ability to love, love yourself first.",
    author: "Charles Bukowski",
    description: "นักปรัชญาและนักเขียน"
  }
];

function Quote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showTapMessage, setShowTapMessage] = useState(false);
  const [canTap, setCanTap] = useState(false);

  useEffect(() => {
    // เฟดจากสีขาวมาเป็น gradient
    gsap.fromTo(
      '.quote-page',
      { backgroundColor: '#ffffff' },
      { 
        backgroundColor: 'transparent',
        duration: 1.5,
        ease: 'power2.out'
      }
    );

    // สุ่มเลือกคำคม
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setSelectedQuote(quotes[randomIndex]);

    // รอ 4.5 วินาทีแล้วแสดงข้อความแตะหน้าจอ
    const timer = setTimeout(() => {
      setShowTapMessage(true);
      setCanTap(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleScreenTap = () => {
    if (!canTap) return;

    setCanTap(false);
    
    // เฟดดำแล้วไปหน้า Story
    gsap.to('.quote-page', {
      backgroundColor: '#000000',
      duration: 1,
      ease: 'power2.out',
      onComplete: () => {
        navigate(`/story/${id}`);
      }
    });
  };

  if (!selectedQuote) {
    return (
      <div className="quote-page" style={{ backgroundColor: '#ffffff' }}>
        <div className="quote-content">
          <p>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="quote-page" 
      onClick={handleScreenTap}
      style={{ cursor: canTap ? 'pointer' : 'default' }}
    >
      <div className="quote-content">
        <h1 className="quote-title">Quote For You</h1>
        
        <div className="quote-section">
          <div className="quote-text-thai">
            "{selectedQuote.thai}"
          </div>
          
          {selectedQuote.english && (
            <div className="quote-text-english">
              "{selectedQuote.english}"
            </div>
          )}
          
          <div className="quote-author">
            — {selectedQuote.author}
          </div>
          
          <div className="quote-description">
            {selectedQuote.description}
          </div>
        </div>
        
        <p className="quote-instruction">
          ใช้เวลาสักครู่ในการคิดทบทวน และเมื่อพร้อมแล้ว...
        </p>
        
        {showTapMessage && (
          <div className="tap-message">
            ✨ แตะหน้าจอเพื่อเริ่มการเดินทาง ✨
          </div>
        )}
      </div>
    </div>
  );
}

export default Quote;
