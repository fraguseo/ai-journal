import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './components/Home';
import Journal from './components/Journal';
import Diary from './components/Diary';
import MoodRecipes from './components/MoodRecipes';
import Dream from './components/Dream';
import GoalTracker from './components/GoalTracker';
import MainMenu from './components/MainMenu';
import AIChat from './components/AIChat';

// Dream Catcher feature added

function App() {
  const [currentView, setCurrentView] = useState('main');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderView = () => {
    switch (currentView) {
      case 'diary':
        return <Diary onBack={() => setCurrentView('main')} />;
      case 'chat':
        return <AIChat onBack={() => setCurrentView('main')} />;
      case 'recipes':
        return <MoodRecipes onBack={() => setCurrentView('main')} />;
      default:
        return (
          <MainMenu 
            onDiaryClick={() => setCurrentView('diary')}
            onChatClick={() => setCurrentView('chat')}
            onRecipesClick={() => setCurrentView('recipes')}
          />
        );
    }
  };

  useEffect(() => {
    const keepAlive = setInterval(() => {
      fetch('https://ai-journal-backend-01bx.onrender.com/health')
        .catch(console.error);
    }, 840000); // 14 minutes
    
    return () => clearInterval(keepAlive);
  }, []);

  return (
    <ChakraProvider>
      {renderView()}
    </ChakraProvider>
  );
}

export default App;
