import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle } from '@/types';
import { MOCK_VEHICLES } from '@/data/mockVehicles';

const SAVED_STORAGE_KEY = '@vehiclespot_saved_ids';
const LIKED_STORAGE_KEY = '@vehiclespot_liked_ids';

interface SavedContextType {
  savedIds: string[];
  likedIds: string[];
  isSaved: (id: string) => boolean;
  isLiked: (id: string) => boolean;
  toggleSave: (id: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  getLikesCount: (vehicle: Vehicle) => number;
  savedVehicles: Vehicle[];
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  // Pre-populate with one item (v1 - Porsche 911 GT3 RS) so user can see it right away or unsave it
  const [savedIds, setSavedIds] = useState<string[]>(['v1']);
  const [likedIds, setLikedIds] = useState<string[]>(['v1', 'v4']);

  useEffect(() => {
    async function loadStorage() {
      try {
        const storedSaved = await AsyncStorage.getItem(SAVED_STORAGE_KEY);
        if (storedSaved) {
          setSavedIds(JSON.parse(storedSaved));
        }
        const storedLiked = await AsyncStorage.getItem(LIKED_STORAGE_KEY);
        if (storedLiked) {
          setLikedIds(JSON.parse(storedLiked));
        }
      } catch (err) {
        console.warn('Failed to load saved/liked state from storage', err);
      }
    }
    loadStorage();
  }, []);

  const isSaved = (id: string) => savedIds.includes(id);
  const isLiked = (id: string) => likedIds.includes(id);

  const toggleSave = async (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      AsyncStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next)).catch(console.warn);
      return next;
    });
  };

  const toggleLike = async (id: string) => {
    setLikedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      AsyncStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(next)).catch(console.warn);
      return next;
    });
  };

  const getLikesCount = (vehicle: Vehicle) => {
    const defaultLiked = vehicle.id === 'v1' || vehicle.id === 'v4';
    const currentlyLiked = isLiked(vehicle.id);
    if (defaultLiked && !currentlyLiked) {
      return Math.max(0, vehicle.likesCount - 1);
    }
    if (!defaultLiked && currentlyLiked) {
      return vehicle.likesCount + 1;
    }
    return vehicle.likesCount;
  };

  const savedVehicles = MOCK_VEHICLES.filter((v) => savedIds.includes(v.id));

  return (
    <SavedContext.Provider
      value={{
        savedIds,
        likedIds,
        isSaved,
        isLiked,
        toggleSave,
        toggleLike,
        getLikesCount,
        savedVehicles,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved(): SavedContextType {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
}
