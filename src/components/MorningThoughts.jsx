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
import { ArrowBackIcon, AddIcon, DeleteIcon, MicrophoneIcon } from '@chakra-ui/icons';
import { FaMicrophone, FaStop } from 'react-icons/fa';

function MorningThoughts({ onBack }) {
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const mediaRecorder = useRef(null);
  const toast = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = async (event) => {
        const audioBlob = event.data;
        // Convert speech to text using a service like Google Speech-to-Text
        // For now, we'll just add a placeholder thought
        setThoughts(prev => [...prev, "Voice recorded thought..."]);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please enable microphone access to use voice input",
        status: "error",
        duration: 3000,
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
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