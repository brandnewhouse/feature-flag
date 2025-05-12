import { Box, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { default as websocketService } from '../services/websocket';

type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export default function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    // Initial connection attempt
    websocketService.connect();
    
    // Set up listeners for connection status
    const socket = new WebSocket('ws://localhost:3000/ws');
    
    socket.onopen = () => {
      setStatus('connected');
    };
    
    socket.onclose = () => {
      setStatus('disconnected');
    };
    
    socket.onerror = () => {
      setStatus('disconnected');
    };
    
    // Cleanup
    return () => {
      socket.close();
    };
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'green.500';
      case 'connecting':
        return 'yellow.500';
      case 'disconnected':
        return 'red.500';
      default:
        return 'gray.500';
    }
  };

  return (
    <Box display="inline-flex" alignItems="center" gap={2}>
      <Box 
        width="10px" 
        height="10px" 
        borderRadius="50%" 
        bg={getStatusColor()} 
      />
      <Text fontSize="sm" color={getStatusColor()}>
        {status === 'connected' ? 'Connected' : 
         status === 'connecting' ? 'Connecting...' : 
         'Disconnected'}
      </Text>
    </Box>
  );
}