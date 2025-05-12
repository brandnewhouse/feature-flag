import { Box, Heading, VStack, Text, HStack, Button } from '@chakra-ui/react';
import { useSwitches } from '../context/SwitchContext';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function ClientPage() {
  const { switches, loading, error, setIsAdmin } = useSwitches();
  
  // Ensure we're in client mode
  useEffect(() => {
    setIsAdmin(false);
    return () => setIsAdmin(false);
  }, [setIsAdmin]);

  if (loading) {
    return (
      <Box p={5} display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text fontSize="xl">Loading switches...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={5} display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
        <Text color="red.500" fontSize="xl" mb={4}>{error}</Text>
        <Button colorScheme="blue" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box p={8} maxWidth="800px" margin="0 auto">
      <HStack justifyContent="space-between" mb={6}>
        <Heading as="h1" size="xl">Switch Status Dashboard</Heading>
        <Button as={Link} to="/admin" colorScheme="teal" variant="outline">
          Go to Admin Page
        </Button>
      </HStack>
      
      <Text mb={6} color="gray.600">
        Real-time switch status monitor. All status changes update automatically.
      </Text>
      
      
      <VStack spacing={6} align="stretch">
        {Object.values(switches).map((sw) => (
          <Box 
            key={sw.id} 
            p={5} 
            borderWidth={1} 
            borderRadius="md" 
            boxShadow="sm"
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            bg={sw.status === 'ON' ? 'green.50' : 'gray.50'}
            borderColor={sw.status === 'ON' ? 'green.200' : 'gray.200'}
            transition="all 0.3s ease"
          >
            <VStack align="flex-start" spacing={1}>
              <Text fontWeight="bold" fontSize="lg">{sw.name}</Text>
              <Text color="gray.600" fontSize="sm">ID: {sw.id}</Text>
            </VStack>
            
            <Box 
              py={2} 
              px={4} 
              borderRadius="md" 
              bg={sw.status === 'ON' ? 'green.500' : 'gray.500'} 
              color="white"
              fontWeight="bold"
            >
              {sw.status}
            </Box>
          </Box>
        ))}
      </VStack>
      
      {Object.keys(switches).length === 0 && (
        <Box textAlign="center" p={10} bg="gray.50" borderRadius="md">
          <Text color="gray.500">No switches available</Text>
        </Box>
      )}
    </Box>
  );
}