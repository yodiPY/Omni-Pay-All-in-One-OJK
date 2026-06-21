import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function Logo({
  size = 'medium',
  inverted = false,
}: {
  size?: 'small' | 'medium' | 'large';
  inverted?: boolean;
}) {
  const iconSize = size === 'small' ? 28 : size === 'large' ? 40 : 32;
  const fontSize = size === 'small' ? 18 : size === 'large' ? 24 : 20;

  return (
    <View style={styles.row}>
      <View style={[styles.icon, { width: iconSize, height: iconSize, borderRadius: iconSize / 4 }]}>
        <Text style={[styles.letter, { fontSize: iconSize * 0.55 }]}>O</Text>
      </View>
      <Text style={[styles.text, inverted && styles.textInverted, { fontSize }]}>OmniPay</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: {
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.44)',
  },
  letter: { color: colors.accent, fontWeight: '900' },
  text: { fontWeight: '800', color: colors.primary },
  textInverted: { color: colors.white },
});
