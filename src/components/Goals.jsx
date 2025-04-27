import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

function Goals({ onBack }) {
  const [goals, setGoals] = useState([]);
  const toast = useToast();

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view goals",
          status: "error",
          duration: 3000,
        });
        return;
      }

      const url = 'https://ai-journal-backend-01bx.onrender.com/api/goals';
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        throw new Error(errorData.message || `Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success data:', data);
      setGoals(data || []);
    } catch (error) {
      console.error('Error details:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load goals",
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