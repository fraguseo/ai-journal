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
  Select,
} from '@chakra-ui/react';
import DiaryCalendar from './DiaryCalendar';
import { format } from 'date-fns';
import { ArrowBackIcon, SmileIcon, MehIcon } from '@chakra-ui/icons';
import MoodStats from './MoodStats';
import MoodAnalysis from './MoodAnalysis';
import MemoryJournal from './MemoryJournal';

function Diary({ onBack }) {
  const [entry, setEntry] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [moodStats, setMoodStats] = useState([]);
  const [statsPeriod, setStatsPeriod] = useState('day');
  const [showStats, setShowStats] = useState(false);
  const [moodAnalysis, setMoodAnalysis] = useState(null);
  const [memories, setMemories] = useState(null);
  const [journalType, setJournalType] = useState('free');
  const [promptAnswers, setPromptAnswers] = useState({});

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

  const fetchMoodStats = async (period = statsPeriod) => {
    try {
      console.log('Fetching mood stats...');
      const response = await fetch(
        `https://ai-journal-backend-01bx.onrender.com/api/diary/stats?period=${period}&date=${date}`
      );
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      console.log(`${period} mood stats received:`, data);
      setMoodStats(data);
    } catch (error) {
      console.error('Error fetching mood stats:', error);
      toast({
        title: 'Error fetching mood statistics',
        status: 'error',
        duration: 3000,
      });
      setMoodStats([]);
    }
  };

  const fetchMoodAnalysis = async () => {
    try {
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/diary/mood-analysis');
      if (!response.ok) throw new Error('Failed to fetch mood analysis');
      const data = await response.json();
      setMoodAnalysis(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchMemories = async (selectedDate) => {
    try {
      const response = await fetch(
        `https://ai-journal-backend-01bx.onrender.com/api/diary/on-this-day?date=${selectedDate}`
      );
      if (!response.ok) throw new Error('Failed to fetch memories');
      const data = await response.json();
      setMemories(data);
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  };

  useEffect(() => {
    console.log('Date changed:', date);
    fetchEntries(date);
    fetchMoodStats();
    fetchMoodAnalysis();
    fetchMemories(date);
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
        body: JSON.stringify({ 
          entry, 
          date,
          journalType,
          prompts: Object.entries(promptAnswers).map(([question, answer]) => ({
            question,
            answer
          }))
        }),
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear - i);

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
        
        <HStack w="100%">
          <Select 
            value={date.split('-')[0]}
            onChange={(e) => {
              const [_, month, day] = date.split('-');
              const newDate = `${e.target.value}-${month}-${day}`;
              setDate(newDate);
            }}
            size="lg"
            w="30%"
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            size="lg"
            w="70%"
          />
        </HStack>
        
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

        <DiaryCalendar 
          entries={entries} 
          onDateClick={handleDateClick}
          selectedDate={date}
        />

        {memories && <MemoryJournal memories={memories} />}

        <Button
          size="sm"
          colorScheme="teal"
          onClick={() => setShowStats(!showStats)}
        >
          {showStats ? 'Hide Mood Statistics' : 'Show Mood Statistics'}
        </Button>

        {showStats && (
          <>
            <HStack spacing={4} w="100%" justify="center">
              <Button
                size="sm"
                colorScheme={statsPeriod === 'day' ? 'blue' : 'gray'}
                onClick={() => {
                  setStatsPeriod('day');
                  fetchMoodStats('day');
                }}
              >
                Daily Stats
              </Button>
              <Button
                size="sm"
                colorScheme={statsPeriod === 'week' ? 'blue' : 'gray'}
                onClick={() => {
                  setStatsPeriod('week');
                  fetchMoodStats('week');
                }}
              >
                Weekly Stats
              </Button>
              <Button
                size="sm"
                colorScheme={statsPeriod === 'month' ? 'blue' : 'gray'}
                onClick={() => {
                  setStatsPeriod('month');
                  fetchMoodStats('month');
                }}
              >
                Monthly Stats
              </Button>
            </HStack>

            {moodStats && moodStats.length > 0 && (
              <MoodStats stats={moodStats} period={statsPeriod} />
            )}

            {showStats && moodAnalysis && (
              <MoodAnalysis moodData={moodAnalysis} />
            )}
          </>
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