import React from 'react';
import {
  VStack,
  Button,
  Container,
  Text,
  useColorModeValue,
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
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Container maxW="container.md" p={4}>
      <VStack spacing={4} align="stretch" bg={bgColor} p={4} borderRadius="md">
        <Text fontSize="2xl" textAlign="center">My Journal</Text>
        <Button onClick={onDiaryClick}>Daily Diary</Button>
        <Button onClick={onChatClick}>AI Chat</Button>
        <Button onClick={onRecipesClick}>Mood Recipes</Button>
        <Button onClick={onDreamClick}>Dream Journal</Button>
        <Button onClick={onGoalsClick}>Goal Tracker</Button>
        <Button onClick={onMorningThoughtsClick}>Morning Thoughts</Button>
        <Button onClick={onLogout} colorScheme="red">Logout</Button>
      </VStack>
    </Container>
  );
}

export default MainMenu; 