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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  UnorderedList,
  ListItem,
  OrderedList,
} from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';

function MoodRecipes({ onBack }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const toast = useToast();

  const fetchRecipes = async (mood) => {
    try {
      console.log('Fetching recipes for mood:', mood);
      const response = await fetch(
        `https://ai-journal-backend-01bx.onrender.com/api/recipes${mood ? `?mood=${mood}` : ''}`
      );
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const data = await response.json();
      console.log('Received recipes:', data);
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: 'Error fetching recipes',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    // Load all recipes initially
    fetchRecipes();
  }, []); // Empty dependency array means this runs once on mount

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
              cursor="pointer"
              onClick={() => setSelectedRecipe(recipe)}
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.02)' }}
            >
              {recipe.imageUrl ? (
                <Image src={recipe.imageUrl} alt={recipe.name} h="200px" w="100%" objectFit="cover" />
              ) : (
                <Box h="200px" bg="gray.100" display="flex" alignItems="center" justifyContent="center">
                  <QuestionIcon w={10} h={10} color="gray.400" />
                </Box>
              )}
              <Box p={4}>
                <Text fontSize="xl" fontWeight="bold">{recipe.name}</Text>
                <Badge colorScheme="blue" mt={2}>{recipe.mood}</Badge>
                <Text mt={2} noOfLines={2}>{recipe.description}</Text>
                <Text mt={2} color="gray.600">Prep time: {recipe.prepTime} mins</Text>
                <Button 
                  mt={3} 
                  colorScheme="teal" 
                  size="sm" 
                  w="100%"
                >
                  View Recipe
                </Button>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {/* Recipe Details Modal */}
        {selectedRecipe && (
          <Modal isOpen={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedRecipe.name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                {selectedRecipe.imageUrl && (
                  <Image 
                    src={selectedRecipe.imageUrl} 
                    alt={selectedRecipe.name} 
                    borderRadius="md"
                    mb={4}
                  />
                )}
                <Text mb={4}>{selectedRecipe.description}</Text>
                
                <Text fontWeight="bold" mb={2}>Ingredients:</Text>
                <UnorderedList mb={4}>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <ListItem key={index}>{ingredient}</ListItem>
                  ))}
                </UnorderedList>

                <Text fontWeight="bold" mb={2}>Instructions:</Text>
                <OrderedList mb={4}>
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <ListItem key={index}>{instruction}</ListItem>
                  ))}
                </OrderedList>

                <Text color="gray.600">Preparation Time: {selectedRecipe.prepTime} minutes</Text>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </VStack>
    </Container>
  );
}

export default MoodRecipes; 