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

  return (
    <div className="section home-screen">
      <div className="logo">
        <img
          src="/logo.png"
          alt="Scanwise AI Logo"
          style={{ marginBottom: '5px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <h2
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              color: '#4844e2',
              margin: 0  /* Removed margin */
            }}
          >
            ScanWise
          </h2>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              color: '#888',
              margin: 0  /* Removed margin */
            }}
          >
            Secure Scanning with AI
          </p>
        </div>
      </div>
      <div className="content">
        <div
          className="camera-icon-placeholder"
          onClick={handleCameraClick}
          style={{
            width: '100%',
            height: '375px', // Increased height to fill more vertical space
            position: 'relative',
            marginBottom: '30px',
            borderRadius: '15px',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0',
          }}
        >
          {!imageSrc && !isCameraActive && (
            <p
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '16px',
                color: '#888',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Click to Access Camera
            </p>
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
                borderRadius: '15px',
              }}
            ></video>
          )}
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Captured"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '15px',
                objectFit: 'cover',
              }}
            />
          )}
        </div>

        {/* Scan QR Code Button */}
        {isCameraActive && (
          <button
            onClick={handleScanQRCode}
            className="scan-qr-button"
            style={{
              marginTop: '20px',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '150px',
              height: '150px',
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
            }}
          >
            Scan QR Code
          </button>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;