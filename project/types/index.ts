export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: LocationCategory;
  isCustom: boolean;
}

export type LocationCategory = 'retail' | 'personal' | 'custom';

export interface LocationGroup {
  id: string;
  name: string;
  locations: string[]; // Location IDs
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  locationIds: string[]; // Location IDs
  locationGroupIds: string[]; // Location Group IDs
  radius: number; // in meters
  notificationContent: string;
  notificationPriority: NotificationPriority;
  isPersistent: boolean;
  isActive: boolean;
  createdAt: number; // timestamp
  calendarEventId?: string;
  tags: string[];
}

export type NotificationPriority = 'low' | 'normal' | 'high';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location?: string;
  notes?: string;
}

export interface LocationHistory {
  id: string;
  locationId: string;
  timestamp: number;
  triggeredReminderId?: string;
}

export interface AppSettings {
  batteryOptimization: 'low' | 'balanced' | 'high';
  defaultRadius: number;
  defaultNotificationPriority: NotificationPriority;
  enableCalendarSync: boolean;
  enableLocationHistory: boolean;
  enableBackgroundTracking: boolean;
  privacyMode: boolean;
}