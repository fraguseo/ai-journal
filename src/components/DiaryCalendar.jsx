import React, { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  startOfWeek,
  endOfWeek,
  addDays,
  isFuture
} from 'date-fns';

function DiaryCalendar({ entries, onDateClick }) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date('2025-02-15')); // Set to Feb 2025
  const today = new Date('2025-02-15'); // Set to Feb 15, 2025
  const [selectedDate, setSelectedDate] = useState(null); // Add this for tracking clicks
  
  // Use currentMonth for display
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Get the start of the first week
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
  // Get the end of the last week
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Sunday start
  
  // Get all days to display
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const hasEntries = (date) => {
    return entries.some(entry => 
      isSameDay(new Date(entry.date), date)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  return (
    <VStack spacing={4} w="100%">
      <HStack justify="space-between" w="100%">
        <Button onClick={prevMonth} leftIcon={<ChevronLeftIcon />}>
          Previous
        </Button>
        <Text fontSize="xl" fontWeight="bold">
          {format(currentMonth, 'MMMM yyyy')}
        </Text>
        <Button onClick={nextMonth} rightIcon={<ChevronRightIcon />}>
          Next
        </Button>
      </HStack>

      <SimpleGrid columns={7} spacing={2} w="100%">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Box key={day} textAlign="center" fontWeight="bold">
            {day}
          </Box>
        ))}
        
        {days.map((date, i) => {
          const isFutureDate = isFuture(date);
          const hasEntry = hasEntries(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          
          return (
            <Box
              key={i}
              p={2}
              textAlign="center"
              cursor="pointer"
              bg={
                isSameDay(date, today) 
                  ? 'blue.100' 
                  : isSelected && isFutureDate
                    ? 'yellow.100'
                    : hasEntry 
                      ? 'green.100' 
                      : 'transparent'
              }
              opacity={format(date, 'M') !== format(currentMonth, 'M') ? 0.5 : 1}
              borderRadius="md"
              onClick={() => {
                setSelectedDate(date);
                onDateClick(format(date, 'yyyy-MM-dd'));
              }}
              _hover={{
                bg: isFutureDate ? 'yellow.200' : hasEntry ? 'green.200' : 'gray.100'
              }}
            >
              {format(date, 'd')}
            </Box>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
}

export default DiaryCalendar; 