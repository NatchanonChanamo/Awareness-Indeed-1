import React, { useState } from 'react';
import './EmergencyHelp.css';

function EmergencyHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  const closeHelp = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* ปุ่มเครื่องหมายตกใจ */}
      <button 
        className="emergency-help-button"
        onClick={toggleHelp}
        aria-label="ช่วยเหลือฉุกเฉิน"
        type="button"
      >
        !
      </button>

      {/* กล่องข้อความ */}
      {isOpen && (
        <>
          {/* Background overlay */}
          <div className="emergency-overlay" onClick={closeHelp}></div>
          
          {/* Help content */}
          <div className="emergency-help-content">
            <div className="emergency-help-header">
              <h3>หากต้องการใช้งานสายด่วนสุขภาพจิต</h3>
              <button 
                className="emergency-close-button"
                onClick={closeHelp}
                aria-label="ปิด"
              >
                ×
              </button>
            </div>
            
            <div className="emergency-help-body">
              <div className="help-section">
                <h4>กรมสุขภาพจิต</h4>
                <div className="phone-number">1323</div>
                <p>ให้คำปรึกษาเรื่องซึมเศร้า วิตกกังวล ความเครียด ความคิดฆ่าตัวตาย รวมถึงประสานส่งต่อถึงสถานรักษา เหมาะกับทุกคน ทุกวัย <strong>ฟรี 24 ชั่วโมง</strong></p>
              </div>

              <div className="help-section">
                <h4>ศูนย์ช่วยเหลือสังคม</h4>
                <div className="phone-number">1300</div>
                <p>ให้คำปรึกษาปัญหาครอบครัว วัยรุ่น ผู้สูงอายุ ปัญหาสุขภาพจิต และการใช้สารเสพติด <strong>ตลอด 24 ชม. ฟรี</strong></p>
              </div>

              <div className="help-section">
                <h4>Samaritans of Thailand</h4>
                <div className="phone-group">
                  <div className="phone-item">
                    <span className="phone-label">เบอร์ไทย:</span>
                    <span className="phone-number small">02-713-6793</span>
                    <span className="phone-time">(เวลา 12:00–22:00)</span>
                  </div>
                  <div className="phone-item">
                    <span className="phone-label">เบอร์อังกฤษ (callback):</span>
                    <span className="phone-number small">02-713-6791</span>
                    <span className="phone-time">(บริการโทรกลับภายใน 24 ชม.)</span>
                  </div>
                </div>
                <p>บริการให้กำลังใจคนทุกวัยไม่จำกัดภาษา</p>
              </div>

              <div className="emergency-note">
                <p><strong>หมายเหตุ:</strong> บริการทั้งหมดนี้ให้ความช่วยเหลือฟรี หากคุณรู้สึกไม่สบายใจ กรุณาติดต่อขอความช่วยเหลือทันที</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default EmergencyHelp;