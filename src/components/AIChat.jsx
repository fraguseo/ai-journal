import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Textarea,
  VStack,
  Text,
  HStack,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

function AIChat({ onBack }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);

    try {
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6}>
        <HStack w="100%" justify="space-between">
          <Button 
            leftIcon={<ArrowBackIcon />} 
            onClick={onBack}
            variant="ghost"
          >
            Back
          </Button>
          <Text fontSize="2xl" fontWeight="bold">
            AI Chat
          </Text>
          <Box w={20}></Box>
        </HStack>

        <VStack spacing={4} w="100%" align="stretch">
          {messages.map((msg, index) => (
            <Box key={index} p={4} bg={msg.role === 'user' ? 'gray.100' : 'blue.50'} borderRadius="md">
              <Text>{msg.content}</Text>
            </Box>
          ))}
        </VStack>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your thoughts here..."
          size="lg"
        />

        <Button 
          colorScheme="blue" 
          onClick={handleSubmit}
          isLoading={isLoading}
          w="100%"
        >
          Send
        </Button>
      </VStack>
    </Container>
  );
}

export default AIChat; 