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
            <Button colorScheme="blue" width="100%" onClick={onDiaryClick}>
              Diary
            </Button>
            <Button colorScheme="blue" width="100%" onClick={onChatClick}>
              AI Chat
            </Button>
            <Button colorScheme="blue" width="100%" onClick={onRecipesClick}>
              Mood Recipes
            </Button>
            <Button colorScheme="blue" width="100%" onClick={onDreamClick}>
              Dream Journal
            </Button>
            <Button colorScheme="blue" width="100%" onClick={onGoalsClick}>
              Goal Tracker
            </Button>
            <Button colorScheme="blue" width="100%" onClick={onMorningThoughtsClick}>
              Morning Thoughts
            </Button>
            <Button
              colorScheme="red"
              width="100%"
              onClick={onLogout}
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