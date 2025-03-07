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
import { ArrowBackIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaMicrophone, FaStop } from 'react-icons/fa';

function MorningThoughts({ onBack }) {
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const recognition = useRef(null);
  const toast = useToast();

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
      setThoughts(prev => [...prev, newThought.trim()]);
      setNewThought('');
    }
  };

  const removeThought = (index) => {
    setThoughts(prev => prev.filter((_, i) => i !== index));
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