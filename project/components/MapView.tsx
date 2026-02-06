import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Location } from '../types';
import { LocationCategory } from '../types';
import { MapPin, Store, Home, CircleUser } from 'lucide-react-native';

interface CustomMapViewProps {
  locations?: Location[];
  selectedLocation?: Location | null;
  radius?: number;
  onLocationSelect?: (latitude: number, longitude: number) => void;
  editable?: boolean;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const CustomMapView = ({
  locations = [],
  selectedLocation,
  radius = 100,
  onLocationSelect,
  editable = false,
  initialRegion,
}: CustomMapViewProps) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState(
    initialRegion || {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  );

  useEffect(() => {
    if (selectedLocation) {
      const newRegion = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 500);
    }
  }, [selectedLocation]);

  const handleMapPress = (event: any) => {
    if (editable && onLocationSelect) {
      const { coordinate } = event.nativeEvent;
      onLocationSelect(coordinate.latitude, coordinate.longitude);
    }
  };

  const getMarkerColor = (category: LocationCategory) => {
    switch (category) {
      case 'retail':
        return '#4CAF50'; // Green
      case 'personal':
        return '#2196F3'; // Blue
      case 'custom':
      default:
        return '#9C27B0'; // Purple
    }
  };

  const getMarkerIcon = (category: LocationCategory) => {
    switch (category) {
      case 'retail':
        return <Store size={24} color="#fff" />;
      case 'personal':
        return <Home size={24} color="#fff" />;
      case 'custom':
      default:
        return <CircleUser size={24} color="#fff" />;
    }
  };

  // If on web platform, return a placeholder
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webPlaceholder}>
          <MapPin size={32} color="#4A80F0" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description={location.address}
            pinColor={getMarkerColor(location.category)}
          />
        ))}

        {selectedLocation && (
          <>
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title={selectedLocation.name}
              description={selectedLocation.address}
              pinColor={getMarkerColor(selectedLocation.category)}
            />
            <Circle
              center={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              radius={radius}
              fillColor="rgba(74, 128, 240, 0.2)"
              strokeColor="rgba(74, 128, 240, 0.5)"
              strokeWidth={2}
            />
          </>
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: Dimensions.get('window').width,
    overflow: 'hidden',
    borderRadius: 12,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomMapView;