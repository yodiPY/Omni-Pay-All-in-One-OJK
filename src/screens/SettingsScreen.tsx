import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';
import { colors } from '../theme/colors';

export function SettingsScreen() {
  const { user, darkMode, setDarkMode } = useWallet();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.section}>
        <Text style={styles.label}>Akun</Text>
        <Text style={styles.value}>{user?.name}</Text>
        <Text style={styles.valueMuted}>{user?.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          setDarkMode(!darkMode);
          Alert.alert('Appearance', darkMode ? 'Mode terang diaktifkan.' : 'Mode gelap diaktifkan (UI utama tetap light sesuai desain).');
        }}
      >
        <Text style={styles.rowText}>Toggle Dark Mode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => Alert.alert('Versi', 'OmniPay v1.0.0')}
      >
        <Text style={styles.rowText}>Tentang Aplikasi</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: 20 },
  section: { marginBottom: 24 },
  label: { fontSize: 13, color: colors.textMuted, marginBottom: 8 },
  value: { fontSize: 18, fontWeight: '700', color: colors.text },
  valueMuted: { fontSize: 15, color: colors.textSecondary, marginTop: 4 },
  row: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowText: { fontSize: 16, color: colors.text },
});
