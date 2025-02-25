import React from 'react';
import {
  Button,
  VStack,
  Text,
  useToast,
  Grid,
  Box,
} from '@chakra-ui/react';

const templates = [
  {
    title: "Exercise Routine",
    description: "Start a regular exercise habit",
    category: "Health",
    subTasks: [
      "Choose workout type",
      "Set schedule",
      "Get equipment/gym membership",
      "Complete first workout"
    ]
  },
  {
    title: "Learning Project",
    description: "Master a new skill",
    category: "Learning",
    subTasks: [
      "Choose learning resource",
      "Complete basic tutorials",
      "Build practice project",
      "Share progress"
    ]
  },
  {
    title: "Habit Formation",
    description: "Build a new daily habit",
    category: "Personal",
    subTasks: [
      "Define specific habit",
      "Set daily reminder",
      "Track for one week",
      "Review and adjust"
    ]
  },
  {
    title: "Project Milestone",
    description: "Complete a major project phase",
    category: "Career",
    subTasks: [
      "Define deliverables",
      "Create timeline",
      "Assign tasks",
      "Review progress"
    ]
  }
];

function GoalTemplates({ onSelectTemplate }) {
  const toast = useToast();

  const handleSelectTemplate = (template) => {
    onSelectTemplate({
      description: template.title + ": " + template.description,
      category: template.category,
      subTasks: template.subTasks.map(task => ({
        description: task,
        completed: false
      })),
      progress: 0,
      completed: false
    });

    toast({
      title: "Template selected",
      description: `${template.title} template loaded`,
      status: "success",
      duration: 2000,
    });
  };

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
      {templates.map((template, index) => (
        <Box
          key={index}
          p={4}
          borderWidth={1}
          borderRadius="lg"
          cursor="pointer"
          _hover={{ bg: "gray.50" }}
          onClick={() => handleSelectTemplate(template)}
        >
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">{template.title}</Text>
            <Text fontSize="sm" color="gray.600">{template.description}</Text>
            <Text fontSize="xs" color="purple.500">{template.category}</Text>
          </VStack>
        </Box>
      ))}
    </Grid>
  );
}

export default GoalTemplates; 