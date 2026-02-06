import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { MapPin, Tag, Bell, Calendar } from 'lucide-react-native';
import { Reminder, Location, LocationGroup, NotificationPriority } from '../types';
import { useStore } from '../store/useStore';
import Slider from './Slider';

interface ReminderFormProps {
  initialValues?: Partial<Reminder>;
  onSubmit: (reminder: Reminder) => void;
  isEditing?: boolean;
}

const ReminderForm = ({
  initialValues,
  onSubmit,
  isEditing = false,
}: ReminderFormProps) => {
  const router = useRouter();
  const locations = useStore((state) => state.locations);
  const locationGroups = useStore((state) => state.locationGroups);
  const defaultRadius = useStore((state) => state.settings.defaultRadius);
  const defaultPriority = useStore((state) => state.settings.defaultNotificationPriority);

  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>(
    initialValues?.locationIds || []
  );
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(
    initialValues?.locationGroupIds || []
  );
  const [radius, setRadius] = useState(initialValues?.radius || defaultRadius);
  const [notificationContent, setNotificationContent] = useState(
    initialValues?.notificationContent || ''
  );
  const [notificationPriority, setNotificationPriority] = useState<NotificationPriority>(
    initialValues?.notificationPriority || defaultPriority
  );
  const [isPersistent, setIsPersistent] = useState(
    initialValues?.isPersistent !== undefined ? initialValues.isPersistent : true
  );
  const [tags, setTags] = useState<string[]>(initialValues?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    // Validate form
    const formErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      formErrors.title = 'Title is required';
    }
    
    if (selectedLocationIds.length === 0 && selectedGroupIds.length === 0) {
      formErrors.locations = 'At least one location or group is required';
    }
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    // Create reminder object
    const reminder: Reminder = {
      id: initialValues?.id || uuidv4(),
      title,
      description,
      locationIds: selectedLocationIds,
      locationGroupIds: selectedGroupIds,
      radius,
      notificationContent,
      notificationPriority,
      isPersistent,
      isActive: initialValues?.isActive !== undefined ? initialValues.isActive : true,
      createdAt: initialValues?.createdAt || Date.now(),
      calendarEventId: initialValues?.calendarEventId,
      tags,
    };
    
    onSubmit(reminder);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const toggleLocation = (locationId: string) => {
    if (selectedLocationIds.includes(locationId)) {
      setSelectedLocationIds(selectedLocationIds.filter((id) => id !== locationId));
    } else {
      setSelectedLocationIds([...selectedLocationIds, locationId]);
    }
  };

  const toggleGroup = (groupId: string) => {
    if (selectedGroupIds.includes(groupId)) {
      setSelectedGroupIds(selectedGroupIds.filter((id) => id !== groupId));
    } else {
      setSelectedGroupIds([...selectedGroupIds, groupId]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter reminder title"
          placeholderTextColor="#aaa"
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <MapPin size={18} color="#4A80F0" />
          <Text style={styles.label}>Locations</Text>
        </View>
        
        {errors.locations && <Text style={styles.errorText}>{errors.locations}</Text>}
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-location')}
        >
          <Text style={styles.addButtonText}>+ Add New Location</Text>
        </TouchableOpacity>

        <Text style={styles.subLabel}>Select Locations:</Text>
        <View style={styles.checkboxGroup}>
          {locations.length === 0 ? (
            <Text style={styles.emptyText}>No locations added yet</Text>
          ) : (
            locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.checkboxRow}
                onPress={() => toggleLocation(location.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedLocationIds.includes(location.id) && styles.checkboxSelected,
                  ]}
                />
                <Text style={styles.checkboxLabel}>{location.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <Text style={styles.subLabel}>Select Location Groups:</Text>
        <View style={styles.checkboxGroup}>
          {locationGroups.length === 0 ? (
            <Text style={styles.emptyText}>No location groups added yet</Text>
          ) : (
            locationGroups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.checkboxRow}
                onPress={() => toggleGroup(group.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    selectedGroupIds.includes(group.id) && styles.checkboxSelected,
                  ]}
                />
                <Text style={styles.checkboxLabel}>{group.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Geofence Radius: {radius}m</Text>
        <Slider
          minimumValue={50}
          maximumValue={500}
          step={10}
          value={radius}
          onValueChange={setRadius}
        />
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Bell size={18} color="#4A80F0" />
          <Text style={styles.label}>Notification Settings</Text>
        </View>

        <Text style={styles.subLabel}>Custom Notification Message (Optional):</Text>
        <TextInput
          style={styles.input}
          value={notificationContent}
          onChangeText={setNotificationContent}
          placeholder="Custom notification message"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.subLabel}>Priority:</Text>
        <View style={styles.priorityButtons}>
          <TouchableOpacity
            style={[
              styles.priorityButton,
              notificationPriority === 'low' && styles.priorityButtonSelected,
              notificationPriority === 'low' && { backgroundColor: '#E0E0E0' },
            ]}
            onPress={() => setNotificationPriority('low')}
          >
            <Text
              style={[
                styles.priorityButtonText,
                notificationPriority === 'low' && styles.priorityButtonTextSelected,
              ]}
            >
              Low
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.priorityButton,
              notificationPriority === 'normal' && styles.priorityButtonSelected,
              notificationPriority === 'normal' && { backgroundColor: '#C8D7FB' },
            ]}
            onPress={() => setNotificationPriority('normal')}
          >
            <Text
              style={[
                styles.priorityButtonText,
                notificationPriority === 'normal' && styles.priorityButtonTextSelected,
              ]}
            >
              Normal
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.priorityButton,
              notificationPriority === 'high' && styles.priorityButtonSelected,
              notificationPriority === 'high' && { backgroundColor: '#FFD2D2' },
            ]}
            onPress={() => setNotificationPriority('high')}
          >
            <Text
              style={[
                styles.priorityButtonText,
                notificationPriority === 'high' && styles.priorityButtonTextSelected,
              ]}
            >
              High
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Persistent Reminder</Text>
          <Switch
            value={isPersistent}
            onValueChange={setIsPersistent}
            trackColor={{ false: '#d1d1d1', true: '#C8D7FB' }}
            thumbColor={isPersistent ? '#4A80F0' : '#f4f3f4'}
          />
        </View>
        <Text style={styles.helperText}>
          {isPersistent
            ? 'Reminder will stay active after triggering'
            : 'Reminder will be deactivated after triggering once'}
        </Text>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Tag size={18} color="#4A80F0" />
          <Text style={styles.label}>Tags</Text>
        </View>

        <View style={styles.tagInputContainer}>
          <TextInput
            style={styles.tagInput}
            value={newTag}
            onChangeText={setNewTag}
            placeholder="Add a tag"
            placeholderTextColor="#aaa"
            onSubmitEditing={handleAddTag}
          />
          <TouchableOpacity style={styles.tagAddButton} onPress={handleAddTag}>
            <Text style={styles.tagAddButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity
                style={styles.tagRemoveButton}
                onPress={() => handleRemoveTag(tag)}
              >
                <Text style={styles.tagRemoveButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Calendar size={18} color="#4A80F0" />
          <Text style={styles.label}>Calendar Integration</Text>
        </View>

        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => router.push('/calendar')}
        >
          <Text style={styles.calendarButtonText}>Link to Calendar Event</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEditing ? 'Update Reminder' : 'Create Reminder'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 8,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#ECF1FE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  addButtonText: {
    color: '#4A80F0',
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
    color: '#555',
  },
  checkboxGroup: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4A80F0',
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#4A80F0',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  priorityButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  priorityButtonSelected: {
    borderWidth: 1,
    borderColor: '#4A80F0',
  },
  priorityButtonText: {
    color: '#333',
  },
  priorityButtonTextSelected: {
    color: '#4A80F0',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  tagAddButton: {
    backgroundColor: '#4A80F0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tagAddButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECF1FE',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#4A80F0',
    marginRight: 4,
  },
  tagRemoveButton: {
    padding: 2,
  },
  tagRemoveButtonText: {
    color: '#4A80F0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarButton: {
    backgroundColor: '#ECF1FE',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  calendarButtonText: {
    color: '#4A80F0',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4A80F0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40, // Extra space at the bottom
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ReminderForm;