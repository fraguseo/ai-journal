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
  HStack,
} from '@chakra-ui/react';
import DiaryCalendar from './DiaryCalendar';
import { format } from 'date-fns';
import { ArrowBackIcon, SmileIcon, MehIcon } from '@chakra-ui/icons';
import MoodStats from './MoodStats';

function Diary({ onBack }) {
  const [entry, setEntry] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [moodStats, setMoodStats] = useState([]);

  const fetchEntries = async (selectedDate) => {
    try {
      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com/api/diary?date=${selectedDate}`);
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

  const fetchMoodStats = async () => {
    try {
      console.log('Fetching mood stats...');
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/diary/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      console.log('Mood stats received:', data);
      setMoodStats(data);
    } catch (error) {
      console.error('Error fetching mood stats:', error);
      setMoodStats([]); // Set empty array on error
    }
  };

  useEffect(() => {
    console.log('Date changed:', date);
    fetchEntries(date);
    fetchMoodStats();
  }, [date]);

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
        title: `Entry saved! Mood: ${data.mood} (${data.intensity}/5)`,
        status: 'success',
        duration: 2000,
      });
      setEntry('');
      
      await fetchEntries(date);
      
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

  const handleDateClick = (selectedDate) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    setDate(formattedDate);
  };

  const moodColors = {
    Happy: 'yellow.100',
    Calm: 'blue.100',
    Sad: 'gray.100',
    Anxious: 'orange.100',
    Energetic: 'green.100',
    Tired: 'purple.100'
  };

  const moodIcons = {
    Happy: '😊',
    Calm: '😌',
    Sad: '😢',
    Anxious: '😰',
    Energetic: '⚡',
    Tired: '😴'
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
            Daily Diary
          </Text>
          <Box w={20}></Box> {/* For alignment */}
        </HStack>
        
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

        <DiaryCalendar entries={entries} onDateClick={handleDateClick} />

        {moodStats && moodStats.length > 0 && (
          <MoodStats stats={moodStats} />
        )}

        <VStack spacing={4} w="100%" align="stretch">
          {entries.map((entry) => (
            <Box
              key={entry._id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              shadow="sm"
              bg={entry.mood ? moodColors[entry.mood] : 'white'}
            >
              <HStack justify="space-between">
                <Text fontWeight="bold">
                  {new Date(entry.date).toLocaleDateString()}
                </Text>
                {entry.mood && (
                  <Text color="gray.600">
                    {moodIcons[entry.mood]} {entry.mood} ({entry.moodIntensity}/5)
                  </Text>
                )}
              </HStack>
              <Text mt={2}>{entry.entry}</Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}

export default Diary; 