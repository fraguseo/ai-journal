import React from 'react';
import {
  Box,
  Grid,
  Text,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

function DiaryCalendar({ entries, onDateClick }) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

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

      <Grid templateColumns="repeat(7, 1fr)" gap={2} w="100%">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Box key={day} textAlign="center" fontWeight="bold">
            {day}
          </Box>
        ))}
        
        {daysInMonth.map((date) => {
          const hasEntry = entries.some((entry) => 
            isSameDay(new Date(entry.date), date)
          );
          
          return (
            <Box
              key={date.toString()}
              p={2}
              textAlign="center"
              cursor="pointer"
              bg={hasEntry ? 'green.100' : 'transparent'}
              borderRadius="md"
              onClick={() => onDateClick(date)}
              _hover={{ bg: hasEntry ? 'green.200' : 'gray.100' }}
            >
              {format(date, 'd')}
            </Box>
          );
        })}
      </Grid>
    </VStack>
  );
}

export default DiaryCalendar; 