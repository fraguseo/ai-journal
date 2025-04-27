import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, VStack } from '@chakra-ui/react';

function Goals({ onBack }) {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        localStorage.clear();
        navigate('/');
        return;
      }

      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/goals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const data = await response.json();
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
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

  if (isLoading) {
    return <Text>Loading goals...</Text>;
  }

  if (goals.length === 0) {
    return (
      <Box p={4}>
        <Text>No goals yet. Create your first goal!</Text>
      </Box>
    );
  }

  // ... rest of the component showing goals list
}

export default Goals; 