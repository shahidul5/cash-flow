import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const IncomeCategoryForm = ({ category = {}, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('cash-outline');
  const { theme } = useTheme();

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setIcon(category.icon || 'cash-outline');
    }
  }, [category]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Please enter a category name');
      return;
    }

    onSubmit({
      name: name.trim(),
      icon,
    });
  };

  // Common icons for income categories
  const commonIcons = [
    'cash-outline',
    'wallet-outline',
    'card-outline',
    'briefcase-outline',
    'gift-outline',
    'business-outline',
    'home-outline',
    'analytics-outline',
    'trending-up-outline',
    'medal-outline',
    'ribbon-outline',
    'heart-outline'
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, {
          color: theme.text,
          borderColor: theme.border,
          backgroundColor: theme.background
        }]}
        placeholder="Category Name"
        placeholderTextColor={theme.text + '80'}
        value={name}
        onChangeText={setName}
      />

      <Text style={[styles.label, { color: theme.text }]}>Select Icon</Text>
      <View style={styles.iconsContainer}>
        {commonIcons.map((iconName) => (
          <TouchableOpacity
            key={iconName}
            style={[
              styles.iconButton,
              {
                backgroundColor: icon === iconName ? theme.primary : theme.background,
                borderColor: theme.border,
              },
            ]}
            onPress={() => setIcon(iconName)}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={icon === iconName ? '#fff' : theme.text}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton, { borderColor: theme.border }]}
          onPress={onCancel}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton, { backgroundColor: theme.primary }]}
          onPress={handleSubmit}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    borderWidth: 1,
  },
  submitButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default IncomeCategoryForm; 