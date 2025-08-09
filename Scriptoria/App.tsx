/**
 * Scriptoria - Document Scanner App
 * @format
 */

import React, { useState } from 'react';
import DocumentScreen from './src/screens/DocumentScreen';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';

type ScreenName = 'Home' | 'Scan' | 'Document';

interface NavigationParams {
  document?: any;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Home');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const navigate = (screen: ScreenName, params: NavigationParams = {}) => {
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
