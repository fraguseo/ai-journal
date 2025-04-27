import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Goals({ onBack }) {
  const [goals, setGoals] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to view goals",
        status: "warning",
        duration: 3000,
      });
      navigate('/login');
      return;
    }
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');

      // Use the same URL structure as diary
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/goals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token'); // Clear invalid token
          navigate('/login');
          return;
        }
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
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // ... rest of the component
}

export default Goals; 