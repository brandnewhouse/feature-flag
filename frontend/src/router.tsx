import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';

// Lazy load pages
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ClientPage = lazy(() => import('./pages/ClientPage'));

// Loading component
const Loading = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    height="100vh" 
    flexDirection="column"
    gap={4}
  >
    <Spinner size="xl" color="blue.500" />
    <Text>Loading...</Text>
  </Box>
);

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <ClientPage />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<Loading />}>
        <AdminPage />
      </Suspense>
    ),
  }
]);

export default function Router() {
  return <RouterProvider router={router} />;
}