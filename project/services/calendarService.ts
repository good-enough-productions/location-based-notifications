import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import { formatISO } from 'date-fns';
import { CalendarEvent } from '../types';
import { useStore } from '../store/useStore';
import { scheduleNotification, getPreDepartureNotificationTime } from './notificationService';

// Flag to track if Calendar has been initialized
let isCalendarInitialized = false;

// Initialize calendar service
export const initCalendarService = async () => {
  if (Platform.OS === 'web') {
    console.warn('Calendar functionality is limited on web');
    return false;
  }

  try {
    // Ensure the Calendar module exists
    if (!Calendar) {
      console.error('Calendar module not found');
      return false;
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Calendar permission not granted');
      return false;
    }
    
    isCalendarInitialized = true;
    return true;
  } catch (error) {
    console.error('Error initializing Calendar:', error);
    return false;
  }
};

// Safe wrapper for Calendar API calls
const safeCalendarCall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
  if (Platform.OS === 'web') {
    return null;
  }

  if (!isCalendarInitialized) {
    await initCalendarService();
  }

  try {
    return await apiCall();
  } catch (error) {
    console.error('Calendar API error:', error);
    return null;
  }
};

// Get all calendars
export const getCalendars = async () => {
  if (Platform.OS === 'web') {
    return [];
  }

  const result = await safeCalendarCall(() => 
    Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
  );
  
  return result || [];
};

// Get events from a specific calendar
export const getCalendarEvents = async (
  calendarId: string,
  startDate: Date,
  endDate: Date
): Promise<CalendarEvent[]> => {
  if (Platform.OS === 'web') {
    return [];
  }

  try {
    const events = await safeCalendarCall(() => 
      Calendar.getEventsAsync([calendarId], startDate, endDate)
    );

    if (!events) return [];

    // Convert to our app's CalendarEvent format
    return events.map((event: any) => ({
      id: event.id,
      title: event.title,
      startDate: formatISO(new Date(event.startDate)),
      endDate: formatISO(new Date(event.endDate)),
      location: event.location || undefined,
      notes: event.notes || undefined,
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
};

// Sync calendar events with the app
export const syncCalendarEvents = async (calendarIds: string[]) => {
  if (Platform.OS === 'web' || !useStore.getState().settings.enableCalendarSync) {
    return;
  }

  try {
    // Get start date (now) and end date (30 days from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    // Collect events from all selected calendars
    let allEvents: CalendarEvent[] = [];
    for (const calendarId of calendarIds) {
      const events = await getCalendarEvents(calendarId, startDate, endDate);
      allEvents = [...allEvents, ...events];
    }

    // Update the store with all events
    useStore.getState().setCalendarEvents(allEvents);

    // Set up notifications for events with locations
    scheduleEventNotifications(allEvents);

    return allEvents;
  } catch (error) {
    console.error('Error syncing calendar events:', error);
    return [];
  }
};

// Add a note to a calendar event
export const addReminderNoteToEvent = async (
  eventId: string,
  reminderNote: string
) => {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    const event = await Calendar.getEventAsync(eventId);
    if (!event) return;

    const updatedNotes = event.notes
      ? `${event.notes}\n\nReminder: ${reminderNote}`
      : `Reminder: ${reminderNote}`;

    await Calendar.updateEventAsync(eventId, {
      notes: updatedNotes,
    });
  } catch (error) {
    console.error('Error adding note to event:', error);
  }
};

// Schedule notifications for events that have locations
const scheduleEventNotifications = (events: CalendarEvent[]) => {
  events
    .filter(event => event.location)
    .forEach(event => {
      const eventTime = new Date(event.startDate);
      const notificationTime = getPreDepartureNotificationTime(eventTime);

      scheduleNotification(
        `Time to leave for: ${event.title}`,
        `Your event at ${event.location} starts soon.`,
        notificationTime,
        { eventId: event.id },
        'high'
      );
    });
};