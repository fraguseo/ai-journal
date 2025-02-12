import { ChakraProvider } from "@chakra-ui/react";
import Journal from "./components/Journal";

function App() {
  return (
    <ChakraProvider>
      <Journal />
    </ChakraProvider>
  );
}

export default App;
