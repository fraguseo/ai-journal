import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Textarea,
  VStack,
  Text,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

// Remove any Diary or Journal imports if they exist
// import Diary from './Diary';  // Remove this if it exists

function AIChat({ onBack }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);

    try {
      console.log('Sending message:', input); // Debug log

      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData); // Debug log
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      console.log('AI response:', data); // Debug log
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={4}>
      <VStack h="100vh" spacing={4}>
        <HStack w="100%" justify="space-between" py={2} borderBottom="1px" borderColor="gray.200">
          <Button 
            leftIcon={<ArrowBackIcon />} 
            onClick={onBack}
            variant="ghost"
          >
            Back
          </Button>
          <Text fontSize="xl" fontWeight="bold">
            AI Assistant
          </Text>
          <Box w={20}></Box>
        </HStack>

        <Flex
          direction="column"
          flex={1}
          w="100%"
          overflowY="auto"
          px={2}
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.200',
              borderRadius: '24px',
            },
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
              maxW="80%"
              mb={4}
            >
              <Box
                bg={msg.role === 'user' ? 'blue.500' : 'gray.100'}
                color={msg.role === 'user' ? 'white' : 'black'}
                p={3}
                borderRadius="lg"
                borderTopRightRadius={msg.role === 'user' ? 0 : 'lg'}
                borderTopLeftRadius={msg.role === 'assistant' ? 0 : 'lg'}
              >
                <Text>{msg.content}</Text>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Flex>

        <HStack w="100%" p={2} borderTop="1px" borderColor="gray.200">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            size="md"
            resize="none"
            rows={1}
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
            rightIcon={<ArrowForwardIcon />}
          >
            Send
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}

export default AIChat; 