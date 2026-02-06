import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Calendar, Tag, ArrowRight } from 'lucide-react-native';
import { Reminder } from '../types';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from 'date-fns';

interface ReminderCardProps {
  reminder: Reminder;
  showActions?: boolean;
}

export const ReminderCard = ({ reminder, showActions = true }: ReminderCardProps) => {
  const router = useRouter();
  const locations = useStore((state) => state.locations);
  const locationGroups = useStore((state) => state.locationGroups);
  const toggleReminderActive = useStore((state) => state.toggleReminderActive);

  const handleToggleActive = () => {
    toggleReminderActive(reminder.id, !reminder.isActive);
  };

  const handlePress = () => {
    router.push(`/reminder/${reminder.id}`);
  };

  // Get all location names for this reminder
  const getLocationNames = (): string => {
    const locationNames = reminder.locationIds.map(id => {
      const location = locations.find(loc => loc.id === id);
      return location ? location.name : '';
    }).filter(Boolean);

    const groupNames = reminder.locationGroupIds.map(id => {
      const group = locationGroups.find(g => g.id === id);
      return group ? `${group.name} (group)` : '';
    }).filter(Boolean);

    const allNames = [...locationNames, ...groupNames];
    
    if (allNames.length === 0) return 'No locations';
    if (allNames.length === 1) return allNames[0];
    return `${allNames[0]} +${allNames.length - 1} more`;
  };

  // Format created time
  const createdTimeFormatted = formatDistanceToNow(reminder.createdAt, { addSuffix: true });

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !reminder.isActive && styles.inactiveContainer
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{reminder.title}</Text>
        
        {reminder.description ? (
          <Text style={styles.description}>{reminder.description}</Text>
        ) : null}
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MapPin size={16} color="#4A80F0" />
            <Text style={styles.detailText}>{getLocationNames()}</Text>
          </View>
          
          {reminder.calendarEventId ? (
            <View style={styles.detailRow}>
              <Calendar size={16} color="#4A80F0" />
              <Text style={styles.detailText}>Calendar event linked</Text>
            </View>
          ) : null}
          
          {reminder.tags.length > 0 ? (
            <View style={styles.detailRow}>
              <Tag size={16} color="#4A80F0" />
              <Text style={styles.detailText}>
                {reminder.tags.slice(0, 2).join(', ')}
                {reminder.tags.length > 2 ? ` +${reminder.tags.length - 2} more` : ''}
              </Text>
            </View>
          ) : null}
          
          <Text style={styles.timeText}>Created {createdTimeFormatted}</Text>
        </View>
      </View>
      
      {showActions && (
        <View style={styles.actions}>
          <Switch
            value={reminder.isActive}
            onValueChange={handleToggleActive}
            trackColor={{ false: '#d1d1d1', true: '#C8D7FB' }}
            thumbColor={reminder.isActive ? '#4A80F0' : '#f4f3f4'}
          />
          <View style={styles.spacer} />
          <TouchableOpacity onPress={handlePress} style={styles.detailButton}>
            <ArrowRight size={20} color="#4A80F0" />
          </TouchableOpacity>
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
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#4A80F0',
  },
  inactiveContainer: {
    borderLeftColor: '#d1d1d1',
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
  },
  spacer: {
    height: 16,
  },
  detailButton: {
    padding: 4,
  },
});

export default ReminderCard;