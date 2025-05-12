// Switch-related types
export interface Switch {
  id: string;
  status: 'ON' | 'OFF';
  name: string;
}

// WebSocket message types
export interface WSMessage {
  type: string;
}

export interface InitMessage extends WSMessage {
  type: 'INIT';
  switches: Record<string, Switch>;
}

export interface SwitchUpdateMessage extends WSMessage {
  type: 'SWITCH_UPDATE';
  switch: Switch;
}

export interface ToggleSwitchMessage extends WSMessage {
  type: 'TOGGLE_SWITCH';
  switchId: string;
}

// API Response types
export interface ErrorResponse {
  error: string;
}

// Server config
export interface ServerConfig {
  port: number | string;
}