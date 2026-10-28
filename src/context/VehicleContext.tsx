import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_VEHICLES } from '@/data/mockVehicles';
import { Vehicle } from '@/types';

const KEY = '@vehiclespot_local_posts';
const VehicleContext = createContext<{ vehicles: Vehicle[]; ready: boolean; publish: (vehicle: Vehicle) => Promise<void> } | null>(null);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Vehicle[]>([]);
  const [ready, setReady] = useState(false);
  const current = useRef<Vehicle[]>([]);
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        const saved: unknown = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(saved) || !saved.every(v => v && typeof v.id === 'string' && Array.isArray(v.mediaUrls) && v.seller && v.specs)) throw new Error('Invalid local listings');
        if (mounted) { current.current = saved; setPosts(saved); }
      } catch (error) { console.warn('Could not load local listings', error); }
      finally { if (mounted) setReady(true); }
    }
    void load();
    return () => { mounted = false; };
  }, []);
  async function publish(vehicle: Vehicle) {
    if (!ready) throw new Error('Listings are still loading. Please try again.');
    const next = [vehicle, ...current.current.filter(v => v.id !== vehicle.id)];
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    current.current = next;
    setPosts(next);
  }
  const vehicles = useMemo(() => [...posts, ...MOCK_VEHICLES], [posts]);
  return <VehicleContext.Provider value={{ vehicles, ready, publish }}>{children}</VehicleContext.Provider>;
}

export function useVehicles() {
  const value = useContext(VehicleContext);
  if (!value) throw new Error('VehicleProvider is missing');
  return value;
}
