import React, { useRef, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { gsap } from 'gsap';
import './ResultCard.css';

// Default card image (fallback)
import MCard5 from './assets/Mcard5.png';

function ResultCard() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const cardRef = useRef(null);
  
  // รับข้อมูลการ์ดจาก URL parameters
  const cardType = searchParams.get('cardType') || 'ผู้รับฟัง';
  const cardTitle = searchParams.get('cardTitle') || 'ผู้รับมือ';
  const cardImageSrc = searchParams.get('cardImage') || '';
  
  const [cardImage, setCardImage] = useState(MCard5);
  const [playerName, setPlayerName] = useState(''); // เพิ่ม state สำหรับชื่อผู้เล่น

  useEffect(() => {
    console.log('=== ResultCard Debug ===');
    console.log('URL cardImageSrc:', cardImageSrc);
    console.log('URL cardType:', cardType);
    console.log('URL cardTitle:', cardTitle);
    
    // ลองหาข้อมูลจาก localStorage หลายแหล่ง
    const storedCardData = localStorage.getItem('userCardData');
    const storedUserData = localStorage.getItem('userData');
    const storedFormData = localStorage.getItem('formData');
    const storedPresurveyData = localStorage.getItem(`presurvey_${id}`);
    
    console.log('🔍 localStorage userCardData:', storedCardData);
    console.log('🔍 localStorage userData:', storedUserData);
    console.log('🔍 localStorage formData:', storedFormData);
    console.log('🔍 localStorage presurveyData:', storedPresurveyData);
    
    if (storedCardData) {
      try {
        const parsedData = JSON.parse(storedCardData);
        console.log('Found localStorage card data:', parsedData);
        if (parsedData.cardImage) {
          setCardImage(parsedData.cardImage);
          console.log('Using cardImage from localStorage:', parsedData.cardImage);
        }
      } catch (error) {
        console.error('Error parsing localStorage card data:', error);
      }
    }
    
    // ลองหาชื่อจากหลายแหล่ง (ตามลำดับความสำคัญ)
    let foundName = '';
    
    // 1. จาก localStorage playerName (มาจาก Form.js)
    const storedPlayerName = localStorage.getItem('playerName');
    if (storedPlayerName && storedPlayerName.trim() !== '') {
      foundName = storedPlayerName;
      console.log('✅ Player name from localStorage playerName:', storedPlayerName);
    }
    
    // 2. จาก userData
    else if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        if (userData.name) {
          foundName = userData.name;
          console.log('✅ Player name from userData:', userData.name);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // 3. จาก formData
    if (!foundName && storedFormData) {
      try {
        const formData = JSON.parse(storedFormData);
        if (formData.name) {
          foundName = formData.name;
          console.log('✅ Player name from formData:', formData.name);
        }
      } catch (error) {
        console.error('Error parsing form data:', error);
      }
    }
    
    // 3. จาก presurvey data
    if (!foundName && storedPresurveyData) {
      try {
        const presurveyData = JSON.parse(storedPresurveyData);
        if (presurveyData.name) {
          foundName = presurveyData.name;
          console.log('✅ Player name from presurveyData:', presurveyData.name);
        }
      } catch (error) {
        console.error('Error parsing presurvey data:', error);
      }
    }
    
    // 4. ลองหาจาก Firebase โดยใช้ id
    if (!foundName && id) {
      // ฟังก์ชันนี้จะทำงานใน useEffect แยก
      console.log('🔍 Will try to fetch from Firebase with id:', id);
    }
    
    if (foundName) {
      setPlayerName(foundName);
      console.log('✅ Final player name set:', foundName);
    } else {
      console.log('❌ No name found from any source');
    }
    
    // จัดการรูปภาพ
    if (cardImageSrc && cardImageSrc !== 'undefined' && cardImageSrc !== '') {
      setCardImage(cardImageSrc);
      console.log('Using cardImage from URL:', cardImageSrc);
    } else if (!storedCardData) {
      setCardImage(MCard5);
      console.log('Using fallback cardImage:', MCard5);
    }
  }, [cardImageSrc, cardType, cardTitle, id]);

  // ⭐ Debug: แสดงชื่อที่จะใช้
  useEffect(() => {
    console.log('🎯 Final playerName to display:', playerName);
  }, [playerName]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.7)" }
      );
    }
  }, [cardImage]);

  const handleDownload = () => {
    if (!cardRef.current) return;
    
    toPng(cardRef.current, { 
      cacheBust: true,
      pixelRatio: 2,
      width: cardRef.current.offsetWidth,
      height: cardRef.current.offsetHeight,
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `covenant-card-${cardTitle}-${playerName || id}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
        alert('ขออภัย, ไม่สามารถบันทึกรูปภาพได้ในขณะนี้');
      });
  };

  // เพิ่ม useEffect แยกสำหรับดึงข้อมูลจาก Firebase
  useEffect(() => {
    const fetchUserDataFromFirebase = async () => {
      if (!playerName && id) { // ถ้ายังไม่มีชื่อและมี id
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('./firebase');
          
          const docRef = doc(db, "formdata", id); // เปลี่ยนจาก presurvey เป็น formdata
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.name) {
              setPlayerName(data.name);
              console.log('✅ Player name from Firebase:', data.name);
            }
          } else {
            console.log('❌ No Firebase document found for id:', id);
          }
        } catch (error) {
          console.error('Error fetching from Firebase:', error);
        }
      }
    };
    
    fetchUserDataFromFirebase();
  }, [id, playerName]);

  return (
    <div className="result-container">
      <header className="result-header">
        <h1>กระดาษพันธสัญญาของตัวคุณ</h1>
        <h2 className="card-type-title">{cardType}</h2>
        <h3 className="card-subtitle">{cardTitle}</h3>
      </header>

      <main className="card-area">
        <div ref={cardRef} className="covenant-card">
          {cardImage ? (
            <div className="card-container">
              <img 
                src={cardImage} 
                alt={`${cardType} - ${cardTitle}`} 
                className="card-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              
              {/* เพิ่ม overlay สำหรับชื่อผู้เล่น */}
              {playerName && (
                <div className="name-overlay">
                  <div className="name-from">
                    <span className="name-label"></span>
                    <span className="player-name">{playerName}</span>
                  </div>
                  <div className="name-to">
                    <span className="name-label"></span>
                    <span className="player-name">{playerName}</span>
                  </div>
                </div>
              )}
              
              <div className="card-fallback" style={{ display: 'none', textAlign: 'center', padding: '2rem' }}>
                <h3 style={{ color: '#7c3aed', marginBottom: '1rem' }}>{cardTitle}</h3>
                <p style={{ color: '#6b7280' }}>{cardType}</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '1rem' }}>
                  รูปภาพไม่สามารถโหลดได้
                </p>
              </div>
            </div>
          ) : (
            <div className="card-placeholder">
              <p>กำลังโหลดการ์ด...</p>
            </div>
          )}
        </div>
      </main>

      <footer className="result-footer">
        <button onClick={handleDownload} className="download-button">
          บันทึกรูป
        </button>
        <div className="footer-links">
          <a href="https://www.instagram.com/awareness.indeed2025?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="footer-button">
            About Us
          </a>
          <a href="https://www.instagram.com/awareness.indeed2025?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="footer-button">
            Website
          </a>
        </div>
      </footer>
    </div>
  );
}

export default ResultCard;