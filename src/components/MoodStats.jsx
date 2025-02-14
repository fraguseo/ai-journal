import React from 'react';
import {
  Box,
  VStack,
  Text,
  SimpleGrid,
  Progress,
  HStack,
} from '@chakra-ui/react';

function MoodStats({ stats = [] }) {
  console.log('MoodStats received:', stats);
  
  if (!stats || !Array.isArray(stats) || stats.length === 0) {
    console.log('No stats to display');
    return null;
  }

  try {
    const totalEntries = stats.reduce((sum, stat) => sum + (stat?.count || 0), 0);

    return (
      <Box p={4} borderWidth={1} borderRadius="lg" w="100%">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Mood Statistics
        </Text>
        <VStack spacing={3} align="stretch">
          {stats.map((stat) => (
            <Box key={stat._id}>
              <HStack justify="space-between" mb={1}>
                <Text>
                  {stat._id} ({stat.count} entries)
                </Text>
                <Text>
                  Avg Intensity: {stat.averageIntensity.toFixed(1)}
                </Text>
              </HStack>
              <Progress 
                value={(stat.count / totalEntries) * 100}
                colorScheme={
                  stat._id === 'Happy' ? 'yellow' :
                  stat._id === 'Calm' ? 'blue' :
                  stat._id === 'Sad' ? 'gray' :
                  stat._id === 'Anxious' ? 'orange' :
                  stat._id === 'Energetic' ? 'green' :
                  'purple'
                }
              />
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

export default MoodStats; 