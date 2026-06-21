import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../types';
import { colors } from '../theme/colors';

export function CardItem({ card, fullWidth }: { card: Card; fullWidth?: boolean }) {
  const isDark = card.variant === 'dark';

  return (
    <View style={[styles.card, fullWidth && styles.fullWidth, isDark ? styles.dark : styles.gray]}>
      <View style={styles.topRow}>
        <Text style={styles.brand}>{card.brand === 'visa' ? 'VISA' : 'MC'}</Text>
        <View style={styles.chip}>
          <View style={[styles.chipCircle, { backgroundColor: colors.accent }]} />
          <View style={[styles.chipCircle, styles.chipOverlap, { backgroundColor: '#E8D5A3' }]} />
        </View>
      </View>
      <Text style={styles.number}>**** {card.lastFour}</Text>
      <View style={styles.bottom}>
        <Text numberOfLines={1} style={styles.holder}>
          {card.holder}
        </Text>
        <Text style={styles.expiry}>{card.expiry}</Text>
      </View>
      {card.brand === 'mastercard' && (
        <View style={styles.mcLogo}>
          <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
          <View style={[styles.mcCircle, styles.mcOverlap, { backgroundColor: '#F79E1B' }]} />
        </View>
      )}
      {card.brand === 'visa' && (
        <Ionicons name="card" size={28} color={colors.accent} style={styles.visaIcon} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullWidth: { width: '100%', marginRight: 0 },
  card: {
    width: 280,
    height: 170,
    borderRadius: 24,
    padding: 20,
    marginRight: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.34)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 9,
  },
  dark: { backgroundColor: colors.ink },
  gray: { backgroundColor: '#71839D' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: colors.white, fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  chip: { flexDirection: 'row' },
  chipCircle: { width: 22, height: 22, borderRadius: 11 },
  chipOverlap: { marginLeft: -8, opacity: 0.85 },
  number: { color: colors.white, fontSize: 18, letterSpacing: 2, marginTop: 8, fontWeight: '700' },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  holder: { flex: 1, color: colors.white, fontSize: 13, lineHeight: 18, opacity: 0.9 },
  expiry: { color: colors.white, fontSize: 13, lineHeight: 18, opacity: 0.9 },
  mcLogo: { position: 'absolute', bottom: 20, right: 20, flexDirection: 'row' },
  mcCircle: { width: 28, height: 28, borderRadius: 14 },
  mcOverlap: { marginLeft: -12, opacity: 0.9 },
  visaIcon: { position: 'absolute', bottom: 18, right: 18 },
});
