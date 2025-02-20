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
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'journal':
        return <Journal onBack={() => setCurrentPage('home')} />;
      case 'diary':
        return <Diary onBack={() => setCurrentPage('home')} />;
      case 'recipes':
        return <MoodRecipes onBack={() => setCurrentPage('home')} />;
      case 'dream':
        return <Dream onBack={() => setCurrentPage('home')} />;
      case 'goals':
        return <GoalTracker onBack={() => setCurrentPage('home')} />;
      default:
        return (
          <Home 
            onJournalClick={() => setCurrentPage('journal')}
            onDiaryClick={() => setCurrentPage('diary')}
            onRecipesClick={() => setCurrentPage('recipes')}
            onDreamClick={() => setCurrentPage('dream')}
            onGoalsClick={() => setCurrentPage('goals')}
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
      {renderPage()}
    </ChakraProvider>
  );
}

export default App;
