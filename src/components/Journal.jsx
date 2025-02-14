import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Textarea,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';

function Journal() {
  const [entry, setEntry] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!entry.trim()) {
      toast({
        title: 'Please write something first',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    setMessages(prev => [...prev, { type: 'user', content: entry }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { type: 'ai', content: data.response }]);
      setEntry('');
    } catch (error) {
      toast({
        title: 'Error getting AI response',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6}>
        <Text fontSize="2xl" fontWeight="bold">
          AI Journal
        </Text>
        
        <VStack spacing={4} w="100%" align="stretch">
          {messages.map((message, index) => (
            <Box
              key={index}
              p={4}
              bg={message.type === 'user' ? 'blue.100' : 'blue.50'}
              borderRadius="lg"
              alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
              maxW="80%"
            >
              <Text>{message.content}</Text>
            </Box>
          ))}
        </VStack>
        
        <Textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          size="lg"
          minH="100px"
        />
        
        <Button 
          colorScheme="blue" 
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Getting insights..."
        >
          Get AI Insights
        </Button>
      </VStack>
    </Container>
  );
}

export default Journal; 