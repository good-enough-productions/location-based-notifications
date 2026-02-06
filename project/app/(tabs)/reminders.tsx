import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Plus, Search, X, Filter } from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import ReminderCard from '../../components/ReminderCard';

export default function RemindersScreen() {
  const router = useRouter();
  const { reminders } = useStore((state) => ({
    reminders: state.reminders,
  }));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  
  // Filter reminders based on search and active status
  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch = 
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reminder.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesActiveStatus = showActiveOnly ? reminder.isActive : true;
    
    return matchesSearch && matchesActiveStatus;
  });
  
  const handleAddReminder = () => {
    router.push('/add-reminder');
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const toggleActiveFilter = () => {
    setShowActiveOnly(!showActiveOnly);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reminders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            showActiveOnly && styles.filterButtonActive
          ]}
          onPress={toggleActiveFilter}
        >
          <Filter size={16} color={showActiveOnly ? '#4A80F0' : '#666'} />
          <Text 
            style={[
              styles.filterButtonText,
              showActiveOnly && styles.filterButtonTextActive
            ]}
          >
            {showActiveOnly ? 'Active Only' : 'All Reminders'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {filteredReminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={40} color="#ccc" />
            <Text style={styles.emptyStateText}>No reminders found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery
                ? 'Try a different search term'
                : 'Add a reminder to get started'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={handleAddReminder}
              >
                <Text style={styles.emptyStateButtonText}>Add Reminder</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredReminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#4A80F0',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A80F0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f1f1f1',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#ECF1FE',
    borderWidth: 1,
    borderColor: '#4A80F0',
  },
  filterButtonText: {
    marginLeft: 4,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#4A80F0',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    marginTop: 16,
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
});