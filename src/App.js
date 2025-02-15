import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './components/Home';
import Journal from './components/Journal';
import Diary from './components/Diary';
import MoodRecipes from './components/MoodRecipes';
import Dream from './components/Dream';

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
      default:
        return (
          <Home 
            onJournalClick={() => setCurrentPage('journal')}
            onDiaryClick={() => setCurrentPage('diary')}
            onRecipesClick={() => setCurrentPage('recipes')}
            onDreamClick={() => setCurrentPage('dream')}
          />
        );
    }
  };

  return (
    <ChakraProvider>
      {renderPage()}
    </ChakraProvider>
  );
}

export default App;
