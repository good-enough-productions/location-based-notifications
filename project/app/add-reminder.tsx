import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import ReminderForm from '../components/ReminderForm';
import { useStore } from '../store/useStore';
import { Reminder } from '../types';

export default function AddReminderScreen() {
  const router = useRouter();
  const addReminder = useStore((state) => state.addReminder);
  
  const handleSubmit = (reminder: Reminder) => {
    addReminder(reminder);
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#4A80F0" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>New Reminder</Text>
        </View>
      </View>
      
      <ReminderForm onSubmit={handleSubmit} />
    </View>
  );
}

import { Text } from 'react-native';

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
});