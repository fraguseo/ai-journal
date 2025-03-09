import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  Link
} from '@chakra-ui/react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isRegistering ? '/api/register' : '/api/login';
      const body = isRegistering 
        ? { name, email, password }
        : { email, password };

      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data);
        toast({
          title: isRegistering ? 'Account created.' : 'Login successful',
          status: 'success',
          duration: 3000,
        });
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8}>
        <Heading>AI Journal</Heading>
        <Box w="100%" p={8} borderWidth={1} borderRadius="lg" boxShadow="md">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {isRegistering && (
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </FormControl>
              )}
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={isLoading}
              >
                {isRegistering ? 'Sign Up' : 'Login'}
              </Button>
            </VStack>
          </form>
          <Text mt={4} textAlign="center">
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              color="blue.500"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Login' : 'Sign Up'}
            </Link>
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}

export default Login; 