import React, { useState, useRef, useEffect } from 'react';
import '../Section.css';
import axios from 'axios';

function HomeScreen({ onNavigate }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  const handleCameraClick = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
      });
  };

  // Automatically trigger the camera feed after the first click
  useEffect(() => {
    if (isCameraActive && videoRef.current && !videoRef.current.srcObject) {
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      videoRef.current.dispatchEvent(clickEvent);
    }
  }, [isCameraActive]);

  const sendImageToBackend = async (imageData) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/scan',
        {
          image: imageData,
        },
      );

      if (response.status === 200) {
        const data = response.data;
        const url = data.url;        
        if (data.status === 'safe') {
          onNavigate('safe', imageData, url); // Pass the image data when navigating
        } else if (data.status === 'malicious') {
          onNavigate('malicious', imageData, url); // Pass the image data when navigating
        }
      } else {
        console.error('Failed to scan QR code:', response.statusText);
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
    }
  };

  const handleScanQRCode = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedImage = canvas.toDataURL('image/png');
      setImageSrc(capturedImage);

      sendImageToBackend(capturedImage);

      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }

      setIsCameraActive(false);
    } else {
      console.error('Video element or video stream is not available.');
    }
  };

  // Function to handle manual navigation for testing
  const handleManualNavigation = (type, url) => {
    if (type === 'malicious') {
      console.log(url);
      onNavigate('malicious', imageSrc, url); // Manually navigate to Malicious screen
    } else if (type === 'safe') {
      onNavigate('safe', imageSrc, url); // Manually navigate to Safe screen
    }
  };

  return (
    <div className="section home-screen">
      <div className="logo">
        <img src="/logo.png" alt="Scanwise AI Logo" />
      </div>
      <div className="content">
        <div className="camera-icon-placeholder" onClick={handleCameraClick}>
          {!imageSrc && !isCameraActive && (
            <p>Click to Access Camera</p>
          )}
          {isCameraActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
            ></video>
          )}
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Captured"
              style={{ width: '100%', height: '100%', borderRadius: '10px' }}
            />
          )}
        </div>

        {/* Scan QR Code Button */}
        {isCameraActive && (
          <button onClick={handleScanQRCode} style={{ marginTop: '10px' }}>Scan QR Code</button>
        )}

        {/* Temporary Buttons for Testing Navigation */}
        <div className="actions" style={{ marginTop: '20px' }}>
          <button onClick={() => handleManualNavigation('malicious')} style={{ marginBottom: '10px' }}>
            Simulate Malicious
          </button>
          <button onClick={() => handleManualNavigation('safe')}>
            Simulate Safe
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;