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

function Home({ onNavigate }) {
  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8}>
        <Text fontSize="3xl" fontWeight="bold">
          My Journal App
        </Text>
        
        <SimpleGrid columns={[1, 2]} spacing={6} w="100%">
          <Box
            as={Button}
            height="200px"
            onClick={() => onNavigate('chat')}
            p={8}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <ChatIcon w={10} h={10} />
            <Text fontSize="xl">AI Chat</Text>
          </Box>
          
          <Box
            as={Button}
            height="200px"
            onClick={() => onNavigate('diary')}
            p={8}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={4}
          >
            <CalendarIcon w={10} h={10} />
            <Text fontSize="xl">Daily Diary</Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}

export default Home; 