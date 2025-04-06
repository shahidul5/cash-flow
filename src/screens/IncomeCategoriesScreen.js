import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';

const IncomeCategoriesScreen = ({ navigation }) => {
  const { incomeCategories, deleteIncomeCategory, isLoading } = useFinance();
  const { theme, isDarkMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleDeleteCategory = (category) => {
    // Don't allow deleting default categories
    if (category.isDefault) {
      Alert.alert(
        'Cannot Delete',
        'Default categories cannot be deleted.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete the "${category.name}" category?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteIncomeCategory(category.id);
            if (!success) {
              Alert.alert(
                'Cannot Delete',
                'This category is used in transactions and cannot be deleted.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const handleEditCategory = (category) => {
    // Don't allow editing default categories
    if (category.isDefault) {
      Alert.alert(
        'Cannot Edit',
        'Default categories cannot be edited.',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('EditIncomeCategory', { category });
  };

  const renderCategoryItem = ({ item }) => (
    <View style={[styles.categoryItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.categoryInfo}>
        <View style={[styles.iconContainer, { backgroundColor: item.color || theme.primary }]}>
          <MaterialCommunityIcons name={item.icon || 'cash'} size={24} color={theme.white} />
        </View>
        <Text style={[styles.categoryName, { color: theme.text }]}>{item.name}</Text>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.info }]}
          onPress={() => handleEditCategory(item)}
          disabled={item.isDefault}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={item.isDefault ? `${theme.white}80` : theme.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.error }]}
          onPress={() => handleDeleteCategory(item)}
          disabled={item.isDefault}
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={item.isDefault ? `${theme.white}80` : theme.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={incomeCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No income categories found
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddIncomeCategory')}
      >
        <MaterialCommunityIcons name="plus" size={24} color={theme.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  defaultBadge: {
    backgroundColor: theme.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultBadgeText: {
    color: theme.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default IncomeCategoriesScreen; 