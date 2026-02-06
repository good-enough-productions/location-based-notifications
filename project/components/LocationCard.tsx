import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Store, Home, CircleUser, Edit, Trash2 } from 'lucide-react-native';
import { Location, LocationCategory } from '../types';
import { useRouter } from 'expo-router';

interface LocationCardProps {
  location: Location;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const LocationCard = ({ location, onEdit, onDelete }: LocationCardProps) => {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/location/${location.id}`);
  };
  
  const getCategoryIcon = (category: LocationCategory) => {
    switch (category) {
      case 'retail':
        return <Store size={16} color="#4A80F0" />;
      case 'personal':
        return <Home size={16} color="#4A80F0" />;
      case 'custom':
      default:
        return <CircleUser size={16} color="#4A80F0" />;
    }
  };
  
  const getCategoryName = (category: LocationCategory) => {
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
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MapPin size={24} color="#4A80F0" />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.address}>{location.address}</Text>
        
        <View style={styles.categoryContainer}>
          {getCategoryIcon(location.category)}
          <Text style={styles.categoryText}>
            {getCategoryName(location.category)}
          </Text>
          {location.isCustom && (
            <View style={styles.customBadge}>
              <Text style={styles.customBadgeText}>Custom</Text>
            </View>
          )}
        </View>
      </View>
      
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <Edit size={18} color="#4A80F0" />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <Trash2 size={18} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECF1FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    color: '#4A80F0',
  },
  customBadge: {
    backgroundColor: '#ECF1FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  customBadgeText: {
    fontSize: 12,
    color: '#4A80F0',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 8,
  },
  actionButton: {
    padding: 4,
  },
});

export default LocationCard;