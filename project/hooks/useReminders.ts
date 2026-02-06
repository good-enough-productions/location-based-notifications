import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { Reminder, Location } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useReminders = () => {
  const reminders = useStore((state) => state.reminders);
  const locations = useStore((state) => state.locations);
  const locationGroups = useStore((state) => state.locationGroups);
  const defaultRadius = useStore((state) => state.settings.defaultRadius);
  const defaultPriority = useStore((state) => state.settings.defaultNotificationPriority);
  
  const addReminder = useStore((state) => state.addReminder);
  const updateReminder = useStore((state) => state.updateReminder);
  const deleteReminder = useStore((state) => state.deleteReminder);
  const toggleReminderActive = useStore((state) => state.toggleReminderActive);

  // Active reminders
  const activeReminders = reminders.filter((r) => r.isActive);
  
  // Inactive reminders
  const inactiveReminders = reminders.filter((r) => !r.isActive);

  // Create a new reminder with default values
  const createReminder = useCallback((
    title: string,
    locationIds: string[] = [],
    locationGroupIds: string[] = [],
    description: string = '',
    customRadius?: number,
    isPersistent: boolean = true,
    notificationContent: string = '',
    priority?: 'low' | 'normal' | 'high',
    tags: string[] = []
  ): Reminder => {
    return {
      id: uuidv4(),
      title,
      description,
      locationIds,
      locationGroupIds,
      radius: customRadius ?? defaultRadius,
      notificationContent,
      notificationPriority: priority ?? defaultPriority,
      isPersistent,
      isActive: true,
      createdAt: Date.now(),
      tags,
    };
  }, [defaultRadius, defaultPriority]);

  // Get locations for a specific reminder
  const getLocationsForReminder = useCallback((reminder: Reminder): Location[] => {
    // Direct locations
    const directLocations = locations.filter((location) => 
      reminder.locationIds.includes(location.id)
    );
    
    // Locations from groups
    const groupLocations = locations.filter((location) => {
      return locationGroups.some((group) => 
        reminder.locationGroupIds.includes(group.id) && 
        group.locations.includes(location.id)
      );
    });
    
    // Combine and remove duplicates
    const allLocations = [...directLocations, ...groupLocations];
    const uniqueLocations = allLocations.filter(
      (location, index, self) => 
        index === self.findIndex((l) => l.id === location.id)
    );
    
    return uniqueLocations;
  }, [locations, locationGroups]);

  // Filter reminders by location
  const filterRemindersByLocation = useCallback((locationId: string): Reminder[] => {
    return reminders.filter((reminder) => {
      // Check direct locations
      if (reminder.locationIds.includes(locationId)) {
        return true;
      }
      
      // Check location groups
      return locationGroups.some(
        (group) => 
          reminder.locationGroupIds.includes(group.id) && 
          group.locations.includes(locationId)
      );
    });
  }, [reminders, locationGroups]);

  // Filter reminders by tag
  const filterRemindersByTag = useCallback((tag: string): Reminder[] => {
    return reminders.filter((reminder) => reminder.tags.includes(tag));
  }, [reminders]);

  return {
    reminders,
    activeReminders,
    inactiveReminders,
    createReminder,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminderActive,
    getLocationsForReminder,
    filterRemindersByLocation,
    filterRemindersByTag,
  };
};