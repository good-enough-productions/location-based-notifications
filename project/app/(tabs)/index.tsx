import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Plus, RefreshCw, Bell, Calendar } from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import { useLocation } from '../../hooks/useLocation';
import { useReminders } from '../../hooks/useReminders';
import ReminderCard from '../../components/ReminderCard';

export default function HomeScreen() {
  const router = useRouter();
  const { location, errorMsg, updateCurrentLocation } = useLocation();
  const { activeReminders } = useReminders();
  const settings = useStore((state) => state.settings);
  const locationHistory = useStore((state) => state.locationHistory);
  
  const [refreshing, setRefreshing] = useState(false);
  const [recentLocations, setRecentLocations] = useState<any[]>([]);
  
  // Get recent location history
  useEffect(() => {
    if (settings.enableLocationHistory) {
      const recent = locationHistory
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);
      setRecentLocations(recent);
    }
  }, [locationHistory, settings.enableLocationHistory]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await updateCurrentLocation();
    setRefreshing(false);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3760784/pexels-photo-3760784.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
            style={styles.headerBackground}
          />
          <View style={styles.headerContent}>
            <Text style={styles.title}>Location Reminder</Text>
            <Text style={styles.subtitle}>Never forget a task based on where you are</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Reminders</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/add-reminder')}
            >
              <Plus size={16} color="#fff" />
              <Text style={styles.addButtonText}>New</Text>
            </TouchableOpacity>
          </View>
          
          {activeReminders.length === 0 ? (
            <View style={styles.emptyState}>
              <MapPin size={40} color="#ccc" />
              <Text style={styles.emptyStateText}>No active reminders</Text>
              <Text style={styles.emptyStateSubtext}>
                Create a reminder to get started
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => router.push('/add-reminder')}
              >
                <Text style={styles.emptyStateButtonText}>Create Reminder</Text>
              </TouchableOpacity>
            </View>
          ) : (
            activeReminders.slice(0, 3).map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))
          )}
          
          {activeReminders.length > 3 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push('/reminders')}
            >
              <Text style={styles.viewAllButtonText}>
                View All ({activeReminders.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {settings.enableLocationHistory && recentLocations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Locations</Text>
              <TouchableOpacity onPress={onRefresh}>
                <RefreshCw size={18} color="#4A80F0" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.locationHistoryList}>
              {recentLocations.map((historyItem) => {
                const location = useStore
                  .getState()
                  .locations.find((l) => l.id === historyItem.locationId);
                
                if (!location) return null;
                
                return (
                  <TouchableOpacity
                    key={historyItem.id}
                    style={styles.locationHistoryItem}
                    onPress={() => router.push(`/location/${location.id}`)}
                  >
                    <View style={styles.locationIconContainer}>
                      <MapPin size={18} color="#4A80F0" />
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{location.name}</Text>
                      <Text style={styles.locationTimestamp}>
                        {new Date(historyItem.timestamp).toLocaleString()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push('/add-reminder')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#C8D7FB' }]}>
                <Bell size={24} color="#4A80F0" />
              </View>
              <Text style={styles.quickActionText}>New Reminder</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push('/add-location')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#D7F9DB' }]}>
                <MapPin size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickActionText}>Add Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => router.push('/calendar')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFE2C8' }]}>
                <Calendar size={24} color="#FF9800" />
              </View>
              <Text style={styles.quickActionText}>Calendar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 200,
    position: 'relative',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    height: 200,
  },
  headerContent: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4A80F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
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
  emptyStateButton: {
    backgroundColor: '#4A80F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  viewAllButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 8,
  },
  viewAllButtonText: {
    color: '#4A80F0',
    fontWeight: '600',
  },
  locationHistoryList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  locationHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  locationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECF1FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  locationTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickActionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});