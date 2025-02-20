import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import '../styles/calendar.css';

function DiaryCalendar({ entries, onDateClick, selectedDate }) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [markedDates, setMarkedDates] = useState([]);

  useEffect(() => {
    if (entries) {
      setMarkedDates(entries.map(entry => new Date(entry.date)));
    }
  }, [entries]);

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

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

      <Box className="calendar-container" w="100%">
        <Calendar
          onChange={onDateClick}
          value={selectedDate ? new Date(selectedDate) : new Date()}
          activeStartDate={currentMonth}
          tileClassName={({ date }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            date.setHours(0, 0, 0, 0);

            // Check if date has an entry
            const hasEntry = markedDates.some(markedDate => 
              date.getDate() === markedDate.getDate() &&
              date.getMonth() === markedDate.getMonth() &&
              date.getFullYear() === markedDate.getFullYear()
            );

            if (hasEntry) return 'has-entry';
            if (date > today) return 'future-date';
            if (date.getTime() === today.getTime()) return 'today';
            return 'past-date';
          }}
        />
      </Box>
    </VStack>
  );
}

export default DiaryCalendar; 