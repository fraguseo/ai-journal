import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  VStack,
  Text,
  HStack,
  UnorderedList,
  ListItem,
  Input,
  useToast,
  IconButton
} from '@chakra-ui/react';
import { ArrowBackIcon, AddIcon, DeleteIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create a wrapper component
function MorningThoughtsWithQuery({ onBack }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MorningThoughts onBack={onBack} />
    </QueryClientProvider>
  );
}

function MorningThoughts({ onBack }) {
  const [newThought, setNewThought] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const recognition = useRef(null);
  const toast = useToast();

  // Query for fetching thoughts
  const { data: thoughtsData, isLoading } = useQuery({
    queryKey: ['thoughts', date],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com/api/morning-thoughts?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Fetched thoughts:', data);
      return data;
    }
  });

  // Get thoughts array from data
  const thoughts = thoughtsData?.thoughts || [];

  // Mutation for saving thoughts
  const saveMutation = useMutation({
    mutationFn: async (newThoughts) => {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/morning-thoughts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          thoughts: newThoughts,
          date
        })
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Thoughts saved!',
        status: 'success',
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error saving thoughts',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  });

  const addThought = () => {
    if (newThought.trim()) {
      const updatedThoughts = [...thoughts, newThought.trim()];
      saveMutation.mutate(updatedThoughts);
      setNewThought('');
    }
  };

  const removeThought = (index) => {
    const updatedThoughts = thoughts.filter((_, i) => i !== index);
    saveMutation.mutate(updatedThoughts);
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      
      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setNewThought(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "There was a problem with speech recognition",
          status: "error",
          duration: 3000,
        });
        stopRecording();
      };
    }
  };

  const startRecording = async () => {
    try {
      if (!recognition.current) {
        initializeSpeechRecognition();
      }
      
      if (recognition.current) {
        recognition.current.start();
        setIsRecording(true);
      } else {
        throw new Error('Speech recognition not supported');
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast({
        title: "Error",
        description: "Speech recognition is not supported in your browser",
        status: "error",
        duration: 3000,
      });
    }
  };

  const stopRecording = () => {
    if (recognition.current && isRecording) {
      recognition.current.stop();
      setIsRecording(false);
      
      // Add the transcribed thought if it exists
      if (newThought.trim()) {
        addThought();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addThought();
    }
  };

  const refreshThoughts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Manually refreshing thoughts for date:', date);

      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com/api/morning-thoughts?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Manual refresh response:', data);

      if (data && data.thoughts) {
        console.log('Setting thoughts from refresh:', data.thoughts);
        setThoughts(data.thoughts);
      }
    } catch (error) {
      console.error('Error refreshing thoughts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Button leftIcon={<ArrowBackIcon />} onClick={onBack} variant="ghost">
            Back
          </Button>
          <Text fontSize="2xl" fontWeight="bold">Morning Thoughts</Text>
          <Button 
            onClick={refreshThoughts} 
            isLoading={isLoading}
            variant="ghost"
          >
            Refresh
          </Button>
        </HStack>

        <HStack spacing={4} w="100%" justify="center">
          <Box position="relative" width="200px">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              maxW="200px"
              textAlign="center"
              cursor="pointer"
              _hover={{ borderColor: 'blue.500' }}
              pr="40px"  // Make space for the icon
            />
            <ChevronDownIcon
              position="absolute"
              right="10px"
              top="50%"
              transform="translateY(-50%)"
              color="gray.500"
              w={5}
              h={5}
              pointerEvents="none"
            />
          </Box>
        </HStack>

        <Box 
          p={6} 
          bg="white" 
          borderRadius="md" 
          boxShadow="sm"
          minH="70vh"
          position="relative"
          backgroundImage="linear-gradient(#edf2f7 1px, transparent 1px)"
          backgroundSize="100% 2rem"
          style={{ 
            backgroundAttachment: 'local',
          }}
        >
          <UnorderedList spacing={3} styleType="none" ml={0}>
            {thoughts.map((thought, index) => (
              <ListItem key={index} display="flex" alignItems="center">
                <Text as="span" mr={2}>•</Text>
                <Text flex="1">{thought}</Text>
                <IconButton
                  icon={<DeleteIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => removeThought(index)}
                  aria-label="Delete thought"
                />
              </ListItem>
            ))}
          </UnorderedList>
        </Box>

        <HStack>
          <Input
            placeholder="Add a new thought..."
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            leftIcon={<AddIcon />}
            onClick={addThought}
            colorScheme="blue"
          >
            Add
          </Button>
          <IconButton
            icon={isRecording ? <FaStop /> : <FaMicrophone />}
            onClick={isRecording ? stopRecording : startRecording}
            colorScheme={isRecording ? "red" : "blue"}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          />
        </HStack>
      </VStack>
    </Container>
  );
}

// Export the wrapped component
export default MorningThoughtsWithQuery; 