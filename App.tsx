import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WalletProvider } from './src/context/WalletContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#07111F',
    card: '#07111F',
    border: 'transparent',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </WalletProvider>
    </SafeAreaProvider>
  );
}
