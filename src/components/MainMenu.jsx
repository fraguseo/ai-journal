import React from 'react';
import {
  VStack,
  Button,
  Container,
  Text,
  Box,
  Heading
} from '@chakra-ui/react';
import { 
  EditIcon, 
  ChatIcon, 
  SpinnerIcon,
  MoonIcon,
  StarIcon,
  SunIcon
} from '@chakra-ui/icons';

function MainMenu({ 
  onDiaryClick, 
  onChatClick, 
  onRecipesClick, 
  onDreamClick, 
  onGoalsClick, 
  onMorningThoughtsClick,
  onLogout
}) {
  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8}>
        <Heading>AI Journal</Heading>
        <Box w="100%">
          <VStack spacing={4}>
            <Button
              leftIcon={<EditIcon />}
              colorScheme="green"
              width="100%"
              onClick={onDiaryClick}
              size="lg"
            >
              Daily Diary
            </Button>
            <Button
              leftIcon={<ChatIcon />}
              colorScheme="blue"
              width="100%"
              onClick={onChatClick}
              size="lg"
            >
              AI Chat
            </Button>
            <Button
              leftIcon={<SpinnerIcon />}
              colorScheme="yellow"
              width="100%"
              onClick={onRecipesClick}
              size="lg"
            >
              Mood Recipes
            </Button>
            <Button
              leftIcon={<MoonIcon />}
              colorScheme="teal"
              width="100%"
              onClick={onDreamClick}
              size="lg"
            >
              Dream Journal
            </Button>
            <Button
              leftIcon={<StarIcon />}
              colorScheme="purple"
              width="100%"
              onClick={onGoalsClick}
              size="lg"
            >
              Goal Tracker
            </Button>
            <Button
              leftIcon={<SunIcon />}
              colorScheme="orange"
              width="100%"
              onClick={onMorningThoughtsClick}
              size="lg"
            >
              Morning Thoughts
            </Button>
            <Button
              colorScheme="red"
              width="100%"
              onClick={onLogout}
              size="lg"
            >
              Sign Out
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

export default MainMenu; 