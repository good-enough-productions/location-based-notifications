import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  Settings as SettingsIcon,
  Battery,
  Bell,
  MapPin,
  Calendar,
  Lock,
  Info,
  Trash2,
  Shield,
} from 'lucide-react-native';
import { useStore } from '../../store/useStore';
import { useLocation } from '../../hooks/useLocation';
import Slider from '../../components/Slider';
import { stopLocationTracking, startLocationTracking } from '../../services/locationService';
import { cancelAllNotifications } from '../../services/notificationService';

export default function SettingsScreen() {
  const { settings, updateSettings, clearLocationHistory } = useStore(state => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
    clearLocationHistory: state.clearLocationHistory,
  }));
  
  const { isTracking, toggleTracking } = useLocation();
  
  // Handle battery optimization level change
  const handleBatteryOptimizationChange = async (level: 'low' | 'balanced' | 'high') => {
    // Restart location tracking with new settings
    if (isTracking) {
      await stopLocationTracking();
      updateSettings({ batteryOptimization: level });
      await startLocationTracking();
    } else {
      updateSettings({ batteryOptimization: level });
    }
  };
  
  // Handle radius change
  const handleDefaultRadiusChange = (value: number) => {
    updateSettings({ defaultRadius: value });
  };
  
  // Handle notification priority change
  const handleDefaultPriorityChange = (priority: 'low' | 'normal' | 'high') => {
    updateSettings({ defaultNotificationPriority: priority });
  };
  
  // Toggle settings
  const toggleSetting = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
  };
  
  // Clear location history
  const handleClearLocationHistory = () => {
    if (Platform.OS === 'web') {
      clearLocationHistory();
      return;
    }
    
    Alert.alert(
      'Clear Location History',
      'Are you sure you want to clear your location history? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearLocationHistory(),
        },
      ]
    );
  };
  
  // Clear all notifications
  const handleClearNotifications = () => {
    if (Platform.OS === 'web') {
      return;
    }
    
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to cancel all scheduled notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => cancelAllNotifications(),
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Battery size={20} color="#4A80F0" />
            <Text style={styles.sectionTitle}>Battery Optimization</Text>
          </View>
          
          <Text style={styles.sectionDescription}>
            Control how frequently your location is updated. Higher accuracy uses more battery.
          </Text>
          
          <View style={styles.batteryOptions}>
            <TouchableOpacity
              style={[
                styles.batteryOption,
                settings.batteryOptimization === 'low' && styles.batteryOptionSelected,
              ]}
              onPress={() => handleBatteryOptimizationChange('low')}
            >
              <Text
                style={[
                  styles.batteryOptionText,
                  settings.batteryOptimization === 'low' && styles.batteryOptionTextSelected,
                ]}
              >
                Low
              </Text>
              <Text style={styles.batteryOptionDescription}>
                Save battery, less frequent updates
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.batteryOption,
                settings.batteryOptimization === 'balanced' && styles.batteryOptionSelected,
              ]}
              onPress={() => handleBatteryOptimizationChange('balanced')}
            >
              <Text
                style={[
                  styles.batteryOptionText,
                  settings.batteryOptimization === 'balanced' && styles.batteryOptionTextSelected,
                ]}
              >
                Balanced
              </Text>
              <Text style={styles.batteryOptionDescription}>
                Recommended for most users
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.batteryOption,
                settings.batteryOptimization === 'high' && styles.batteryOptionSelected,
              ]}
              onPress={() => handleBatteryOptimizationChange('high')}
            >
              <Text
                style={[
                  styles.batteryOptionText,
                  settings.batteryOptimization === 'high' && styles.batteryOptionTextSelected,
                ]}
              >
                High
              </Text>
              <Text style={styles.batteryOptionDescription}>
                More frequent updates, higher battery usage
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#4A80F0" />
            <Text style={styles.sectionTitle}>Notification Settings</Text>
          </View>
          
          <Text style={styles.settingLabel}>Default Notification Priority</Text>
          <View style={styles.priorityOptions}>
            <TouchableOpacity
              style={[
                styles.priorityOption,
                settings.defaultNotificationPriority === 'low' && styles.priorityOptionSelected,
                settings.defaultNotificationPriority === 'low' && { backgroundColor: '#E0E0E0' },
              ]}
              onPress={() => handleDefaultPriorityChange('low')}
            >
              <Text
                style={[
                  styles.priorityOptionText,
                  settings.defaultNotificationPriority === 'low' && styles.priorityOptionTextSelected,
                ]}
              >
                Low
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.priorityOption,
                settings.defaultNotificationPriority === 'normal' && styles.priorityOptionSelected,
                settings.defaultNotificationPriority === 'normal' && { backgroundColor: '#C8D7FB' },
              ]}
              onPress={() => handleDefaultPriorityChange('normal')}
            >
              <Text
                style={[
                  styles.priorityOptionText,
                  settings.defaultNotificationPriority === 'normal' && styles.priorityOptionTextSelected,
                ]}
              >
                Normal
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.priorityOption,
                settings.defaultNotificationPriority === 'high' && styles.priorityOptionSelected,
                settings.defaultNotificationPriority === 'high' && { backgroundColor: '#FFD2D2' },
              ]}
              onPress={() => handleDefaultPriorityChange('high')}
            >
              <Text
                style={[
                  styles.priorityOptionText,
                  settings.defaultNotificationPriority === 'high' && styles.priorityOptionTextSelected,
                ]}
              >
                High
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearNotifications}
          >
            <Trash2 size={16} color="#FF6B6B" />
            <Text style={[styles.clearButtonText, { color: '#FF6B6B' }]}>
              Clear All Notifications
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#4A80F0" />
            <Text style={styles.sectionTitle}>Location Settings</Text>
          </View>
          
          <Text style={styles.settingLabel}>Default Geofence Radius: {settings.defaultRadius}m</Text>
          <Slider
            minimumValue={50}
            maximumValue={500}
            step={10}
            value={settings.defaultRadius}
            onValueChange={handleDefaultRadiusChange}
          />
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Background Location Tracking</Text>
              <Text style={styles.toggleDescription}>
                Track your location in the background to trigger reminders
              </Text>
            </View>
            <Switch
              value={settings.enableBackgroundTracking}
              onValueChange={(value) => toggleSetting('enableBackgroundTracking', value)}
              trackColor={{ false: '#d1d1d1', true: '#C8D7FB' }}
              thumbColor={settings.enableBackgroundTracking ? '#4A80F0' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Location History</Text>
              <Text style={styles.toggleDescription}>
                Keep a record of locations that triggered reminders
              </Text>
            </View>
            <Switch
              value={settings.enableLocationHistory}
              onValueChange={(value) => toggleSetting('enableLocationHistory', value)}
              trackColor={{ false: '#d1d1d1', true: '#C8D7FB' }}
              thumbColor={settings.enableLocationHistory ? '#4A80F0' : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearLocationHistory}
          >
            <Trash2 size={16} color="#FF6B6B" />
            <Text style={[styles.clearButtonText, { color: '#FF6B6B' }]}>
              Clear Location History
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#4A80F0" />
            <Text style={styles.sectionTitle}>Calendar Settings</Text>
          </View>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Calendar Sync</Text>
              <Text style={styles.toggleDescription}>
                Sync with your calendar to create reminders based on events
              </Text>
            </View>
            <Switch
              value={settings.enableCalendarSync}
              onValueChange={(value) => toggleSetting('enableCalendarSync', value)}
              trackColor={{ false: '#d1d1d1', true: '#C8D7FB' }}
              thumbColor={settings.enableCalendarSync ? '#4A80F0' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#4A80F0" />
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
          </View>
          
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Privacy Mode</Text>
              <Text style={styles.toggleDescription}>
                Store all data locally and minimize data collection
              </Text>
            </View>
            <Switch
              value={settings.privacyMode}
              onValueChange={(value) => toggleSetting('privacyMode', value)}
              trackColor={{ false: '#d1d1d1', true: '#C8D7FB' }}
              thumbColor={settings.privacyMode ? '#4A80F0' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color="#4A80F0" />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          
          <Text style={styles.aboutText}>
            Location Reminder v1.0.0
          </Text>
          <Text style={styles.copyright}>
            © 2025 All Rights Reserved
          </Text>
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
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  batteryOptions: {
    flexDirection: 'column',
    gap: 12,
  },
  batteryOption: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
  },
  batteryOptionSelected: {
    borderColor: '#4A80F0',
    backgroundColor: '#ECF1FE',
  },
  batteryOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  batteryOptionTextSelected: {
    color: '#4A80F0',
  },
  batteryOptionDescription: {
    fontSize: 12,
    color: '#666',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priorityOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  priorityOptionSelected: {
    borderWidth: 1,
    borderColor: '#4A80F0',
  },
  priorityOptionText: {
    color: '#333',
    fontWeight: '500',
  },
  priorityOptionTextSelected: {
    color: '#4A80F0',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 12,
    color: '#666',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFE2E2',
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
    gap: 8,
  },
  clearButtonText: {
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});