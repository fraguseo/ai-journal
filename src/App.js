import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './components/Home';
import Journal from './components/Journal';
import Diary from './components/Diary';
import MoodRecipes from './components/MoodRecipes';
import Dream from './components/Dream';
import GoalTracker from './components/GoalTracker';

// Dream Catcher feature added

function App() {
  const [view, setView] = useState('main');

  const renderView = () => {
    switch (view) {
      case 'main':
        return <Journal onNavigate={setView} />;
      case 'diary':
        return <Diary onBack={() => setView('main')} />;
      case 'recipes':
        return <MoodRecipes onBack={() => setView('main')} />;
      case 'goals':
        return <GoalTracker onBack={() => setView('main')} />;
      default:
        return <Journal onNavigate={setView} />;
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
