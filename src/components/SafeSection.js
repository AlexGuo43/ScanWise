import React from 'react';
import '../Section.css';

function SafeSection({ onNavigate, imageSrc, url }) {
    return (
      <div className="section safe">
        {/* Back Button */}
        <button 
          className="back-button" 
          onClick={() => onNavigate('home')}
        >
          Back
        </button>
  
        {/* Status Section */}
        <div className="status-header">
          <h1 className="safe-title">LIKELY SAFE</h1>
        </div>
  
        {/* Captured Image */}
        <div className="image-container">
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Captured"
              className="captured-image"
            />
          )}
        </div>
  
        {/* Action Buttons */}
        <div className="actions">
          <button className="report-btn">REPORT</button> {/* New Report Button */}
          <button 
            className="open-url-btn" 
            onClick={() => window.location.href = url}
          >
            OPEN URL
          </button>
        </div>
      </div>
    );
  }

export default SafeSection;