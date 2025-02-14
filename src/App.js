import React from 'react';
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Journal from './components/Journal';
import Diary from './components/Diary';

function App() {
  return (
    <ChakraProvider>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>AI Chat</Tab>
          <Tab>Daily Diary</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <Journal />
          </TabPanel>
          <TabPanel>
            <Diary />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;
