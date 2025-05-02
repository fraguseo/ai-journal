import React from 'react';
import {
  VStack,
  Button,
  Container,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Diary from './Diary';
import MoodStats from './MoodStats';
import MorningThoughts from './MorningThoughts';
import MemoryJournal from './MemoryJournal';

function Dashboard({ onLogout }) {
  const [view, setView] = React.useState('main');
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  const handleBack = () => setView('main');

  if (view === 'diary') return <Diary onBack={handleBack} />;
  if (view === 'stats') return <MoodStats onBack={handleBack} />;
  if (view === 'morning') return <MorningThoughts onBack={handleBack} />;
  if (view === 'memory') return <MemoryJournal onBack={handleBack} />;

  return (
    <Container maxW="container.md" p={4}>
      <VStack spacing={4} align="stretch" bg={bgColor} p={4} borderRadius="md">
        <Text fontSize="2xl" textAlign="center">Journal Dashboard</Text>
        <Button onClick={() => setView('diary')}>Daily Diary</Button>
        <Button onClick={() => setView('morning')}>Morning Thoughts</Button>
        <Button onClick={() => setView('stats')}>Mood Stats</Button>
        <Button onClick={() => setView('memory')}>Memory Journal</Button>
        <Button onClick={onLogout} colorScheme="red">Logout</Button>
      </VStack>
    </Container>
  );
}

export default Dashboard; 