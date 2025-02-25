import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Progress,
  Badge,
  useToast,
  IconButton,
  Container,
  Select,
  FormControl,
  FormLabel,
  Checkbox,
  Stack,
  Collapse,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ArrowBackIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import GoalTemplates from './GoalTemplates';

function GoalTracker({ onBack }) {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Personal');
  const [deadline, setDeadline] = useState('');
  const [newSubTask, setNewSubTask] = useState('');
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const toast = useToast();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const categories = ['Personal', 'Health', 'Career', 'Learning'];

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (notifications && "Notification" in window) {
      goals.forEach(goal => {
        if (goal.deadline) {
          const deadline = new Date(goal.deadline);
          const today = new Date();
          const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
          
          if (daysUntil <= 3 && !goal.completed) {
            new Notification('Goal Deadline Approaching', {
              body: `${goal.description} is due in ${daysUntil} days`,
              icon: '/logo192.png'  // Optional: add your app icon
            });
          }
        }
      });
    }
  }, [goals, notifications]);

  const fetchGoals = async () => {
    try {
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      toast({
        title: 'Error fetching goals',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const addGoal = async () => {
    if (!newGoal.trim()) return;
    
    try {
      const response = await fetch('https://ai-journal-backend-01bx.onrender.com/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newGoal,
          category: selectedCategory,
          deadline: deadline || undefined,
          progress: 0,
          completed: false,
          subTasks: [],
          progressHistory: []
        }),
      });

      if (!response.ok) throw new Error('Failed to add goal');
      
      setNewGoal('');
      setDeadline('');
      fetchGoals();
      
      toast({
        title: 'Goal added successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error adding goal',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const addSubTask = async (goalId) => {
    if (!newSubTask.trim()) return;

    try {
      const goal = goals.find(g => g._id === goalId);
      const updatedSubTasks = [...goal.subTasks, { description: newSubTask, completed: false }];

      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subTasks: updatedSubTasks }),
      });

      if (!response.ok) throw new Error('Failed to add subtask');
      setNewSubTask('');
      fetchGoals();
    } catch (error) {
      toast({
        title: 'Error adding subtask',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const updateProgress = async (goalId, newProgress) => {
    try {
      const goal = goals.find(g => g._id === goalId);
      const updatedHistory = [...goal.progressHistory, { value: newProgress, date: new Date() }];

      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          progress: newProgress,
          progressHistory: updatedHistory,
          completed: newProgress === 100
        }),
      });

      if (!response.ok) throw new Error('Failed to update progress');
      fetchGoals();
    } catch (error) {
      toast({
        title: 'Error updating progress',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com/api/goals/${goalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete goal');
      fetchGoals();
      
      toast({
        title: 'Goal deleted',
        status: 'info',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error deleting goal',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const toggleSubTask = async (goalId, subTaskIndex) => {
    try {
      const goal = goals.find(g => g._id === goalId);
      const updatedSubTasks = [...goal.subTasks];
      updatedSubTasks[subTaskIndex].completed = !updatedSubTasks[subTaskIndex].completed;

      const response = await fetch(`https://ai-journal-backend-01bx.onrender.com/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subTasks: updatedSubTasks }),
      });

      if (!response.ok) throw new Error('Failed to update subtask');
      fetchGoals();
    } catch (error) {
      toast({
        title: 'Error updating subtask',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleTemplateSelect = (template) => {
    setNewGoal(template.description);
    setSelectedCategory(template.category);
    setIsTemplateModalOpen(false);
  };

  const handleNotificationToggle = async (e) => {
    if (e.target.checked) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        setNotifications(permission === "granted");
        
        if (permission === "granted") {
          new Notification('Notifications Enabled', {
            body: 'You will be notified of upcoming goal deadlines',
            icon: '/logo192.png'
          });
        } else {
          toast({
            title: 'Notifications not enabled',
            description: 'Please allow notifications in your browser settings',
            status: 'warning',
            duration: 3000,
          });
        }
      }
    } else {
      setNotifications(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Button 
            leftIcon={<ArrowBackIcon />} 
            onClick={onBack}
            variant="ghost"
          >
            Back
          </Button>
          <Text fontSize="2xl" fontWeight="bold">Goals & Progress</Text>
          <Box w={20} />
        </HStack>

        <VStack spacing={4}>
          <FormControl>
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter a new goal..."
              size="lg"
            />
          </FormControl>

          <HStack w="100%">
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                size="lg"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Deadline</FormLabel>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                size="lg"
                w={{ base: "full", md: "auto" }}
                sx={{
                  '&::-webkit-date-and-time-value': {
                    minHeight: '1.5em'
                  }
                }}
              />
            </FormControl>

            <IconButton
              icon={<AddIcon />}
              onClick={addGoal}
              colorScheme="green"
              size="lg"
              mt="auto"
              mb={1}
            />
          </HStack>

          <HStack w="100%" justify="space-between" align="center">
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="notifications" mb="0">
                Enable Reminders
              </FormLabel>
              <Switch
                id="notifications"
                isChecked={notifications}
                onChange={handleNotificationToggle}
              />
            </FormControl>

            <Tooltip label="Use Template">
              <Button
                leftIcon={<AddIcon />}
                onClick={() => setIsTemplateModalOpen(true)}
                colorScheme="purple"
                size="lg"
                minW="140px"
                h="48px"
              >
                Template
              </Button>
            </Tooltip>
          </HStack>
        </VStack>

        <VStack spacing={4} align="stretch">
          {goals.map((goal) => (
            <Box
              key={goal._id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              shadow="sm"
            >
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{goal.description}</Text>
                    <HStack>
                      <Badge colorScheme="purple">{goal.category}</Badge>
                      {goal.deadline && (
                        <Badge colorScheme="orange">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => deleteGoal(goal._id)}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                  />
                </HStack>

                <Progress 
                  value={goal.progress} 
                  colorScheme={goal.progress === 100 ? 'green' : 'blue'}
                  borderRadius="full"
                />

                <HStack spacing={2}>
                  {[25, 50, 75, 100].map((progress) => (
                    <Button
                      key={progress}
                      size="sm"
                      onClick={() => updateProgress(goal._id, progress)}
                      colorScheme={goal.progress >= progress ? 'green' : 'gray'}
                      variant={goal.progress >= progress ? 'solid' : 'outline'}
                    >
                      {progress}%
                    </Button>
                  ))}
                </HStack>

                <Button
                  size="sm"
                  rightIcon={expandedGoal === goal._id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  onClick={() => setExpandedGoal(expandedGoal === goal._id ? null : goal._id)}
                  variant="ghost"
                >
                  {expandedGoal === goal._id ? 'Hide Details' : 'Show Details'}
                </Button>

                <Collapse in={expandedGoal === goal._id}>
                  <VStack align="stretch" spacing={3} mt={2}>
                    {/* Progress Chart */}
                    {goal.progressHistory.length > 0 && (
                      <Box h="200px">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={goal.progressHistory}>
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(date) => new Date(date).toLocaleDateString()}
                            />
                            <YAxis domain={[0, 100]} />
                            <RechartsTooltip 
                              labelFormatter={(date) => new Date(date).toLocaleDateString()}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#3182ce" 
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    )}

                    {/* Sub-tasks */}
                    <VStack align="stretch" spacing={2}>
                      <HStack>
                        <Input
                          placeholder="Add a sub-task..."
                          value={newSubTask}
                          onChange={(e) => setNewSubTask(e.target.value)}
                          size="sm"
                        />
                        <IconButton
                          icon={<AddIcon />}
                          onClick={() => addSubTask(goal._id)}
                          size="sm"
                          colorScheme="blue"
                        />
                      </HStack>

                      <Stack spacing={2}>
                        {goal.subTasks.map((task, index) => (
                          <Checkbox
                            key={index}
                            isChecked={task.completed}
                            onChange={() => toggleSubTask(goal._id, index)}
                          >
                            {task.description}
                          </Checkbox>
                        ))}
                      </Stack>
                    </VStack>
                  </VStack>
                </Collapse>
              </VStack>
            </Box>
          ))}
        </VStack>
      </VStack>

      <Modal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose a Goal Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <GoalTemplates onSelectTemplate={handleTemplateSelect} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default GoalTracker; 