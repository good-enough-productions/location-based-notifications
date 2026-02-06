import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import ReminderForm from '../../components/ReminderForm';
import { useStore } from '../../store/useStore';
import { Reminder } from '../../types';

export default function EditReminderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const reminders = useStore((state) => state.reminders);
  const updateReminder = useStore((state) => state.updateReminder);
  
  const reminder = reminders.find((r) => r.id === id);
  
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
  
  const handleSubmit = (updatedReminder: Reminder) => {
    updateReminder(updatedReminder);
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#4A80F0" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Edit Reminder</Text>
        </View>
      </View>
      
      <ReminderForm 
        initialValues={reminder} 
        onSubmit={handleSubmit}
        isEditing={true} 
      />
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
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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