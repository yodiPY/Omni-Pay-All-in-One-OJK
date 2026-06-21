import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useWallet } from '../context/WalletContext';
import { HelpScreen } from '../screens/HelpScreen';
import { SecurityScreen } from '../screens/SecurityScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isLoggedIn } = useWallet();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="Security"
            component={SecurityScreen}
            options={{
              headerShown: true,
              title: 'Keamanan Akun',
              headerTintColor: '#FFFFFF',
              headerStyle: { backgroundColor: '#07111F' },
              headerTitleStyle: { fontWeight: '900' },
            }}
          />
          <Stack.Screen
            name="Help"
            component={HelpScreen}
            options={{
              headerShown: true,
              title: 'Bantuan',
              headerTintColor: '#FFFFFF',
              headerStyle: { backgroundColor: '#07111F' },
              headerTitleStyle: { fontWeight: '900' },
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: 'Pengaturan',
              headerTintColor: '#FFFFFF',
              headerStyle: { backgroundColor: '#07111F' },
              headerTitleStyle: { fontWeight: '900' },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
