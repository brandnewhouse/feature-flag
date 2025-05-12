import { WS_URL, STORAGE_KEY } from '../types';
import type { InitMessage, SwitchUpdateMessage, ToggleSwitchMessage } from '../types';

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimeoutId: number | null = null;
  private listeners: ((event: unknown) => void)[] = [];
  private isConnecting = false;

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        if (this.reconnectTimeoutId !== null) {
          window.clearTimeout(this.reconnectTimeoutId);
          this.reconnectTimeoutId = null;
        }
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Handle initialization message
        if (data.type === 'INIT') {
          const initMessage = data as InitMessage;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initMessage.switches));
        }
        
        // Handle switch update message
        if (data.type === 'SWITCH_UPDATE') {
          const updateMessage = data as SwitchUpdateMessage;
          // Update local storage
          const switchesJson = localStorage.getItem(STORAGE_KEY);
          if (switchesJson) {
            const switches = JSON.parse(switchesJson);
            switches[updateMessage.switch.id] = updateMessage.switch;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(switches));
          }
        }

        // Notify all listeners
        this.notifyListeners(data);
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        this.isConnecting = false;
        this.reconnectTimeoutId = window.setTimeout(() => this.connect(), 3000);
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimeoutId !== null) {
      window.clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
  }

  toggleSwitch(switchId: string) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }

    const message: ToggleSwitchMessage = {
      type: 'TOGGLE_SWITCH',
      switchId
    };

    this.socket.send(JSON.stringify(message));
  }

  addListener(listener: (event: unknown) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(data: unknown) {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in WebSocket listener:', error);
      }
    });
  }
}

// Export a singleton instance
const websocketService = new WebSocketService();
export { websocketService as default };