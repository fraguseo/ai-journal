import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

function Goals({ onBack }) {
  const [goals, setGoals] = useState([]);
  const toast = useToast();

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
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
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to load goals",
        status: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // ... rest of the component
}

export default Goals; 