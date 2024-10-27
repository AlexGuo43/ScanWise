import React, { useState } from 'react';
import './App.css';
import MaliciousSection from './components/MaliciousSection';
import SafeSection from './components/SafeSection';
import HomeScreen from './components/HomeScreen';

function App() {
  const [visibleSection, setVisibleSection] = useState('home');
  const [capturedImage, setCapturedImage] = useState(null);
  const [url, setUrl] = useState(null);

  const handleNavigate = (section, image, url) => {
    setVisibleSection(section);
    setUrl(url);
    if (image) {
      setCapturedImage(image); // Save the captured image
    }
  };

  const renderSection = () => {
    switch (visibleSection) {
      case 'malicious':
        return <MaliciousSection onNavigate={handleNavigate} imageSrc={capturedImage} url={url}/>;
      case 'safe':
        return <SafeSection onNavigate={handleNavigate} imageSrc={capturedImage} url={url}/>;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="container">
      {renderSection()}
    </div>
  );
}

export default App;