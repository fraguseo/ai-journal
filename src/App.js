import React, { useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Journal from './components/Journal';
import Diary from './components/Diary';
import Home from './components/Home';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'chat':
        return <Journal onBack={() => setCurrentPage('home')} />;
      case 'diary':
        return <Diary onBack={() => setCurrentPage('home')} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        {renderPage()}
      </Box>
    </ChakraProvider>
  );
}

export default App;
