// Type declarations for Expo modules

declare module 'expo-location' {
  export enum Accuracy {
    Lowest = 1,
    Low = 2,
    Balanced = 3,
    High = 4,
    Highest = 5,
    BestForNavigation = 6
  }
  
  export interface LocationObject {
    coords: {
      latitude: number;
      longitude: number;
      altitude: number | null;
      accuracy: number;
      altitudeAccuracy: number | null;
      heading: number | null;
      speed: number | null;
    };
    timestamp: number;
  }
  
  export interface PermissionResponse {
    status: 'granted' | 'denied' | 'undetermined';
    granted?: boolean;
    canAskAgain?: boolean;
  }
  
  export function requestForegroundPermissionsAsync(): Promise<PermissionResponse>;
  export function requestBackgroundPermissionsAsync(): Promise<PermissionResponse>;
  export function getCurrentPositionAsync(options?: { accuracy?: Accuracy }): Promise<LocationObject>;
  export function startLocationUpdatesAsync(taskName: string, options?: any): Promise<void>;
  export function stopLocationUpdatesAsync(taskName: string): Promise<void>;
  export function hasStartedLocationUpdatesAsync(taskName: string): Promise<boolean>;
}

declare module 'expo-task-manager' {
  export interface TaskManagerTask {
    data: any;
    error: Error | null;
  }
  
  export function defineTask(taskName: string, callback: (body: TaskManagerTask) => void): void;
  export function isTaskDefined(taskName: string): boolean;
  export function unregisterAllTasksAsync(): Promise<void>;
}

declare module 'expo-notifications' {
  export enum AndroidNotificationPriority {
    MIN = 1,
    LOW = 2,
    DEFAULT = 3,
    HIGH = 4,
    MAX = 5
  }
  
  export interface NotificationPermissionsStatus {
    status: 'granted' | 'denied' | 'undetermined';
    granted?: boolean;
    canAskAgain?: boolean;
  }
  
  export function getPermissionsAsync(): Promise<NotificationPermissionsStatus>;
  export function requestPermissionsAsync(): Promise<NotificationPermissionsStatus>;
  export function setNotificationHandler(handler: { handleNotification: () => Promise<any> }): void;
  export function scheduleNotificationAsync(options: { content: any, trigger: any }): Promise<string>;
  export function cancelAllScheduledNotificationsAsync(): Promise<void>;
  export function cancelScheduledNotificationAsync(identifier: string): Promise<void>;
}

declare module 'expo-calendar' {
  export enum EntityTypes {
    EVENT = 'event'
  }
  
  export function requestCalendarPermissionsAsync(): Promise<{ status: 'granted' | 'denied' | 'undetermined' }>;
  export function getCalendarsAsync(entityType: string): Promise<any[]>;
  export function getEventsAsync(calendarIds: string[], startDate: Date, endDate: Date): Promise<any[]>;
  export function getEventAsync(eventId: string): Promise<any>;
  export function updateEventAsync(eventId: string, details: any): Promise<any>;
}

declare module 'react-native' {
  export const Platform: {
    OS: 'ios' | 'android' | 'web';
    select: <T extends Record<string, any>>(obj: T) => any;
  };
}