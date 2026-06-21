import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const faqs = [
  { q: 'Bagaimana cara transfer?', a: 'Tekan Transfer di Beranda, lalu masukkan penerima dan jumlah.' },
  { q: 'Bagaimana top up saldo?', a: 'Tekan Top Up di Beranda dan masukkan jumlah saldo.' },
  { q: 'Lupa password?', a: 'Gunakan Lupa Password di halaman login.' },
];

export function HelpScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {faqs.map((f, i) => (
        <TouchableOpacity
          key={i}
          style={styles.faq}
          onPress={() => Alert.alert(f.q, f.a)}
        >
          <Text style={styles.q}>{f.q}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.contact}
        onPress={() => Linking.openURL('mailto:support@omnipay.app')}
      >
        <Ionicons name="mail-outline" size={22} color={colors.white} />
        <Text style={styles.contactText}>Email Bantuan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: 20 },
  faq: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  q: { fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    marginTop: 32,
  },
  contactText: { color: colors.accent, fontWeight: '700', fontSize: 16 },
});
