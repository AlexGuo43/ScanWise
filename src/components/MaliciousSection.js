import React from 'react';
import './Section.css';

function MaliciousSection({ onNavigate, imageSrc }) {
  return (
    <div className="section malicious">
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
        <button className="open-url-btn">OPEN URL (RISKY)</button>
      </div>
    </div>
  );
}

export default MaliciousSection;