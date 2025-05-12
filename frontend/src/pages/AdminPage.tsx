import { Box, Button, Heading, Switch, VStack, Text, HStack } from '@chakra-ui/react';
import { useSwitches } from '../context/SwitchContext';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function AdminPage() {
  const { switches, loading, error, toggleSwitch, setIsAdmin } = useSwitches();
  // const toast = useToast();

  // Set admin mode on component mount
  useEffect(() => {
    setIsAdmin(true);
    return () => setIsAdmin(false);
  }, [setIsAdmin]);

  const handleToggle = (switchId: string) => {
    try {
      toggleSwitch(switchId);
      // toast({
      //   title: 'Switch toggled',
      //   description: `Successfully toggled switch ${switchId}`,
      //   status: 'success',
      //   duration: 3000,
      //   isClosable: true,
      // });
    } catch (err) {
      // toast({
      //   title: 'Error',
      //   description: 'Failed to toggle switch. Please try again.',
      //   status: 'error',
      //   duration: 5000,
      //   isClosable: true,
      // });
    }
  };

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
        <Heading as="h1" size="xl">Admin Dashboard</Heading>
        <Button as={Link} to="/" colorScheme="teal" variant="outline">
          View Client Page
        </Button>
      </HStack>
      
      <Text mb={6} color="gray.600">
        Toggle switches to change their state. All connected clients will receive real-time updates.
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
          >
            <VStack align="flex-start" spacing={1}>
              <Text fontWeight="bold" fontSize="lg">{sw.name}</Text>
              <Text color="gray.600" fontSize="sm">ID: {sw.id}</Text>
              <Text 
                color={sw.status === 'ON' ? 'green.500' : 'gray.500'} 
                fontWeight="medium"
              >
                {sw.status}
              </Text>
            </VStack>
            <Switch.Root
              onCheckedChange={() => handleToggle(sw.id)}

            >
              <Switch.HiddenInput />
              <Switch.Control onChange={() => {console.log("what")}}>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Label />
            </Switch.Root>
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