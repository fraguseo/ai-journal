import React from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
  Divider,
  Badge,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';

function MemoryJournal({ memories }) {
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.200', 'blue.700');

  if (!memories || !memories.entries || memories.entries.length === 0) {
    return null;
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" w="100%" bg={bgColor} borderColor={borderColor}>
      <Heading size="md" mb={4}>On This Day</Heading>
      
      {/* AI Analysis */}
      <VStack spacing={3} align="stretch" mb={4}>
        {memories.analysis.patterns && (
          <Box>
            <Text fontWeight="bold">Patterns</Text>
            <Text>{memories.analysis.patterns}</Text>
          </Box>
        )}
        {memories.analysis.insights && (
          <Box>
            <Text fontWeight="bold">Insights</Text>
            <Text>{memories.analysis.insights}</Text>
          </Box>
        )}
        {memories.analysis.reflection && (
          <Box>
            <Text fontWeight="bold">Reflection</Text>
            <Text>{memories.analysis.reflection}</Text>
          </Box>
        )}
      </VStack>

      <Divider my={4} />

      {/* Past Entries */}
      <VStack spacing={4} align="stretch">
        {memories.entries.map((entry) => (
          <Box key={entry._id} p={3} borderWidth={1} borderRadius="md">
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">
                {new Date(entry.date).toLocaleDateString()}
              </Text>
              <Badge colorScheme={getMoodColor(entry.mood)}>
                {entry.mood} ({entry.moodIntensity}/5)
              </Badge>
            </HStack>
            <Text>{entry.entry}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

function getMoodColor(mood) {
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

export default MemoryJournal; 