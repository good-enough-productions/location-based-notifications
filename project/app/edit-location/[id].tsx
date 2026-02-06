import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MapPin, Store, Home, CircleUser } from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import { Location, LocationCategory } from '../../types';
import MapView from '../../components/MapView';

export default function EditLocationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const locations = useStore((state) => state.locations);
  const updateLocation = useStore((state) => state.updateLocation);
  
  const location = locations.find((l) => l.id === id);
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<LocationCategory>('personal');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load location data
  useEffect(() => {
    if (location) {
      setName(location.name);
      setAddress(location.address);
      setCategory(location.category);
      setLatitude(location.latitude);
      setLongitude(location.longitude);
    }
  }, [location]);
  
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
  
  const handleMapLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };
  
  const handleSubmit = () => {
    // Validate form
    const formErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      formErrors.name = 'Name is required';
    }
    
    if (!address.trim()) {
      formErrors.address = 'Address is required';
    }
    
    if (latitude === null || longitude === null) {
      formErrors.location = 'Location coordinates are required';
    }
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    // Create updated location object
    const updatedLocation: Location = {
      ...location,
      name: name.trim(),
      address: address.trim(),
      latitude: latitude!,
      longitude: longitude!,
      category,
    };
    
    // Update location
    updateLocation(updatedLocation);
    
    // Navigate back
    router.back();
  };
  
  // Render category selection
  const renderCategoryOptions = () => {
    const categories: { value: LocationCategory; label: string; Icon: any }[] = [
      { value: 'retail', label: 'Retail', Icon: Store },
      { value: 'personal', label: 'Personal', Icon: Home },
      { value: 'custom', label: 'Custom', Icon: CircleUser },
    ];
    
    return (
      <View style={styles.categoryOptions}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.value}
            style={[
              styles.categoryOption,
              category === cat.value && styles.categoryOptionSelected,
            ]}
            onPress={() => setCategory(cat.value)}
          >
            <cat.Icon
              size={24}
              color={category === cat.value ? '#4A80F0' : '#999'}
            />
            <Text
              style={[
                styles.categoryOptionText,
                category === cat.value && styles.categoryOptionTextSelected,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const selectedLocation = latitude && longitude ? {
    ...location,
    latitude,
    longitude,
  } : null;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#4A80F0" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Edit Location</Text>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter location name"
            placeholderTextColor="#aaa"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
            placeholderTextColor="#aaa"
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          {renderCategoryOptions()}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          
          <View style={styles.mapContainer}>
            <MapView
              selectedLocation={selectedLocation}
              editable={true}
              onLocationSelect={handleMapLocationSelect}
            />
          </View>
          
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          
          {latitude !== null && longitude !== null && (
            <Text style={styles.coordinatesText}>
              Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
            </Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update Location</Text>
        </TouchableOpacity>
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
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 8,
    fontSize: 14,
  },
  categoryOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  categoryOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  categoryOptionSelected: {
    borderColor: '#4A80F0',
    backgroundColor: '#ECF1FE',
  },
  categoryOptionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  categoryOptionTextSelected: {
    color: '#4A80F0',
    fontWeight: '600',
  },
  mapContainer: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 300,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#4A80F0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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