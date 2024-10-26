import React from 'react';
import '../Section.css'; // Shared styles for sections

function SafeSection() {
    return (
        <div className="section safe">
            <div className="status">
                <button className="safe-btn">LIKELY SAFE</button>
            </div>
            <div className="content">
                <div className="image-placeholder">
                    <img src="image-icon.png" alt="Analyzed Image" className="placeholder-icon" />
                </div>
            </div>
            <div className="actions">
                <button className="open-url-btn">OPEN URL</button>
            </div>
        </div>
    );
}

export default SafeSection;