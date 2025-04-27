import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

function Goals({ onBack }) {
  const [goals, setGoals] = useState([]);
  const toast = useToast();

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
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

      console.log('Fetching goals...');
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/goals', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch goals');
      }

      const data = await response.json();
      console.log('Goals data:', data);
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load goals",
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