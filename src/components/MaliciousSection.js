import React from 'react';
import '../Section.css'; // Shared styles for sections

function MaliciousSection() {
    return (
        <div className="section malicious">
            <div className="status">
                <button className="malicious-btn">LIKELY MALICIOUS</button>
            </div>
            <div className="content">
                <div className="image-placeholder">
                    <img src="image-icon.png" alt="Analyzed Image" className="placeholder-icon" />
                </div>
            </div>
            <div className="actions">
                <button className="report-btn">REPORT</button>
                <button className="risky-btn">OPEN URL (RISKY)</button>
            </div>
        </div>
    );
}

export default MaliciousSection;