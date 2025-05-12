# FEAFL Switch Toggle Server

A WebSocket-based server for controlling and monitoring switches in real-time.

## Features

- Real-time switch toggling via WebSockets
- REST API endpoints for switch status management
- Bi-directional communication between server and clients
- In-memory storage of switch states

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Reference

### WebSocket Endpoints

- `ws://localhost:3000/ws` - WebSocket endpoint for real-time communication

#### WebSocket Messages

**From Server to Client:**

1. Initial State:
   ```json
   {
     "type": "INIT",
     "switches": {
       "SWITCH1": { "id": "SWITCH1", "status": "OFF", "name": "Switch 1" },
       "SWITCH2": { "id": "SWITCH2", "status": "OFF", "name": "Switch 2" },
       "SWITCH3": { "id": "SWITCH3", "status": "OFF", "name": "Switch 3" }
     }
   }
   ```

2. Switch Update:
   ```json
   {
     "type": "SWITCH_UPDATE",
     "switch": { "id": "SWITCH1", "status": "ON", "name": "Switch 1" }
   }
   ```

**From Client to Server:**

1. Toggle Switch:
   ```json
   {
     "type": "TOGGLE_SWITCH",
     "switchId": "SWITCH1"
   }
   ```

### REST API Endpoints

- `GET /switches` - Get all switches
- `GET /switches/:id` - Get switch by ID
- `PUT /switches/:id` - Update switch status
  - Request body: `{ "status": "ON" }` or `{ "status": "OFF" }`

## Example Client

An example HTML client is included in the `examples` directory. Open `examples/client.html` in a web browser to test the WebSocket functionality.

## Technology Stack

- [Hono](https://hono.dev/) - Fast, lightweight web framework
- [ws](https://github.com/websockets/ws) - WebSocket implementation for Node.js
- TypeScript - For type safety and better developer experience