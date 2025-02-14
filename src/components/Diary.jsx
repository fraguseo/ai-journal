import React, { useState, useEffect } from 'react';
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
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchEntries = async () => {
    try {
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/diary');
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      toast({
        title: 'Error fetching entries',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

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

        <VStack spacing={4} w="100%" align="stretch">
          {entries.map((entry) => (
            <Box
              key={entry._id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              shadow="sm"
            >
              <Text fontWeight="bold">
                {new Date(entry.date).toLocaleDateString()}
              </Text>
              <Text mt={2}>{entry.entry}</Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}

export default Diary; 