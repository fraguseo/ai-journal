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
  SunIcon,
  HeartIcon
} from '@chakra-ui/icons';

function MainMenu({ 
  onDiaryClick, 
  onChatClick, 
  onRecipesClick, 
  onDreamClick, 
  onMorningThoughtsClick,
  onTherapyClick,
  onLogout
}) {
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Container maxW="container.md" p={4}>
      <VStack spacing={4} align="stretch" bg={bgColor} p={4} borderRadius="md">
        <Text fontSize="2xl" textAlign="center">My Journal</Text>
        <Button
          leftIcon={<EditIcon />}
          colorScheme="green"
          onClick={onDiaryClick}
          size="lg"
        >
          Daily Diary
        </Button>
        <Button
          leftIcon={<ChatIcon />}
          colorScheme="blue"
          onClick={onChatClick}
          size="lg"
        >
          AI Chat
        </Button>
        <Button
          leftIcon={<ChatIcon />}
          colorScheme="purple"
          onClick={onTherapyClick}
          size="lg"
        >
          Therapy Chat
        </Button>
        <Button
          leftIcon={<SpinnerIcon />}
          colorScheme="yellow"
          onClick={onRecipesClick}
          size="lg"
        >
          Mood Recipes
        </Button>
        <Button
          leftIcon={<MoonIcon />}
          colorScheme="teal"
          onClick={onDreamClick}
          size="lg"
        >
          Dream Journal
        </Button>
        <Button
          leftIcon={<SunIcon />}
          colorScheme="orange"
          onClick={onMorningThoughtsClick}
          size="lg"
        >
          Morning Thoughts
        </Button>
        <Button
          colorScheme="red"
          onClick={onLogout}
          size="lg"
        >
          Sign Out
        </Button>
      </VStack>
    </Container>
  );
}

export default MainMenu; 