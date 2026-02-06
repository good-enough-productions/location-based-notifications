import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useStore } from '../store/useStore';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
// Corrected import: LocationHistory instead of LocationHistoryEntry
import { Reminder, Location as AppLocation, LocationHistory } from '../types'; 

// Background location task name
const LOCATION_TASK_NAME = 'background-location-task';

// Initialize location service
export const initLocationService = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access foreground location was denied');
    }
    
    // Request background permissions on iOS and Android
    if (Platform.OS !== 'web') {
      const { status: backgroundStatus } = 
        await Location.requestBackgroundPermissionsAsync();
      
      if (backgroundStatus !== 'granted') {
        console.warn('Background location permission denied. Background features may be limited.');
      }
    }
    
    // Define the background task if not on web
    if (Platform.OS !== 'web' && !TaskManager.isTaskDefined(LOCATION_TASK_NAME)) {
      TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => { // Match the type from our declaration file
        if (error) {
          console.error('Background location task error:', error);
          return;
        }
        
        if (data && data.locations) { // Check data and locations exist
          try {
            handleLocationUpdate(data.locations[0]);
          } catch (updateError) {
            console.error('Error handling location update in background task:', updateError);
          }
        }
      });
    }
    return true;
  } catch (error) {
    console.error('Error initializing location service:', error);
    throw error; 
  }
};

// Start location tracking
export const startLocationTracking = async () => {
  const settings = useStore.getState().settings;
  
  if (Platform.OS === 'web') {
    console.warn('Background location tracking not available on web');
    return;
  }
  
  try {
    const { accuracy, timeInterval, distanceInterval } = getBatteryOptimizationSettings(
      settings.batteryOptimization
    );
    
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy,
      timeInterval,
      distanceInterval,
      foregroundService: {
        notificationTitle: 'Location Reminder',
        notificationBody: 'Tracking your location for reminders',
        notificationColor: '#4A80F0',
      },
    });
    
    console.log('Background location tracking started');
    return true;
  } catch (error) {
    console.error('Error starting location tracking:', error);
    throw new Error(`Failed to start location tracking: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Stop location tracking
export const stopLocationTracking = async () => {
  if (Platform.OS === 'web') {
    return;
  }
  
  try {
    const isTaskRegistered = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    
    if (isTaskRegistered) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log('Background location tracking stopped');
    }
    return true;
  } catch (error) {
    console.error('Error stopping location tracking:', error);
    throw new Error(`Failed to stop location tracking: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Get current location
export const getCurrentLocation = async (): Promise<Location.LocationObject> => {
  try {
    const settings = useStore.getState().settings;
    const { accuracy } = getBatteryOptimizationSettings(
      settings.batteryOptimization
    );
    
    const location = await Location.getCurrentPositionAsync({
      accuracy,
    });
    if (!location) {
        throw new Error('Failed to get current position.');
    }
    return location;
  } catch (error) {
    console.error('Error getting current location:', error);
    throw new Error(`Failed to get current location: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Check if a location is within the radius of any reminders
const checkRemindersProximity = (
  currentLocation: Location.LocationObject
) => {
  const { reminders, locations } = useStore.getState();
  const activeReminders = reminders.filter((r: Reminder) => r.isActive); // Add Reminder type
  
  activeReminders.forEach((reminder: Reminder) => { // Add Reminder type
    const reminderLocations = locations.filter((loc: AppLocation) => // Add AppLocation type
      reminder.locationIds.includes(loc.id)
    );
    
    for (const loc of reminderLocations) {
      const distance = calculateDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        loc.latitude,
        loc.longitude
      );
      
      if (distance <= reminder.radius) {
        triggerReminderNotification(reminder, loc);
        
        const historyEntry: LocationHistory = { // Corrected type: LocationHistory
          id: uuidv4(),
          locationId: loc.id,
          timestamp: Date.now(),
          triggeredReminderId: reminder.id
        };
        
        useStore.getState().addLocationHistory(historyEntry);
        
        if (!reminder.isPersistent) {
          useStore.getState().toggleReminderActive(reminder.id, false);
        }
        
        break;
      }
    }
  });
};

// Handle location update
const handleLocationUpdate = (location: Location.LocationObject) => {
  if (useStore.getState().settings.enableBackgroundTracking) {
    checkRemindersProximity(location);
  }
};

// Calculate distance between two coordinates in meters using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

// Get settings based on battery optimization level
const getBatteryOptimizationSettings = (level: string) => {
  switch (level) {
    case 'low':
      return {
        accuracy: Location.Accuracy.Lowest,
        timeInterval: 60000,
        distanceInterval: 500,
      };
    case 'high':
      return {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 10000,
        distanceInterval: 50,
      };
    case 'balanced':
    default:
      return {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 30000,
        distanceInterval: 100,
      };
  }
};

// This function will be defined in notificationService.ts
const triggerReminderNotification = (reminder: Reminder, location: AppLocation) => { // Add types
  console.log('Notification triggered for reminder:', reminder.title, 'at location:', location.name);
};