import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Goals({ onBack }) {
  const [goals, setGoals] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token?.substring(0, 20) + '...');
    
    if (!token) {
      console.log('No token found');
      return false;
    }

    try {
      // Test the token with a health check
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/health', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Health check status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  const fetchGoals = async () => {
    try {
      const isAuthed = await checkAuth();
      if (!isAuthed) {
        console.log('Not authenticated, redirecting...');
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/goals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Goals response status:', response.status);

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
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // ... rest of the component
}

export default Goals; 