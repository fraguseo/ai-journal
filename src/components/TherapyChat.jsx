import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  VStack,
  Text,
  Textarea,
  HStack,
  useToast,
  Progress,
  Select,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

function TherapyChat({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionType, setSessionType] = useState('general');
  const toast = useToast();

  const sessionTypes = {
    general: "Open Discussion",
    cbt: "CBT Exercise",
    reflection: "Guided Reflection",
    anxiety: "Anxiety Management",
    stress: "Stress Relief"
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);

    try {
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/therapy-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          message: input,
          sessionType,
          history: messages
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      setInput('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response',
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
        <HStack w="100%" justify="space-between">
          <Button 
            leftIcon={<ArrowBackIcon />} 
            onClick={onBack}
            variant="ghost"
          >
            Back
          </Button>
          <Text fontSize="2xl" fontWeight="bold">
            Therapy Chat
          </Text>
          <Box w={20}></Box>
        </HStack>

        <Select
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
          mb={4}
        >
          {Object.entries(sessionTypes).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </Select>

        <Box 
          w="100%" 
          h="60vh" 
          overflowY="auto" 
          p={4} 
          borderWidth={1} 
          borderRadius="md"
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              bg={msg.role === 'user' ? 'blue.50' : 'green.50'}
              p={3}
              borderRadius="md"
              mb={2}
              maxW="80%"
              ml={msg.role === 'user' ? 'auto' : '0'}
            >
              <Text>{msg.content}</Text>
            </Box>
          ))}
          {isLoading && <Progress size="xs" isIndeterminate />}
        </Box>

        <HStack w="100%">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Send
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}

export default TherapyChat; 