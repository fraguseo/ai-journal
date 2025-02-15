import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Textarea,
  Text,
  VStack,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

function Dream({ onBack }) {
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dream }),
      });

      if (!response.ok) throw new Error('Failed to get interpretation');

      const data = await response.json();
      setInterpretation(data.response);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get dream interpretation',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Button 
          leftIcon={<ArrowBackIcon />} 
          onClick={onBack}
          variant="ghost"
          alignSelf="flex-start"
        >
          Back
        </Button>

        <Heading textAlign="center">Dream Catcher</Heading>
        <Text textAlign="center" color="gray.600">
          Share your dream and receive an interpretation
        </Text>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder="Describe your dream here..."
              size="lg"
              minH="200px"
            />
            <Button
              type="submit"
              colorScheme="purple"
              isLoading={isLoading}
              loadingText="Interpreting..."
              w="full"
            >
              Get Interpretation
            </Button>
          </VStack>
        </form>

        {interpretation && (
          <Box
            mt={6}
            p={6}
            bg="white"
            boxShadow="md"
            borderRadius="md"
          >
            <Text whiteSpace="pre-wrap">{interpretation}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

export default Dream; 