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

// Local Storage
export const STORAGE_KEY = 'feafl-switches';

// API Constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';