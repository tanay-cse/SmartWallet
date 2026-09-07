import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabIcon, type TabIconName } from '../components/icons/TabIcon';
import { BudgetScreen } from '../screens/BudgetScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { InvestScreen } from '../screens/InvestScreen';
import { PayScreen } from '../screens/PayScreen';
import { VaultScreen } from '../screens/VaultScreen';
import { Colors } from '../theme/colors';

export type RootTabParamList = {
  Home: undefined;
  Vault: undefined;
  Pay: undefined;
  Invest: undefined;
  Budget: { tab?: 'overview' | 'breakdown' } | undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabIcons: Record<keyof RootTabParamList, TabIconName> = {
  Home: 'home',
  Vault: 'vault',
  Pay: 'pay',
  Invest: 'invest',
  Budget: 'budget',
};

export function RootTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'shift',
        tabBarActiveTintColor: Colors.forestGreen,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: route.name !== 'Pay',
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabel: ({ focused }) => (
          <Text
            style={[
              styles.tabLabel,
              focused ? styles.tabLabelFocused : styles.tabLabelInactive,
            ]}
          >
            {route.name}
          </Text>
        ),
        tabBarIcon: ({ focused }) => {
          if (route.name === 'Pay') {
            return null;
          }
          const iconColor = focused ? Colors.forestGreen : '#94A3B8';
          return (
            <View style={styles.iconContainer}>
              <TabIcon
                name={tabIcons[route.name]}
                color={iconColor}
                focused={focused}
                size={17}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Home');
          },
        })}
      />
      <Tab.Screen
        name="Vault"
        component={VaultScreen}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Vault');
          },
        })}
      />
      <Tab.Screen
        name="Pay"
        component={PayScreen}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Pay');
          },
        })}
        options={{
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={props.onPress ?? undefined}
              onLongPress={props.onLongPress ?? undefined}
              accessibilityRole="button"
              accessibilityState={props.accessibilityState}
              accessibilityLabel="Pay"
              style={styles.payButtonWrapper}
              activeOpacity={0.85}
            >
              <View style={styles.payCircleButton}>
                <TabIcon name="pay" color={Colors.forestGreen} focused={false} size={19} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Invest"
        component={InvestScreen}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Invest');
          },
        })}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Budget', { tab: 'overview' });
          },
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 40,
    elevation: 10,
    height: 54,
    backgroundColor: '#0F172A', // Dark charcoal
    borderRadius: 27,
    borderTopWidth: 0,
    paddingTop: 3,
    paddingBottom: 3,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabBarItem: {
    paddingVertical: 2,
    paddingHorizontal: 0,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 8.5,
    marginTop: 0,
  },
  tabLabelInactive: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: Colors.forestGreen,
    fontWeight: '700',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 18,
  },
  payButtonWrapper: {
    top: -2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  payCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: Colors.forestGreenLight,
  },
});
