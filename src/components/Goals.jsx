import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useQueryClient, useQuery } from '@tanstack/react-query';

function Goals({ onBack }) {
  const [goals, setGoals] = useState([]);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, error } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
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

      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  });

  useEffect(() => {
    if (data) {
      setGoals(data);
    }
  }, [data]);

  // ... rest of the component
}

export default Goals; 