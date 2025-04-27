import React, { useState, useEffect } from 'react';
import { useToast, Button, Input, VStack, Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Goals({ onBack }) {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newGoal, setNewGoal] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const addGoal = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Using token:', token?.substring(0, 20) + '...');

      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/goals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: newGoal,
          category: 'Personal'
        })
      });

      console.log('Add goal response:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add goal');
      }

      const data = await response.json();
      setGoals([...goals, data]);
      setNewGoal('');
      toast({
        title: "Goal added",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      console.log('Token starts with:', token?.substring(0, 10));

      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/goals', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.clear();
        navigate('/');
        return;
      }

      const data = await response.json();
      setGoals(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load goals",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <VStack spacing={4} p={4}>
      <Box w="100%">
        <Input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Enter new goal"
        />
        <Button onClick={addGoal} mt={2}>Add Goal</Button>
      </Box>

      {isLoading ? (
        <Text>Loading goals...</Text>
      ) : goals.length === 0 ? (
        <Text>No goals yet. Add your first goal!</Text>
      ) : (
        goals.map(goal => (
          <Box key={goal._id} p={4} borderWidth={1} w="100%">
            <Text>{goal.description}</Text>
          </Box>
        ))
      )}
    </VStack>
  );
}

export default Goals; 