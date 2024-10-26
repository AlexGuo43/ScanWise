import React, { useState } from 'react';
import './App.css';
import MaliciousSection from './components/MaliciousSection';
import SafeSection from './components/SafeSection';
import HomeScreen from './components/HomeScreen';

function App() {
  const [visibleSection, setVisibleSection] = useState('home');
  const [capturedImage, setCapturedImage] = useState(null);

  const handleNavigate = (section, image) => {
    setVisibleSection(section);
    if (image) {
      setCapturedImage(image); // Save the captured image
    }
  };

  const renderSection = () => {
    switch (visibleSection) {
      case 'malicious':
        return <MaliciousSection onNavigate={handleNavigate} imageSrc={capturedImage} />;
      case 'safe':
        return <SafeSection onNavigate={handleNavigate} imageSrc={capturedImage} />;
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