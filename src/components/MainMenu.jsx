import React from 'react';
import {
  VStack,
  Button,
  Container,
  Text,
  Box,
} from '@chakra-ui/react';
import { 
  EditIcon, 
  ChatIcon, 
  SpinnerIcon,
  MoonIcon,
  StarIcon,
  SunIcon
} from '@chakra-ui/icons';

function MainMenu({ onDiaryClick, onChatClick, onRecipesClick, onDreamClick, onGoalsClick, onMorningThoughtsClick }) {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8}>
        <Text fontSize="3xl" fontWeight="bold">
          AI Journal
        </Text>

        <VStack spacing={4} w="100%">
          <Button
            leftIcon={<EditIcon />}
            onClick={onDiaryClick}
            size="lg"
            w="100%"
            colorScheme="green"
          >
            Daily Diary
          </Button>

          <Button
            leftIcon={<ChatIcon />}
            onClick={onChatClick}
            size="lg"
            w="100%"
            colorScheme="blue"
          >
            AI Chat
          </Button>

          <Button
            leftIcon={<SpinnerIcon />}
            onClick={onRecipesClick}
            size="lg"
            w="100%"
            colorScheme="yellow"
          >
            Mood Recipes
          </Button>

          <Button
            leftIcon={<MoonIcon />}
            onClick={onDreamClick}
            size="lg"
            w="100%"
            colorScheme="teal"
          >
            Dream Journal
          </Button>

          <Button
            leftIcon={<StarIcon />}
            onClick={onGoalsClick}
            size="lg"
            w="100%"
            colorScheme="purple"
          >
            Goal Tracker
          </Button>

          <Button
            leftIcon={<SunIcon />}
            onClick={onMorningThoughtsClick}
            size="lg"
            w="100%"
            colorScheme="orange"
          >
            Morning Thoughts
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}

export default MainMenu; 