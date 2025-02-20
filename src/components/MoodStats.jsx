import React from 'react';
import {
  Box,
  VStack,
  Text,
  SimpleGrid,
  Progress,
  HStack,
} from '@chakra-ui/react';

// Define fixed mood order
const MOOD_ORDER = ['Happy', 'Calm', 'Sad', 'Anxious', 'Energetic', 'Tired'];

function MoodStats({ stats, period }) {
  console.log('MoodStats received:', stats);
  
  if (!stats || !Array.isArray(stats) || stats.length === 0) {
    console.log('No stats to display');
    return null;
  }

  try {
    // Sort stats based on fixed order
    const sortedStats = MOOD_ORDER.map(mood => {
      const moodStat = stats.find(stat => stat._id === mood);
      return moodStat || {
        _id: mood,
        count: 0,
        averageIntensity: 0
      };
    });

    const totalEntries = stats.reduce((sum, stat) => sum + stat.count, 0);

    return (
      <Box p={4} borderWidth={1} borderRadius="lg" w="100%">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Mood Statistics
        </Text>
        <VStack spacing={4} w="100%">
          {sortedStats.map((stat) => (
            <Box key={stat._id} w="100%" p={2}>
              <HStack justify="space-between" mb={1}>
                <Text>{stat._id}</Text>
                <Text>{stat.count} entries</Text>
              </HStack>
              <Progress 
                value={(stat.count / totalEntries) * 100} 
                size="sm" 
                colorScheme={getColorScheme(stat._id)}
              />
              {stat.count > 0 && (
                <Text fontSize="sm" color="gray.600">
                  Average Intensity: {stat.averageIntensity.toFixed(1)}/5
                </Text>
              )}
            </Box>
          ))}
        </VStack>
      </Box>
    );
  } catch (error) {
    console.error('Error in MoodStats:', error);
    return null;
  }
}

function getColorScheme(mood) {
  const colorMap = {
    Happy: 'yellow',
    Calm: 'blue',
    Sad: 'gray',
    Anxious: 'orange',
    Energetic: 'green',
    Tired: 'purple'
  };
  return colorMap[mood] || 'gray';
}

export default MoodStats; 