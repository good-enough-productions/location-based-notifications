import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { format, addDays, parseISO, isToday, isTomorrow } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import {
  initCalendarService,
  syncCalendarEvents,
  getCalendars,
} from '../../services/calendarService';
import { CalendarEvent } from '../../types';

export default function CalendarScreen() {
  const [calendarPermission, setCalendarPermission] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCalendarIds, setSelectedCalendarIds] = useState<string[]>([]);
  const [availableCalendars, setAvailableCalendars] = useState<any[]>([]);
  
  const { calendarEvents, settings } = useStore((state) => ({
    calendarEvents: state.calendarEvents,
    settings: state.settings,
  }));
  
  const setCalendarEvents = useStore((state) => state.setCalendarEvents);
  
  useEffect(() => {
    initializeCalendar();
  }, []);
  
  const initializeCalendar = async () => {
    if (Platform.OS === 'web') {
      // Show mock data on web
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Team Meeting',
          startDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          endDate: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          location: 'Conference Room A',
          notes: 'Quarterly review meeting',
        },
        {
          id: '2',
          title: 'Dentist Appointment',
          startDate: format(addDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          endDate: format(addDays(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
          location: 'Dental Clinic',
        },
      ];
      setCalendarEvents(mockEvents);
      return;
    }
    
    const hasPermission = await initCalendarService();
    setCalendarPermission(hasPermission);
    
    if (hasPermission) {
      const calendars = await getCalendars();
      setAvailableCalendars(calendars);
      
      // Select first calendar by default
      if (calendars.length > 0) {
        setSelectedCalendarIds([calendars[0].id]);
        await syncEvents([calendars[0].id]);
      }
    }
  };
  
  const syncEvents = async (calendarIds: string[] = selectedCalendarIds) => {
    if (calendarIds.length === 0 || !settings.enableCalendarSync) return;
    
    const events = await syncCalendarEvents(calendarIds);
    // Events are stored in the store through the service
  };
  
  const toggleCalendarSelection = (calendarId: string) => {
    if (selectedCalendarIds.includes(calendarId)) {
      setSelectedCalendarIds(selectedCalendarIds.filter(id => id !== calendarId));
    } else {
      setSelectedCalendarIds([...selectedCalendarIds, calendarId]);
    }
  };
  
  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };
  
  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };
  
  const formatDay = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE, MMM d');
  };
  
  const getEventsForSelectedDate = () => {
    return calendarEvents.filter(event => {
      const eventDate = parseISO(event.startDate);
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };
  
  const selectedEvents = getEventsForSelectedDate();
  
  const renderCalendarSelector = () => {
    if (Platform.OS === 'web' || !calendarPermission) return null;
    
    return (
      <View style={styles.calendarSelector}>
        <Text style={styles.sectionTitle}>Calendars</Text>
        {availableCalendars.map(calendar => (
          <TouchableOpacity
            key={calendar.id}
            style={styles.calendarOption}
            onPress={() => toggleCalendarSelection(calendar.id)}
          >
            <View
              style={[
                styles.colorIndicator,
                { backgroundColor: calendar.color || '#4A80F0' },
              ]}
            />
            <Text style={styles.calendarName}>{calendar.title || 'Calendar'}</Text>
            <View
              style={[
                styles.checkbox,
                selectedCalendarIds.includes(calendar.id) && styles.checkboxSelected,
              ]}
            />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.syncButton}
          onPress={() => syncEvents()}
        >
          <Text style={styles.syncButtonText}>Sync Events</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>
      
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={handlePrevDay} style={styles.dateButton}>
          <ChevronLeft size={24} color="#4A80F0" />
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDay(selectedDate)}</Text>
        <TouchableOpacity onPress={handleNextDay} style={styles.dateButton}>
          <ChevronRight size={24} color="#4A80F0" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {!settings.enableCalendarSync ? (
          <View style={styles.emptyState}>
            <CalendarIcon size={40} color="#ccc" />
            <Text style={styles.emptyStateText}>Calendar Sync Disabled</Text>
            <Text style={styles.emptyStateSubtext}>
              Enable calendar sync in settings to view and manage calendar events.
            </Text>
          </View>
        ) : !calendarPermission && Platform.OS !== 'web' ? (
          <View style={styles.emptyState}>
            <CalendarIcon size={40} color="#ccc" />
            <Text style={styles.emptyStateText}>Calendar Permission Required</Text>
            <Text style={styles.emptyStateSubtext}>
              Please grant calendar permission to sync events.
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={initializeCalendar}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {renderCalendarSelector()}
            
            <View style={styles.eventsSection}>
              <Text style={styles.sectionTitle}>Events</Text>
              
              {selectedEvents.length === 0 ? (
                <View style={styles.noEvents}>
                  <Text style={styles.noEventsText}>No events for this day</Text>
                </View>
              ) : (
                selectedEvents.map(event => (
                  <View key={event.id} style={styles.eventCard}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventTime}>
                        {format(parseISO(event.startDate), 'h:mm a')} - 
                        {format(parseISO(event.endDate), 'h:mm a')}
                      </Text>
                    </View>
                    
                    {event.location && (
                      <View style={styles.eventLocation}>
                        <MapPin size={16} color="#4A80F0" />
                        <Text style={styles.eventLocationText}>{event.location}</Text>
                      </View>
                    )}
                    
                    {event.notes && (
                      <Text style={styles.eventNotes}>{event.notes}</Text>
                    )}
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  calendarSelector: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  calendarOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  calendarName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4A80F0',
  },
  checkboxSelected: {
    backgroundColor: '#4A80F0',
  },
  syncButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  syncButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  eventsSection: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  eventCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#4A80F0',
    paddingLeft: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  eventHeader: {
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  eventLocationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  eventNotes: {
    fontSize: 14,
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 8,
  },
  noEvents: {
    padding: 16,
    alignItems: 'center',
  },
  noEventsText: {
    color: '#999',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    margin: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#4A80F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});