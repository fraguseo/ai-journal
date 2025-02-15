import React from 'react';
import {
  Container,
  VStack,
  Button,
  Text,
  Box,
  SimpleGrid,
  HStack,
} from '@chakra-ui/react';
import { ChatIcon, CalendarIcon } from '@chakra-ui/icons';
import { FaFeather } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';

function Home({ onJournalClick, onDiaryClick, onRecipesClick, onDreamClick }) {
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
        <Button
          onClick={onDreamClick}
          size="lg"
          colorScheme="teal"
          w="100%"
        >
          <HStack>
            <Icon as={FaFeather} />
            <Text>Dream Catcher</Text>
          </HStack>
        </Button>
      </VStack>
    </Container>
  );
}

export default Home; 