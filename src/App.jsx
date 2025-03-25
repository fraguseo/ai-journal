import React, { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './components/Login';
import Journal from './components/Journal';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {isLoggedIn ? (
          <Journal onLogout={() => setIsLoggedIn(false)} />
        ) : (
          <Login onLogin={() => setIsLoggedIn(true)} />
        )}
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App; 