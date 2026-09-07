import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootTabs } from './src/navigation/RootTabs';
import { ApproveToPayScreen } from './src/screens/ApproveToPayScreen';
import { BestSipFundsScreen } from './src/screens/BestSipFundsScreen';
import { BikeInsuranceScreen } from './src/screens/BikeInsuranceScreen';
import { BuyGoldScreen } from './src/screens/BuyGoldScreen';
import { BuySilverScreen } from './src/screens/BuySilverScreen';
import { CarInsuranceScreen } from './src/screens/CarInsuranceScreen';
import { CardDetailScreen } from './src/screens/CardDetailScreen';
import { ChotiSipScreen } from './src/screens/ChotiSipScreen';
import { CreditScoreScreen } from './src/screens/CreditScoreScreen';
import { DailyGoldScreen } from './src/screens/DailyGoldScreen';
import { DailySilverScreen } from './src/screens/DailySilverScreen';
import { DailySipScreen } from './src/screens/DailySipScreen';
import { ElectricityBillScreen } from './src/screens/ElectricityBillScreen';
import { FastagRechargeScreen } from './src/screens/FastagRechargeScreen';
import { GoldLoanScreen } from './src/screens/GoldLoanScreen';
import { HealthInsuranceScreen } from './src/screens/HealthInsuranceScreen';
import { HighGrowthFundsScreen } from './src/screens/HighGrowthFundsScreen';
import { LifeInsuranceScreen } from './src/screens/LifeInsuranceScreen';
import { LoanRepaymentScreen } from './src/screens/LoanRepaymentScreen';
import { MobileRechargeScreen } from './src/screens/MobileRechargeScreen';
import { MutualFundsLoanScreen } from './src/screens/MutualFundsLoanScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { PersonalLoanScreen } from './src/screens/PersonalLoanScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SendMoneyScreen } from './src/screens/SendMoneyScreen';
import { TransactionHistoryScreen } from './src/screens/TransactionHistoryScreen';
import { TransferMethodScreen } from './src/screens/TransferMethodScreen';
import { VaultCard } from './src/types/vault';

export type RootStackParamList = {
  MainTabs: undefined;
  TransactionHistory: undefined;
  Profile: undefined;
  Notifications: undefined;
  CardDetail: { card: VaultCard };
  SendMoney: undefined;
  TransferMethod: undefined;
  ApproveToPay: undefined;
  MobileRecharge: undefined;
  FastagRecharge: undefined;
  ElectricityBill: undefined;
  LoanRepayment: undefined;
  PersonalLoan: undefined;
  MutualFundsLoan: undefined;
  GoldLoan: undefined;
  CreditScore: undefined;
  DailyGold: undefined;
  BuyGold: undefined;
  DailySilver: undefined;
  BuySilver: undefined;
  BikeInsurance: undefined;
  CarInsurance: undefined;
  HealthInsurance: undefined;
  LifeInsurance: undefined;
  BestSipFunds: undefined;
  ChotiSip: undefined;
  HighGrowthFunds: undefined;
  DailySip: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="MainTabs" component={RootTabs} />
          <Stack.Screen name="CardDetail" component={CardDetailScreen} />
          <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
          <Stack.Screen name="TransferMethod" component={TransferMethodScreen} />
          <Stack.Screen name="ApproveToPay" component={ApproveToPayScreen} />
          <Stack.Screen name="MobileRecharge" component={MobileRechargeScreen} />
          <Stack.Screen name="FastagRecharge" component={FastagRechargeScreen} />
          <Stack.Screen name="ElectricityBill" component={ElectricityBillScreen} />
          <Stack.Screen name="LoanRepayment" component={LoanRepaymentScreen} />
          <Stack.Screen name="PersonalLoan" component={PersonalLoanScreen} />
          <Stack.Screen name="MutualFundsLoan" component={MutualFundsLoanScreen} />
          <Stack.Screen name="GoldLoan" component={GoldLoanScreen} />
          <Stack.Screen name="CreditScore" component={CreditScoreScreen} />
          <Stack.Screen name="DailyGold" component={DailyGoldScreen} />
          <Stack.Screen name="BuyGold" component={BuyGoldScreen} />
          <Stack.Screen name="DailySilver" component={DailySilverScreen} />
          <Stack.Screen name="BuySilver" component={BuySilverScreen} />
          <Stack.Screen name="BikeInsurance" component={BikeInsuranceScreen} />
          <Stack.Screen name="CarInsurance" component={CarInsuranceScreen} />
          <Stack.Screen name="HealthInsurance" component={HealthInsuranceScreen} />
          <Stack.Screen name="LifeInsurance" component={LifeInsuranceScreen} />
          <Stack.Screen name="BestSipFunds" component={BestSipFundsScreen} />
          <Stack.Screen name="ChotiSip" component={ChotiSipScreen} />
          <Stack.Screen name="HighGrowthFunds" component={HighGrowthFundsScreen} />
          <Stack.Screen name="DailySip" component={DailySipScreen} />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
