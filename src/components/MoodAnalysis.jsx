import React from 'react';
import {
  Box,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Heading,
} from '@chakra-ui/react';

function MoodAnalysis({ moodData }) {
  return (
    <VStack spacing={4} w="100%">
      <Heading size="md">AI Mood Insights</Heading>
      
      {/* Trend Analysis */}
      <Box p={4} borderWidth={1} borderRadius="lg" w="100%">
        <Text fontWeight="bold">Mood Trends</Text>
        <Text>Your mood has been trending {moodData.trend} over the past week.</Text>
      </Box>

      {/* Suggestions */}
      <Box p={4} borderWidth={1} borderRadius="lg" w="100%">
        <Text fontWeight="bold">Personalized Suggestions</Text>
        <Text>{moodData.suggestions}</Text>
      </Box>

      {/* Warnings if any */}
      {moodData.warnings && (
        <Alert status="info">
          <AlertIcon />
          {moodData.warnings}
        </Alert>
      )}
    </VStack>
  );
}

export default MoodAnalysis; 