import React from 'react';
import '../Section.css';

function SafeSection({ onNavigate, imageSrc }) {
    return (
        <div className="section safe">
            <div className="status-header">
                <h1 className="safe-title">LIKELY SAFE</h1>
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
                <button className="open-url-btn">OPEN URL</button>
            </div>
        </div>
    );
}

export default SafeSection;