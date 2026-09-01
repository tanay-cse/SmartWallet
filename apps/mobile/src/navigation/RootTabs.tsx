import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { BudgetScreen } from '../screens/BudgetScreen';
import { InvestScreen } from '../screens/InvestScreen';
import { PayScreen } from '../screens/PayScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { VaultScreen } from '../screens/VaultScreen';
import { TabIcon, type TabIconName } from '../components/icons/TabIcon';

export type RootTabParamList = {
  Vault: undefined;
  Invest: undefined;
  Pay: undefined;
  Budget: undefined;
  Transactions: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabIcons: Record<keyof RootTabParamList, TabIconName> = {
  Vault: 'card',
  Invest: 'chart',
  Pay: 'pay',
  Budget: 'budget',
  Transactions: 'currency',
};

export function RootTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Vault"
      screenOptions={({ route }) => ({
        animation: 'shift',
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#065F46',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: styles.tabBar,
        tabBarLabel: ({ color, focused }) => (
          <Text style={[styles.tabLabel, focused && styles.tabLabelFocused, { color }]}>
            {route.name}
          </Text>
        ),
        tabBarIcon: ({ color, focused, size }) => {
          const isPay = route.name === 'Pay';

          return (
            <View style={[styles.iconContainer, isPay && styles.payIconContainer, isPay && focused && styles.payIconContainerFocused]}>
              <TabIcon
                name={tabIcons[route.name]}
                color={color}
                focused={focused}
                size={isPay ? size + 2 : size}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Vault" component={VaultScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Invest" component={InvestScreen} />
      <Tab.Screen name="Pay" component={PayScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    paddingTop: 5,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F1F5F9',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabLabelFocused: {
    fontWeight: '700',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  payIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
  },
  payIconContainerFocused: {
    backgroundColor: '#F0FDF4',
  },
});
