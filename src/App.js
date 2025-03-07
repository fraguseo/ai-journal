import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import MainMenu from './components/MainMenu';
import Diary from './components/Diary';
import AIChat from './components/AIChat';
import MoodRecipes from './components/MoodRecipes';
import Dream from './components/Dream';
import GoalTracker from './components/GoalTracker';
import MorningThoughts from './components/MorningThoughts';
import Login from './components/Login';

function App() {
  const [currentView, setCurrentView] = useState('main');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (token) => {
    setIsAuthenticated(true);
    setCurrentView('main');
  };

  const renderView = () => {
    switch (currentView) {
      case 'diary':
        return <Diary onBack={() => setCurrentView('main')} />;
      case 'chat':
        return <AIChat onBack={() => setCurrentView('main')} />;
      case 'recipes':
        return <MoodRecipes onBack={() => setCurrentView('main')} />;
      case 'dream':
        return <Dream onBack={() => setCurrentView('main')} />;
      case 'goals':
        return <GoalTracker onBack={() => setCurrentView('main')} />;
      case 'morningThoughts':
        return <MorningThoughts onBack={() => setCurrentView('main')} />;
      default:
        return (
          <MainMenu 
            onDiaryClick={() => setCurrentView('diary')}
            onChatClick={() => setCurrentView('chat')}
            onRecipesClick={() => setCurrentView('recipes')}
            onDreamClick={() => setCurrentView('dream')}
            onGoalsClick={() => setCurrentView('goals')}
            onMorningThoughtsClick={() => setCurrentView('morningThoughts')}
          />
        );
    }
  };

  useEffect(() => {
    const keepAlive = setInterval(() => {
      fetch('https://ai-journal-backend-01bx.onrender.com/health')
        .catch(console.error);
    }, 840000);
    
    return () => clearInterval(keepAlive);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <ChakraProvider>
      {renderView()}
    </ChakraProvider>
  );
}

export default App;
