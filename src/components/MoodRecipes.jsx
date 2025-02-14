import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Text,
  Button,
  SimpleGrid,
  Image,
  Badge,
  useToast,
  HStack,
} from '@chakra-ui/react';

function MoodRecipes({ onBack }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const toast = useToast();

  const fetchRecipes = async (mood) => {
    try {
      const response = await fetch(
        `https://ai-journal-backend-01bx.onrender.com/api/recipes${mood ? `?mood=${mood}` : ''}`
      );
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      toast({
        title: 'Error fetching recipes',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6}>
        <HStack w="100%" justify="space-between">
          <Button onClick={onBack}>Back</Button>
          <Text fontSize="2xl" fontWeight="bold">Mood Recipes</Text>
          <Box w={20} />
        </HStack>

        {/* Mood selection */}
        <HStack spacing={4}>
          {['Happy', 'Calm', 'Sad', 'Anxious', 'Energetic', 'Tired'].map((mood) => (
            <Button
              key={mood}
              colorScheme={selectedMood === mood ? 'blue' : 'gray'}
              onClick={() => {
                setSelectedMood(mood);
                fetchRecipes(mood);
              }}
            >
              {mood}
            </Button>
          ))}
        </HStack>

        {/* Recipe grid */}
        <SimpleGrid columns={[1, 2, 3]} spacing={6} w="100%">
          {recipes.map((recipe) => (
            <Box
              key={recipe._id}
              borderWidth={1}
              borderRadius="lg"
              overflow="hidden"
              shadow="md"
            >
              {recipe.imageUrl && (
                <Image src={recipe.imageUrl} alt={recipe.name} />
              )}
              <Box p={4}>
                <Text fontSize="xl" fontWeight="bold">{recipe.name}</Text>
                <Badge colorScheme="blue" mt={2}>{recipe.mood}</Badge>
                <Text mt={2}>{recipe.description}</Text>
                <Text mt={2}>Prep time: {recipe.prepTime} mins</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}

export default MoodRecipes; 