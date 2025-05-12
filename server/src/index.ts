import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { WebSocketServer } from 'ws'
import { createServer } from 'node:http'
import type { WebSocket } from 'ws'
import { Switch, InitMessage, SwitchUpdateMessage, ToggleSwitchMessage } from './types.js'

// In-memory storage for switches
const switches: Record<string, Switch> = {
  'SWITCH1': { id: 'SWITCH1', status: 'OFF', name: 'Switch 1' },
  'SWITCH2': { id: 'SWITCH2', status: 'OFF', name: 'Switch 2' },
  'SWITCH3': { id: 'SWITCH3', status: 'OFF', name: 'Switch 3' }
}

// Create Hono app
const app = new Hono()
app.use('/*', cors())

// Set up port
const PORT = process.env.PORT || 3035

// Create HTTP server
const server = createServer()

// Create WebSocket server
const wss = new WebSocketServer({ noServer: true })

// Store connected clients
const clients = new Set<WebSocket>()

// WebSocket connection handler
wss.on('connection', (ws: WebSocket) => {
  // Add client to the set
  clients.add(ws)

  console.log('Client connected, total clients:', clients.size)

  // Send initial state to the client
  const initMessage: InitMessage = { type: 'INIT', switches }
  ws.send(JSON.stringify(initMessage))

  // Handle messages from client
  ws.on('message', (message: Buffer) => {
    try {
      const data = JSON.parse(message.toString())

      // Handle switch toggle request
      if (data.type === 'TOGGLE_SWITCH' && data.switchId) {
        const switchId = data.switchId

        if (switches[switchId]) {
          // Toggle the switch status
          switches[switchId].status = switches[switchId].status === 'ON' ? 'OFF' : 'ON'

          // Broadcast to all clients
          const update: SwitchUpdateMessage = {
            type: 'SWITCH_UPDATE',
            switch: switches[switchId]
          }

          for (const client of clients) {
            client.send(JSON.stringify(update))
          }

          console.log(`Switch ${switchId} toggled to ${switches[switchId].status}`)
        }
      }
    } catch (err) {
      console.error('Error processing message:', err)
    }
  })

  // Handle client disconnect
  ws.on('close', () => {
    clients.delete(ws)
    console.log('Client disconnected, total clients:', clients.size)
  })
})

// Define REST API routes
app.get('/', (c) => {
  return c.text('FEAFL Switch Toggle Server')
})

// Get all switches
app.get('/switches', (c) => {
  return c.json(Object.values(switches))
})

// Get switch by ID
app.get('/switches/:id', (c) => {
  const id = c.req.param('id')
  const switchData = switches[id]

  if (!switchData) {
    return c.json({ error: 'Switch not found' }, 404)
  }

  return c.json(switchData)
})

// Update switch status
app.put('/switches/:id', async (c) => {
  const id = c.req.param('id')
  const switchData = switches[id]

  if (!switchData) {
    return c.json({ error: 'Switch not found' }, 404)
  }

  try {
    const body = await c.req.json()

    if (typeof body.status === 'string' && (body.status === 'ON' || body.status === 'OFF')) {
      switches[id].status = body.status

      // Broadcast to all WebSocket clients
      const update: SwitchUpdateMessage = {
        type: 'SWITCH_UPDATE',
        switch: switches[id]
      }

      for (const client of clients) {
        client.send(JSON.stringify(update))
      }

      return c.json(switches[id])
    }

    return c.json({ error: 'Invalid status. Must be ON or OFF.' }, 400)
  } catch (err) {
    return c.json({ error: 'Invalid request body' }, 400)
  }
})

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
  if (request.url === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
})

// Configure Hono app to use our HTTP server
serve({
  fetch: app.fetch,
  port: Number(PORT),
})

// // Start the HTTP server separately so websocket upgrade works
server.listen(3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`WebSocket server is running on ws://localhost:${PORT}/ws`)
})
