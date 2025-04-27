import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

function Goals({ onBack }) {
  const [goals, setGoals] = useState([]);
  const toast = useToast();

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Starting fetchGoals...');
      console.log('Token exists:', !!token);

      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = 'https://ai-journal-backend-01bx.onrender.com/api/goals';
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 403) {
          toast({
            title: "Authentication Error",
            description: "Please log in again",
            status: "error",
            duration: 3000,
          });
          return;
        }
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!data || !Array.isArray(data)) {
        console.log('Invalid data format received:', data);
        setGoals([]);
        return;
      }

      setGoals(data);
    } catch (error) {
      console.error('Detailed error in fetchGoals:', error);
      toast({
        title: "Error",
        description: `Failed to load goals: ${error.message}`,
        status: "error",
        duration: 3000,
      });
      setGoals([]);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // ... rest of the component
}

export default Goals; 