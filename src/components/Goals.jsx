import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

function Goals({ onBack }) {
  const [goals, setGoals] = useState([]);
  const toast = useToast();

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token?.substring(0, 20) + '...'); // Only log part of the token for security

      if (!token) {
        // Clear any stale data
        localStorage.clear();
        window.location.reload(); // Force a refresh to trigger re-login
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

      if (response.status === 401 || response.status === 403) {
        // Clear token and force re-login on auth errors
        localStorage.clear();
        window.location.reload();
        return;
      }

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