import axios from 'axios';
import { API_BASE_URL } from '../types';
import type { Switch } from '../types';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchSwitches = async (): Promise<Switch[]> => {
  try {
    const response = await apiClient.get('/switches');
    return response.data;
  } catch (error) {
    console.error('Error fetching switches:', error);
    throw error;
  }
};

export const fetchSwitch = async (id: string): Promise<Switch> => {
  try {
    const response = await apiClient.get(`/switches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching switch ${id}:`, error);
    throw error;
  }
};

export const updateSwitchStatus = async (id: string, status: 'ON' | 'OFF'): Promise<Switch> => {
  try {
    const response = await apiClient.put(`/switches/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating switch ${id}:`, error);
    throw error;
  }
};

export default apiClient;