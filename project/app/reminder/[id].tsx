import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Edit, Trash2, MapPin, Tag } from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import { useReminders } from '../../hooks/useReminders';
import MapView from '../../components/MapView';

export default function ReminderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { getLocationsForReminder } = useReminders();
  const reminder = useStore((state) => state.reminders.find((r) => r.id === id));
  const deleteReminder = useStore((state) => state.deleteReminder);
  const toggleReminderActive = useStore((state) => state.toggleReminderActive);
  
  if (!reminder) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#4A80F0" />
          </TouchableOpacity>
          <Text style={styles.title}>Reminder Not Found</Text>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>The reminder could not be found.</Text>
          <TouchableOpacity
            style={styles.notFoundButton}
            onPress={() => router.back()}
          >
            <Text style={styles.notFoundButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const reminderLocations = getLocationsForReminder(reminder);
  
  const handleEdit = () => {
    router.push(`/edit-reminder/${reminder.id}`);
  };
  
  const handleDelete = () => {
    if (Platform.OS === 'web') {
      deleteReminder(reminder.id);
      router.back();
      return;
    }
    
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteReminder(reminder.id);
            router.back();
          },
        },
      ]
    );
  };
  
  const toggleActive = () => {
    toggleReminderActive(reminder.id, !reminder.isActive);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#4A80F0" />
        </TouchableOpacity>
        <Text style={styles.title}>Reminder Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Edit size={20} color="#4A80F0" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.reminderTitle}>{reminder.title}</Text>
            <View
              style={[
                styles.statusBadge,
                reminder.isActive ? styles.activeBadge : styles.inactiveBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  reminder.isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {reminder.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          
          {reminder.description ? (
            <Text style={styles.description}>{reminder.description}</Text>
          ) : null}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Trigger Type:</Text>
            <Text style={styles.detailValue}>
              {reminder.isPersistent ? 'Persistent' : 'One-time'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Geofence Radius:</Text>
            <Text style={styles.detailValue}>{reminder.radius} meters</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Notification Priority:</Text>
            <View
              style={[
                styles.priorityBadge,
                reminder.notificationPriority === 'low' && styles.lowPriorityBadge,
                reminder.notificationPriority === 'normal' && styles.normalPriorityBadge,
                reminder.notificationPriority === 'high' && styles.highPriorityBadge,
              ]}
            >
              <Text style={styles.priorityText}>
                {reminder.notificationPriority.charAt(0).toUpperCase() +
                  reminder.notificationPriority.slice(1)}
              </Text>
            </View>
          </View>
          
          {reminder.notificationContent ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Notification Message:</Text>
              <Text style={styles.detailValue}>{reminder.notificationContent}</Text>
            </View>
          ) : null}
          
          {reminder.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <View style={styles.tagsHeader}>
                <Tag size={16} color="#4A80F0" />
                <Text style={styles.tagsTitle}>Tags</Text>
              </View>
              <View style={styles.tagsList}>
                {reminder.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                reminder.isActive ? styles.deactivateButton : styles.activateButton,
              ]}
              onPress={toggleActive}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  reminder.isActive ? styles.deactivateButtonText : styles.activateButtonText,
                ]}
              >
                {reminder.isActive ? 'Deactivate' : 'Activate'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Trash2 size={16} color="#FF6B6B" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.locationsSection}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#4A80F0" />
            <Text style={styles.sectionTitle}>Locations</Text>
          </View>
          
          {reminderLocations.length === 0 ? (
            <Text style={styles.noLocationsText}>No locations specified</Text>
          ) : (
            <>
              <View style={styles.mapView}>
                <MapView
                  locations={reminderLocations}
                  selectedLocation={reminderLocations[0]}
                  radius={reminder.radius}
                />
              </View>
              
              <View style={styles.locationsList}>
                {reminderLocations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    style={styles.locationItem}
                    onPress={() => router.push(`/location/${location.id}`)}
                  >
                    <View style={styles.locationIconContainer}>
                      <MapPin size={18} color="#4A80F0" />
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{location.name}</Text>
                      <Text style={styles.locationAddress}>{location.address}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: '#E6F7ED',
  },
  inactiveBadge: {
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#2E7D32',
  },
  inactiveText: {
    color: '#757575',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
    width: 140,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lowPriorityBadge: {
    backgroundColor: '#E0E0E0',
  },
  normalPriorityBadge: {
    backgroundColor: '#C8D7FB',
  },
  highPriorityBadge: {
    backgroundColor: '#FFD2D2',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tagsContainer: {
    marginVertical: 16,
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tagsTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#ECF1FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#4A80F0',
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activateButton: {
    backgroundColor: '#E6F7ED',
    marginRight: 8,
  },
  deactivateButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFE2E2',
  },
  actionButtonText: {
    fontWeight: '600',
  },
  activateButtonText: {
    color: '#2E7D32',
  },
  deactivateButtonText: {
    color: '#757575',
  },
  deleteButtonText: {
    color: '#FF6B6B',
    marginLeft: 4,
  },
  locationsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  noLocationsText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  mapView: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  locationsList: {
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    paddingTop: 16,
  },
  locationItem: {
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
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  notFoundButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  notFoundButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});