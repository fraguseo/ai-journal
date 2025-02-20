import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Progress,
  Badge,
  useToast,
  IconButton,
  Container,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, DeleteIcon, ArrowBackIcon } from '@chakra-ui/icons';

function GoalTracker({ onBack }) {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      toast({
        title: 'Error fetching goals',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const addGoal = async () => {
    if (!newGoal.trim()) return;
    
    try {
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newGoal,
          progress: 0,
          completed: false,
        }),
      });

      if (!response.ok) throw new Error('Failed to add goal');
      
      setNewGoal('');
      fetchGoals();
      
      toast({
        title: 'Goal added successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error adding goal',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const updateProgress = async (goalId, newProgress) => {
    try {
      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress: newProgress }),
      });

      if (!response.ok) throw new Error('Failed to update progress');
      fetchGoals();
    } catch (error) {
      toast({
        title: 'Error updating progress',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com/api/goals/${goalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete goal');
      fetchGoals();
      
      toast({
        title: 'Goal deleted',
        status: 'info',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error deleting goal',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Button 
            leftIcon={<ArrowBackIcon />} 
            onClick={onBack}
            variant="ghost"
          >
            Back
          </Button>
          <Text fontSize="2xl" fontWeight="bold">Goals & Progress</Text>
          <Box w={20} />
        </HStack>

        <HStack>
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Enter a new goal..."
            size="lg"
          />
          <IconButton
            icon={<AddIcon />}
            onClick={addGoal}
            colorScheme="green"
            size="lg"
          />
        </HStack>

        <VStack spacing={4} align="stretch">
          {goals.map((goal) => (
            <Box
              key={goal._id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              shadow="sm"
            >
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="bold">{goal.description}</Text>
                <HStack>
                  <Badge 
                    colorScheme={goal.progress === 100 ? 'green' : 'blue'}
                  >
                    {goal.progress}%
                  </Badge>
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => deleteGoal(goal._id)}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                  />
                </HStack>
              </HStack>
              
              <Progress 
                value={goal.progress} 
                colorScheme={goal.progress === 100 ? 'green' : 'blue'}
                borderRadius="full"
              />
              
              <HStack mt={2} spacing={2}>
                {[25, 50, 75, 100].map((progress) => (
                  <Button
                    key={progress}
                    size="sm"
                    onClick={() => updateProgress(goal._id, progress)}
                    colorScheme={goal.progress >= progress ? 'green' : 'gray'}
                    variant={goal.progress >= progress ? 'solid' : 'outline'}
                  >
                    {progress}%
                  </Button>
                ))}
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}

export default GoalTracker; 