import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Textarea,
  VStack,
  Text,
  Input,
  useToast,
} from '@chakra-ui/react';

function Diary() {
  const [entry, setEntry] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry, date }),
      });

      if (!response.ok) {
        throw new Error('Failed to save diary entry');
      }

      const data = await response.json();
      toast({
        title: 'Diary entry saved!',
        status: 'success',
        duration: 2000,
      });
      setEntry('');
    } catch (error) {
      toast({
        title: 'Error saving entry',
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
          Daily Diary
        </Text>
        
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="lg"
        />
        
        <Textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write about your day..."
          size="lg"
          minH="200px"
        />
        
        <Button 
          colorScheme="green" 
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Saving..."
          w="100%"
        >
          Save Entry
        </Button>
      </VStack>
    </Container>
  );
}

export default Diary; 