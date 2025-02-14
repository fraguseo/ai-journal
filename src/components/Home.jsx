import React from 'react';
import {
  Container,
  VStack,
  Button,
  Text,
  Box,
  SimpleGrid,
} from '@chakra-ui/react';
import { ChatIcon, CalendarIcon } from '@chakra-ui/icons';

function Home({ onJournalClick, onDiaryClick, onRecipesClick }) {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8}>
        <Text fontSize="3xl" fontWeight="bold">
          AI Journal
        </Text>
        <Button
          onClick={onJournalClick}
          size="lg"
          colorScheme="blue"
          w="100%"
        >
          AI Chat
        </Button>
        <Button
          onClick={onDiaryClick}
          size="lg"
          colorScheme="green"
          w="100%"
        >
          Daily Diary
        </Button>
        <Button
          onClick={onRecipesClick}
          size="lg"
          colorScheme="purple"
          w="100%"
        >
          Mood Recipes
        </Button>
      </VStack>
    </Container>
  );
}

export default Home; 