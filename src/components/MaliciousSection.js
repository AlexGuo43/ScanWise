import React from 'react';
import '../Section.css';
import axios from 'axios';

function MaliciousSection({ onNavigate, imageSrc, url }) {
  // Base URL of your Python backend
  const BASE_URL = 'http://localhost:5000';

  // Function to report a URL as malicious
  const reportUrl = async (url) => {
    try {
      const response = await axios.post(`${BASE_URL}/report-url`, { url });
      return response.data.message;
    } catch (error) {
      console.error('Error reporting URL:', error);
      return null;
    }
  };

  // Handler for the REPORT button
  const handleReportClick = async () => {
    if (url) {
      const result = await reportUrl(url);
      if (result) {
        alert('URL reported successfully');
      } else {
        alert('Error reporting the URL');
      }
    } else {
      alert('No URL provided');
    }
  };

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
        {/* Report Button with onClick Handler */}
        <button
          className="report-btn"
          onClick={handleReportClick} // Attach the report handler here
        >
          REPORT
        </button>

        {/* Open URL Button */}
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

export default MaliciousSection;