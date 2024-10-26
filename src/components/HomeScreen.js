import React, { useState } from 'react';
import '../Section.css'; // Shared styles for sections

function HomeScreen({ onNavigate }) {
    return (
      <div className="section home-screen">
        <div className="logo">
          <img src="/logo.png" alt="Scanwise AI Logo" />
        </div>
        <div className="content">
          <div className="camera-icon-placeholder" onClick={() => onNavigate('malicious')}>
            {/* Placeholder or captured image goes here */}
            <p>Click to Analyze QR Code</p>
          </div>
        </div>
        <div className="actions">
          <button className="scan-btn" onClick={() => onNavigate('safe')}>Go to Safe Screen</button>
        </div>
      </div>
    );
  }
  
  export default HomeScreen;