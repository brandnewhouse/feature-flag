import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {  Box } from '@chakra-ui/react';
import { SwitchProvider } from './context/SwitchContext';
import Router from './router';
import ConnectionStatus from './components/ConnectionStatus';

function App() {

  return (
      <SwitchProvider>
        <Box position="fixed" top={2} right={4} zIndex={10}>
          <ConnectionStatus />
        </Box>
        <Router />
      </SwitchProvider>
  )
}

export default App
