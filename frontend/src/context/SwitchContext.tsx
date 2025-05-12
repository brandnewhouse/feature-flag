import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchSwitches } from '../services/api';
import websocketService from '../services/websocket';
import type { Switch, InitMessage, SwitchUpdateMessage } from '../types';
import { STORAGE_KEY } from '../types';

interface SwitchContextType {
  switches: Record<string, Switch>;
  loading: boolean;
  error: string | null;
  toggleSwitch: (switchId: string) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
}

const SwitchContext = createContext<SwitchContextType | undefined>(undefined);

interface SwitchProviderProps {
  children: ReactNode;
}

export const SwitchProvider = ({ children }: SwitchProviderProps) => {
  const [switches, setSwitches] = useState<Record<string, Switch>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Initialize switches from localStorage or API
  useEffect(() => {
    const initSwitches = async () => {
      try {
        // First try to get from localStorage
        const storedSwitches = localStorage.getItem(STORAGE_KEY);
        if (storedSwitches) {
          setSwitches(JSON.parse(storedSwitches));
          setLoading(false);
        } else {
          // Fallback to API if nothing in localStorage
          const fetchedSwitches = await fetchSwitches();
          const switchesMap = fetchedSwitches.reduce<Record<string, Switch>>((acc: Record<string, Switch>, sw: Switch) => {
            acc[sw.id] = sw;
            return acc;
          }, {});
          
          setSwitches(switchesMap);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(switchesMap));
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing switches:', err);
        setError('Failed to load switches. Please try again later.');
        setLoading(false);
      }
    };

    initSwitches();
  }, []);

  // Connect to WebSocket and set up event listeners
  useEffect(() => {
    websocketService.connect();

    const removeListener = websocketService.addListener((data: any) => {
      if (data.type === 'INIT') {
        const initMessage = data as InitMessage;
        setSwitches(initMessage.switches);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initMessage.switches));
      } else if (data.type === 'SWITCH_UPDATE') {
        const updateMessage = data as SwitchUpdateMessage;
        setSwitches(prev => ({
          ...prev,
          [updateMessage.switch.id]: updateMessage.switch
        }));
      }
    });

    // Clean up WebSocket connection on unmount
    return () => {
      removeListener();
    };
  }, []);

  const toggleSwitch = (switchId: string) => {
    websocketService.toggleSwitch(switchId);
  };

  return (
    <SwitchContext.Provider value={{ 
      switches, 
      loading, 
      error, 
      toggleSwitch,
      isAdmin,
      setIsAdmin
    }}>
      {children}
    </SwitchContext.Provider>
  );
};

export const useSwitches = () => {
  const context = useContext(SwitchContext);
  if (context === undefined) {
    throw new Error('useSwitches must be used within a SwitchProvider');
  }
  return context;
};