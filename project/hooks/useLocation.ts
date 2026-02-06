import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { 
  initLocationService, 
  getCurrentLocation, 
  startLocationTracking, 
  stopLocationTracking 
} from '../services/locationService';
import { useStore } from '../store/useStore';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  
  const settings = useStore(state => state.settings);

  // Initialize location services
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      try {
        await initLocationService();
        
        if (isMounted) {
          setPermissionsGranted(true);
          
          // Get initial location
          const currentLocation = await getCurrentLocation();
          setLocation(currentLocation);
          
          // Start tracking if enabled in settings
          if (settings.enableBackgroundTracking && Platform.OS !== 'web') {
            await startLocationTracking();
            setIsTracking(true);
          }
        }
      } catch (error) {
        if (isMounted) {
          setErrorMsg(error instanceof Error ? error.message : 'Unknown error');
          setPermissionsGranted(false);
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
      
      // Don't stop tracking on unmount, as we want it to continue in background
      // Only stop when explicitly requested
    };
  }, [settings.enableBackgroundTracking]);
  
  // Update tracking when setting changes
  useEffect(() => {
    const updateTracking = async () => {
      if (Platform.OS === 'web') return;
      
      if (settings.enableBackgroundTracking && !isTracking && permissionsGranted) {
        await startLocationTracking();
        setIsTracking(true);
      } else if (!settings.enableBackgroundTracking && isTracking) {
        await stopLocationTracking();
        setIsTracking(false);
      }
    };
    
    updateTracking();
  }, [settings.enableBackgroundTracking, isTracking, permissionsGranted]);
  
  // Function to manually update current location
  const updateCurrentLocation = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
      return currentLocation;
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  };
  
  // Function to toggle tracking manually
  const toggleTracking = async () => {
    if (Platform.OS === 'web') {
      setErrorMsg('Background tracking not available on web');
      return;
    }
    
    try {
      if (isTracking) {
        await stopLocationTracking();
        setIsTracking(false);
      } else if (permissionsGranted) {
        await startLocationTracking();
        setIsTracking(true);
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Unknown error');
    }
  };
  
  return {
    location,
    errorMsg,
    isTracking,
    permissionsGranted,
    updateCurrentLocation,
    toggleTracking,
  };
};