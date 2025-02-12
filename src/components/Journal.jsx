import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Textarea,
  VStack,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';

function Journal() {
  const [entry, setEntry] = useState('');
  const [aiResponse, setAiResponse] = useState('');
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
      setAiResponse(data.response);
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
        
        <Textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          size="lg"
          minH="200px"
        />
        
        <Button 
          colorScheme="blue" 
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Getting insights..."
        >
          Get AI Insights
        </Button>

        {aiResponse && (
          <Box
            p={4}
            bg="blue.50"
            w="100%"
            borderRadius="md"
          >
            <Text>{aiResponse}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

export default Journal; 