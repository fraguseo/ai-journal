import React, { useState, useRef, useEffect } from 'react';
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
import { ArrowBackIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaMicrophone, FaStop } from 'react-icons/fa';

function MorningThoughts({ onBack }) {
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const recognition = useRef(null);
  const toast = useToast();

  // Load thoughts when date changes
  useEffect(() => {
    console.log('Loading thoughts for date:', date); // Debug log
    loadThoughts();
  }, [date]);

  const loadThoughts = async () => {
    try {
      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com/api/morning-thoughts?date=${date}`);
      const data = await response.json();
      console.log('Loaded thoughts:', data); // Debug log
      if (data && data.thoughts) {
        setThoughts(data.thoughts);
      } else {
        setThoughts([]); // Reset if no thoughts found
      }
    } catch (error) {
      console.error('Error loading thoughts:', error);
      toast({
        title: "Error",
        description: "Failed to load thoughts",
        status: "error",
        duration: 3000,
      });
    }
  };

  const saveThoughts = async (updatedThoughts) => {
    try {
      console.log('Saving thoughts:', { thoughts: updatedThoughts, date }); // Debug log
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/morning-thoughts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thoughts: updatedThoughts,
          date
        }),
      });
      const data = await response.json();
      console.log('Save response:', data); // Debug log
      
      // Verify save was successful
      if (!response.ok) {
        throw new Error('Failed to save thoughts');
      }
      
      // Show success toast
      toast({
        title: "Saved",
        description: "Your thoughts have been saved",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving thoughts:', error);
      toast({
        title: "Error",
        description: "Failed to save thoughts",
        status: "error",
        duration: 3000,
      });
    }
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

  const addThought = () => {
    if (newThought.trim()) {
      const updatedThoughts = [...thoughts, newThought.trim()];
      setThoughts(updatedThoughts);
      setNewThought('');
      saveThoughts(updatedThoughts); // Save after updating state
    }
  };

  const removeThought = (index) => {
    const updatedThoughts = thoughts.filter((_, i) => i !== index);
    setThoughts(updatedThoughts);
    saveThoughts(updatedThoughts); // Save after updating state
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addThought();
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
          <Box w={20}></Box>
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
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            mb={4}
            maxW="200px"
          />
          
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

export default MorningThoughts; 