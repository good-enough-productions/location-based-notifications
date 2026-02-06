import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { 
  Reminder, 
  Location, 
  LocationGroup, 
  AppSettings, 
  LocationHistory,
  CalendarEvent
} from '../types';

interface StoreState {
  reminders: Reminder[];
  locations: Location[];
  locationGroups: LocationGroup[];
  locationHistory: LocationHistory[];
  calendarEvents: CalendarEvent[];
  settings: AppSettings;
  
  // Reminders
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  toggleReminderActive: (id: string, isActive: boolean) => void;
  
  // Locations
  addLocation: (location: Location) => void;
  updateLocation: (location: Location) => void;
  deleteLocation: (id: string) => void;
  
  // Location Groups
  addLocationGroup: (group: LocationGroup) => void;
  updateLocationGroup: (group: LocationGroup) => void;
  deleteLocationGroup: (id: string) => void;
  
  // Location History
  addLocationHistory: (history: LocationHistory) => void;
  clearLocationHistory: () => void;
  
  // Calendar Events
  setCalendarEvents: (events: CalendarEvent[]) => void;
  addCalendarEvent: (event: CalendarEvent) => void;
  
  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;
}

// Default settings
const defaultSettings: AppSettings = {
  batteryOptimization: 'balanced',
  defaultRadius: 100,
  defaultNotificationPriority: 'normal',
  enableCalendarSync: true,
  enableLocationHistory: true,
  enableBackgroundTracking: true,
  privacyMode: false,
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      reminders: [],
      locations: [],
      locationGroups: [],
      locationHistory: [],
      calendarEvents: [],
      settings: defaultSettings,
      
      // Reminders
      addReminder: (reminder) => 
        set((state) => ({ reminders: [...state.reminders, reminder] })),
      updateReminder: (reminder) => 
        set((state) => ({ 
          reminders: state.reminders.map((r) => 
            r.id === reminder.id ? reminder : r
          ) 
        })),
      deleteReminder: (id) => 
        set((state) => ({ 
          reminders: state.reminders.filter((r) => r.id !== id) 
        })),
      toggleReminderActive: (id, isActive) => 
        set((state) => ({ 
          reminders: state.reminders.map((r) => 
            r.id === id ? { ...r, isActive } : r
          ) 
        })),
      
      // Locations
      addLocation: (location) => 
        set((state) => ({ locations: [...state.locations, location] })),
      updateLocation: (location) => 
        set((state) => ({ 
          locations: state.locations.map((l) => 
            l.id === location.id ? location : l
          ) 
        })),
      deleteLocation: (id) => 
        set((state) => ({ 
          locations: state.locations.filter((l) => l.id !== id) 
        })),
      
      // Location Groups
      addLocationGroup: (group) => 
        set((state) => ({ locationGroups: [...state.locationGroups, group] })),
      updateLocationGroup: (group) => 
        set((state) => ({ 
          locationGroups: state.locationGroups.map((g) => 
            g.id === group.id ? group : g
          ) 
        })),
      deleteLocationGroup: (id) => 
        set((state) => ({ 
          locationGroups: state.locationGroups.filter((g) => g.id !== id) 
        })),
      
      // Location History
      addLocationHistory: (history) => 
        set((state) => ({ 
          locationHistory: [...state.locationHistory, history].slice(-100) // Keep last 100 entries
        })),
      clearLocationHistory: () => 
        set({ locationHistory: [] }),
      
      // Calendar Events
      setCalendarEvents: (events) => 
        set({ calendarEvents: events }),
      addCalendarEvent: (event) => 
        set((state) => ({ 
          calendarEvents: [...state.calendarEvents, event] 
        })),
      
      // Settings
      updateSettings: (newSettings) => 
        set((state) => ({ 
          settings: { ...state.settings, ...newSettings } 
        })),
    }),
    {
      name: 'location-reminder-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);