import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import LogSign from './components/LogSign';
import ChatProvider from './Context/ChatProvider';
 // Import your ChatProvider component

function App() {
  return (
    <ChakraProvider>
      <div className='App'>
        
          <ChatProvider> {/* Wrap ChatProvider around your Routes */}
            <Routes>
              <Route path="/" element={<Homepage />} exact />
              <Route path="/chats" element={<ChatPage />} />
              <Route path="/welcome" element={<LogSign />} />
            </Routes>
          </ChatProvider>

      </div>
    </ChakraProvider>
  );
}

export default App;
