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
import { ChevronLeft, Edit, Trash2, MapPin, Bell } from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import { useReminders } from '../../hooks/useReminders';
import MapView from '../../components/MapView';
import ReminderCard from '../../components/ReminderCard';

export default function LocationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { filterRemindersByLocation } = useReminders();
  const location = useStore((state) => state.locations.find((l) => l.id === id));
  const deleteLocation = useStore((state) => state.deleteLocation);
  
  if (!location) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#4A80F0" />
          </TouchableOpacity>
          <Text style={styles.title}>Location Not Found</Text>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>The location could not be found.</Text>
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
  
  const relatedReminders = filterRemindersByLocation(location.id);
  
  const handleEdit = () => {
    router.push(`/edit-location/${location.id}`);
  };
  
  const handleDelete = () => {
    if (relatedReminders.length > 0) {
      if (Platform.OS === 'web') {
        alert(`This location is used by ${relatedReminders.length} reminders. Delete the reminders first.`);
        return;
      }
      
      Alert.alert(
        'Cannot Delete Location',
        `This location is used by ${relatedReminders.length} reminders. Delete the reminders first.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (Platform.OS === 'web') {
      deleteLocation(location.id);
      router.back();
      return;
    }
    
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteLocation(location.id);
            router.back();
          },
        },
      ]
    );
  };
  
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'retail':
        return 'Retail';
      case 'personal':
        return 'Personal';
      case 'custom':
      default:
        return 'Custom';
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#4A80F0" />
        </TouchableOpacity>
        <Text style={styles.title}>Location Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Edit size={20} color="#4A80F0" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.mapView}>
          <MapView
            selectedLocation={location}
            radius={100}
          />
        </View>
        
        <View style={styles.card}>
          <Text style={styles.locationName}>{location.name}</Text>
          <Text style={styles.locationAddress}>{location.address}</Text>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {getCategoryName(location.category)}
            </Text>
            {location.isCustom && (
              <Text style={styles.customIndicator}>Custom</Text>
            )}
          </View>
          
          <View style={styles.coordinates}>
            <Text style={styles.coordinatesText}>
              Latitude: {location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              Longitude: {location.longitude.toFixed(6)}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Trash2 size={16} color="#FF6B6B" />
            <Text style={styles.deleteButtonText}>Delete Location</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.remindersSection}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#4A80F0" />
            <Text style={styles.sectionTitle}>Related Reminders</Text>
          </View>
          
          {relatedReminders.length === 0 ? (
            <View style={styles.emptyReminders}>
              <Text style={styles.emptyRemindersText}>
                No reminders use this location
              </Text>
              <TouchableOpacity
                style={styles.addReminderButton}
                onPress={() => router.push('/add-reminder')}
              >
                <Text style={styles.addReminderButtonText}>Create Reminder</Text>
              </TouchableOpacity>
            </View>
          ) : (
            relatedReminders.map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))
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
  },
  mapView: {
    height: 300,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  locationName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A80F0',
    backgroundColor: '#ECF1FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  customIndicator: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    backgroundColor: '#FFF5E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  coordinates: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFE2E2',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteButtonText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  remindersSection: {
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
  emptyReminders: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyRemindersText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  addReminderButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addReminderButtonText: {
    color: 'white',
    fontWeight: '600',
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