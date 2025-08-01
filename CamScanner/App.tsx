/**
 * CamScanner - Document Scanner App
 * @format
 */

import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import DocumentScreen from './src/screens/DocumentScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const navigate = (screen, params = {}) => {
    setCurrentScreen(screen);
    if (params.document) {
      setSelectedDocument(params.document);
    }
  };

  const goBack = () => {
    setCurrentScreen('Home');
    setSelectedDocument(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Scan':
        return <ScanScreen navigation={{ navigate, goBack }} />;
      case 'Document':
        return <DocumentScreen 
          route={{ params: { document: selectedDocument } }} 
          navigation={{ navigate, goBack }} 
        />;
      default:
        return <HomeScreen navigation={{ navigate, goBack }} />;
    }
  };

  return renderScreen();
}

export default App;
