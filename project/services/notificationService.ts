import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Reminder, Location, NotificationPriority } from '../types';

// Configure notifications
export const configureNotifications = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    console.warn('Notifications are not fully supported on web');
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }

    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    return true;
  } catch (error) {
    console.error('Error configuring notifications:', error);
    return false;
  }
};

// Trigger a notification for a reminder at a specific location
export const triggerReminderNotification = async (
  reminder: Reminder,
  location: Location
): Promise<string | null> => {
  if (Platform.OS === 'web') {
    console.warn('Notifications are not fully supported on web');
    return null;
  }

  try {
    const { title, notificationContent, notificationPriority } = reminder;
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: notificationContent || `You've arrived at ${location.name}`,
        data: { 
          reminderId: reminder.id,
          locationId: location.id
        },
        priority: getPriorityLevel(notificationPriority),
      },
      trigger: null, // Immediate notification
    });
    return notificationId;
  } catch (error) {
    console.error('Error scheduling immediate notification:', error);
    return null;
  }
};

// Schedule a notification for a future time (like calendar event reminder)
export const scheduleNotification = async (
  title: string,
  body: string,
  triggerTime: Date,
  data?: Record<string, any>,
  priority: NotificationPriority = 'normal'
): Promise<string | null> => {
  if (Platform.OS === 'web') {
    console.warn('Scheduled notifications are not supported on web');
    return null;
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        priority: getPriorityLevel(priority),
      },
      trigger: {
        date: triggerTime,
      },
    });
    return notificationId;
  } catch (error) {
    console.error('Error scheduling future notification:', error);
    return null;
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async (): Promise<boolean> => {
  if (Platform.OS !== 'web') {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      return true;
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
      return false;
    }
  }
  return true;
};

// Cancel a specific notification by identifier
export const cancelNotification = async (identifier: string): Promise<boolean> => {
  if (Platform.OS !== 'web') {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      return true;
    } catch (error) {
      console.error(`Error cancelling notification ${identifier}:`, error);
      return false;
    }
  }
  return true;
};

// Get a notification trigger time for a calendar event
export const getPreDepartureNotificationTime = (
  eventTime: Date,
  travelTimeMinutes: number = 30,
  reminderMinutes: number = 15
): Date => {
  const notificationTime = new Date(eventTime);
  notificationTime.setMinutes(
    notificationTime.getMinutes() - (travelTimeMinutes + reminderMinutes)
  );
  return notificationTime;
};

// Map our priority levels to Expo's notification priorities
const getPriorityLevel = (
  priority: NotificationPriority
): Notifications.AndroidNotificationPriority => {
  switch (priority) {
    case 'high':
      return Notifications.AndroidNotificationPriority.HIGH;
    case 'low':
      return Notifications.AndroidNotificationPriority.LOW;
    case 'normal':
    default:
      return Notifications.AndroidNotificationPriority.DEFAULT;
  }
};