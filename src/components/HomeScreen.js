import React, { useState, useRef } from 'react';
import '../Section.css';
import axios from 'axios';

function HomeScreen({ onNavigate }) {
  const [imageSrc, setImageSrc] = useState(null); // State to hold captured image
  const [isCameraActive, setIsCameraActive] = useState(false); // State to track camera visibility
  const videoRef = useRef(null); // Ref for the video element

  // Start the user's camera
  const handleCameraClick = () => {
    // Activate camera and show video feed
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        setIsCameraActive(true); // Show the video feed
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
      });
  };

  // Function to send the captured image to the local Python server using axios
  const sendImageToBackend = async (imageData) => {
    try {
      const response = await axios.post('http://localhost:5000/scan', {
        image: imageData,
      });

      if (response.status === 200) {
        const data = response.data;
        if (data.status === 'safe') {
          onNavigate('safe'); // Navigate to the safe screen
        } else if (data.status === 'malicious') {
          onNavigate('malicious'); // Navigate to the malicious screen
        }
      } else {
        console.error('Failed to scan QR code:', response.statusText);
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
    }
  };

  // Capture an image from the video stream and send it to the local server
  const handleScanQRCode = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      // Create a canvas to draw the captured frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedImage = canvas.toDataURL('image/png'); // Convert to image data
      setImageSrc(capturedImage); // Update state with captured image

      // Send the captured image to the local server for QR code analysis
      sendImageToBackend(capturedImage);

      // Stop the video stream only if it exists
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }

      setIsCameraActive(false); // Hide the video feed
    } else {
      console.error('Video element or video stream is not available.');
    }
  };

  return (
    <div className="section home-screen">
      <div className="logo">
        <img src="/logo.png" alt="Scanwise AI Logo" />
      </div>
      <div className="content">
        {/* Placeholder or captured image */}
        <div className="camera-icon-placeholder" onClick={handleCameraClick}>
          {!imageSrc && !isCameraActive && (
            <p>Click to Access Camera</p>
          )}
          {/* Video element for live feed, shown only when the camera is active */}
          {isCameraActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                position: 'absolute',  // Make the video cover the box
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',  // Cover the container while maintaining aspect ratio
                borderRadius: '10px',
              }}
            ></video>
          )}
          {/* Show captured image if available */}
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
      </div>
    </div>
  );
}

export default HomeScreen;