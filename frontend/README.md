# FEAFL Switch Toggle Frontend

A React-based frontend application for the Switch Toggle WebSocket system.

## Features

- **Real-time Updates**: Connects to a WebSocket server for immediate state changes
- **Dual Interface**: Admin page for controlling switches and Client page for viewing switch statuses
- **Persistent State**: Syncs switch states with localStorage for offline viewing
- **Responsive Design**: Mobile-friendly UI using Chakra UI components

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- The FEAFL Switch Toggle Server running (see `/feafl/server`)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at http://localhost:5173 (or another port if 5173 is in use).

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

Create a `.env` file in the frontend directory with these variables:

```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/ws
```

Adjust the URLs according to your server setup.

## Pages

- **Client View** (`/`): Displays all switches and their current status
- **Admin View** (`/admin`): Interactive interface to toggle switches

## Architecture

- **Context API**: Manages global state and WebSocket connections
- **WebSocket Service**: Handles real-time communication with the server
- **Local Storage**: Provides persistent cache of switch states
- **React Router**: Handles navigation between pages
- **Chakra UI**: Component library for UI elements

## Testing

Coming soon!