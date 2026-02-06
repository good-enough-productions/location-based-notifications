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
import { MapPin, Plus, Search, X } from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import LocationCard from '../../components/LocationCard';
import { LocationCategory } from '../../types';

export default function LocationsScreen() {
  const router = useRouter();
  const locations = useStore((state) => state.locations);
  const deleteLocation = useStore((state) => state.deleteLocation);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LocationCategory | 'all'>('all');
  
  // Filter locations based on search and category
  const filteredLocations = locations.filter((location) => {
    const matchesSearch = 
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || location.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleAddLocation = () => {
    router.push('/add-location');
  };
  
  const handleEditLocation = (id: string) => {
    router.push(`/edit-location/${id}`);
  };
  
  const handleDeleteLocation = (id: string) => {
    deleteLocation(id);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  const renderCategoryFilter = () => {
    const categories: { label: string; value: LocationCategory | 'all' }[] = [
      { label: 'All', value: 'all' },
      { label: 'Retail', value: 'retail' },
      { label: 'Personal', value: 'personal' },
      { label: 'Custom', value: 'custom' },
    ];
    
    return (
      <View style={styles.categoryFilters}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.categoryButton,
              selectedCategory === category.value && styles.categoryButtonSelected,
            ]}
            onPress={() => setSelectedCategory(category.value)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.value && styles.categoryButtonTextSelected,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Locations</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddLocation}>
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
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
      
      {renderCategoryFilter()}
      
      <ScrollView style={styles.scrollView}>
        {filteredLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <MapPin size={40} color="#ccc" />
            <Text style={styles.emptyStateText}>No locations found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery
                ? 'Try a different search term'
                : 'Add a location to get started'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={handleAddLocation}
              >
                <Text style={styles.emptyStateButtonText}>Add Location</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onEdit={() => handleEditLocation(location.id)}
              onDelete={() => handleDeleteLocation(location.id)}
            />
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
  categoryFilters: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f1f1f1',
    marginRight: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#4A80F0',
  },
  categoryButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: 'white',
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