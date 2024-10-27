import React from 'react';
import '../Section.css';

function MaliciousSection({ onNavigate, imageSrc, url }) {
  return (
    <div className="section malicious">
      {/* Back Button */}
      <button 
          className="back-button" 
          onClick={() => onNavigate('home')}
        >
          Back
        </button>
      <div className="status-header">
        <h1 className="malicious-title">LIKELY MALICIOUS</h1>
      </div>
      <div className="image-container">
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Captured"
            className="captured-image"
          />
        )}
      </div>
      <div className="actions">
        <button className="report-btn">REPORT</button>
        {console.log(url)}
        <button className="open-url-btn" onClick={() => window.location.href = url}>OPEN URL (RISKY)</button>
      </div>
    </div>
  );
}

export default MaliciousSection;