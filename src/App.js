import React, { useState } from 'react';
import './App.css';
import MaliciousSection from './components/MaliciousSection';
import SafeSection from './components/SafeSection';
import HomeScreen from './components/HomeScreen';

function App() {
  // State to control which section is visible ('home', 'malicious', or 'safe')
  const [visibleSection, setVisibleSection] = useState('home');

  // Function to render the correct section based on the state
  const renderSection = () => {
    switch (visibleSection) {
      case 'malicious':
        return <MaliciousSection onNavigate={setVisibleSection} />;
      case 'safe':
        return <SafeSection onNavigate={setVisibleSection} />;
      default:
        return <HomeScreen onNavigate={setVisibleSection} />;
    }
  };

  return (
    <div className="container">
      {renderSection()}
    </div>
  );
}

export default App;
