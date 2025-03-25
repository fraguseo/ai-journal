import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Textarea,
  VStack,
  Text,
  useToast,
  HStack,
  Select,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import MorningThoughts from './MorningThoughts';

function Journal({ onBack }) {
  const [entry, setEntry] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const toast = useToast();
  const [journalType, setJournalType] = useState('free');
  const [promptAnswers, setPromptAnswers] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mood, setMood] = useState('');
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [activeComponent, setActiveComponent] = useState('main');

  const journalTypes = {
    gratitude: [
      "What are you grateful for today?",
      "Who made a positive impact on your day?",
      "What small joy did you experience?"
    ],
    reflection: [
      "What challenged you today?",
      "What did you learn?",
      "What would you do differently?"
    ]
  };

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
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entry: entry,
          date: selectedDate,
          mood: mood,
          moodIntensity: moodIntensity,
          journalType: journalType,
          prompts: Object.entries(promptAnswers).map(([question, answer]) => ({
            question,
            answer
          }))
        }),
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

  const retryConnection = async () => {
    // Retry logic for first connection
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'morning-thoughts':
        return <MorningThoughts onBack={() => setActiveComponent('main')} />;
      default:
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
              
              <Select
                value={journalType}
                onChange={(e) => setJournalType(e.target.value)}
                mb={4}
                placeholder="Select Journal Type"
              >
                <option value="free">Free Writing</option>
                <option value="gratitude">Gratitude Journal</option>
                <option value="reflection">Daily Reflection</option>
              </Select>

              {journalType !== 'free' && (
                <VStack spacing={4} mb={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    {journalType === 'gratitude' ? 'Gratitude Prompts' : 'Reflection Prompts'}
                  </Text>
                  {journalTypes[journalType].map((prompt, index) => (
                    <Box key={index}>
                      <Text mb={2}>{prompt}</Text>
                      <Textarea
                        value={promptAnswers[prompt] || ''}
                        onChange={(e) => setPromptAnswers(prev => ({
                          ...prev,
                          [prompt]: e.target.value
                        }))}
                        placeholder="Your answer..."
                      />
                    </Box>
                  ))}
                </VStack>
              )}
              
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
  };

  return renderComponent();
}

export default Journal; 