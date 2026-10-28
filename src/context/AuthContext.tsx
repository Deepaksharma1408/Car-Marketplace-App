import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DemoUser = { id: string; name: string; email: string };
const SESSION_KEY = '@vehiclespot_demo_session';
const AuthContext = createContext<{ user: DemoUser | null; ready: boolean; signIn: (name: string, email: string) => Promise<void>; signOut: () => Promise<void> } | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    async function restore() {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        const saved = raw ? JSON.parse(raw) : null;
        if (mounted && saved && typeof saved.id === 'string' && typeof saved.name === 'string' && typeof saved.email === 'string') setUser(saved);
      } catch (error) { console.warn('Could not restore demo session', error); }
      finally { if (mounted) setReady(true); }
    }
    void restore();
    return () => { mounted = false; };
  }, []);
  async function signIn(name: string, email: string) {
    const normalized = email.trim().toLowerCase();
    if (name.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Enter your name and a valid email address.');
    const next = { id: `demo-${normalized}`, name: name.trim(), email: normalized };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setUser(next);
  }
  async function signOut() {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, ready, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider is missing');
  return value;
}
