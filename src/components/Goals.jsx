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
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);

      if (response.status === 401) {
        localStorage.removeItem('token');
        toast({
          title: "Session Expired",
          description: "Please log in again",
          status: "error",
          duration: 3000,
        });
        return;
      }

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setGoals(data || []);
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