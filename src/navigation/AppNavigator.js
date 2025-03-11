import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import AddBankScreen from '../screens/AddBankScreen';
import AddBudgetScreen from '../screens/AddBudgetScreen';
import AddCashScreen from '../screens/AddCashScreen';
import AddIncomeCategoryScreen from '../screens/AddIncomeCategoryScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import BankDetailScreen from '../screens/BankDetailScreen';
import BanksScreen from '../screens/BanksScreen';
import BudgetDetailScreen from '../screens/BudgetDetailScreen';
import BudgetsScreen from '../screens/BudgetsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import EditBankScreen from '../screens/EditBankScreen';
import EditBudgetScreen from '../screens/EditBudgetScreen';
import EditIncomeCategoryScreen from '../screens/EditIncomeCategoryScreen';
import IncomeCategoriesScreen from '../screens/IncomeCategoriesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import TransferScreen from '../screens/TransferScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom header component that shows user profile
const CustomHeader = ({ navigation }) => {
  const { theme } = useTheme();
  const { userProfile } = useUser();
  const { getUnreadCount } = useNotifications();

  const unreadCount = getUnreadCount();

  return (
    <SafeAreaView
      style={[styles.headerContainer, { backgroundColor: theme.headerBackground }]}
      edges={['top']}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SettingsTab', { screen: 'Profile' })}
          style={styles.leftSection}
        >
          <View style={styles.profileContainer}>
            {userProfile.profileImage ? (
              <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profilePlaceholder, { backgroundColor: theme.primaryDark }]}>
                <Text style={styles.profileInitial}>
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'C'}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.headerTitle, { color: theme.headerText }]}>
            {userProfile.name ? userProfile.name : 'Cash Flow'}
          </Text>
        </TouchableOpacity>

        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SettingsTab', { screen: 'Notifications' })}
            style={styles.notificationButton}
          >
            <MaterialCommunityIcons
              name="bell"
              size={24}
              color={theme.headerText}
            />
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.expense }]}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const HomeStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: { backgroundColor: theme.background }
      })}
    >
      <Stack.Screen name="Home" component={DashboardScreen} />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          title: 'Add Transaction',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="AddCash"
        component={AddCashScreen}
        options={{
          title: 'Add Cash',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{
          title: 'Transaction Details',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const BudgetStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: { backgroundColor: theme.background }
      })}
    >
      <Stack.Screen name="BudgetList" component={BudgetsScreen} />
      <Stack.Screen
        name="AddBudget"
        component={AddBudgetScreen}
        options={{
          title: 'Add Budget',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="BudgetDetail"
        component={BudgetDetailScreen}
        options={{
          title: 'Budget Details',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="EditBudget"
        component={EditBudgetScreen}
        options={{
          title: 'Edit Budget',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const TransactionStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: { backgroundColor: theme.background }
      })}
    >
      <Stack.Screen name="TransactionList" component={TransactionsScreen} />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          title: 'Add Transaction',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{
          title: 'Transaction Details',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: { backgroundColor: theme.background }
      })}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: 'Privacy Policy',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{
          title: 'Terms of Service',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="IncomeCategories"
        component={IncomeCategoriesScreen}
        options={{
          title: 'Income Categories',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="AddIncomeCategory"
        component={AddIncomeCategoryScreen}
        options={{
          title: 'Add Income Category',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="EditIncomeCategory"
        component={EditIncomeCategoryScreen}
        options={{
          title: 'Edit Income Category',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const BankStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: { backgroundColor: theme.background }
      })}
    >
      <Stack.Screen name="BankList" component={BanksScreen} />
      <Stack.Screen
        name="AddBank"
        component={AddBankScreen}
        options={{
          title: 'Add Bank Account',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="BankDetail"
        component={BankDetailScreen}
        options={{
          title: 'Bank Details',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="EditBank"
        component={EditBankScreen}
        options={{
          title: 'Edit Bank Account',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Transfer"
        component={TransferScreen}
        options={{
          title: 'Transfer Money',
          headerShown: true,
          header: undefined,
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { theme, isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let IconComponent = Ionicons;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BudgetTab') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'TransactionTab') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          } else if (route.name === 'BankTab') {
            IconComponent = MaterialCommunityIcons;
            iconName = focused ? 'bank' : 'bank-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: isDarkMode ? '#888888' : '#666666',
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="BudgetTab" component={BudgetStack} options={{ title: 'Budget' }} />
      <Tab.Screen name="TransactionTab" component={TransactionStack} options={{ title: 'Transactions' }} />
      <Tab.Screen name="BankTab" component={BankStack} options={{ title: 'Banks' }} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AppNavigator; 