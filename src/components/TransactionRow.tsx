import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Transaction } from '../types';
import { colors } from '../theme/colors';

function formatAmount(amount: number) {
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix}$${Math.abs(amount).toFixed(2)}`;
}

function formatDateLabel(date: string, index: number) {
  if (index === 0 && date) return 'Today';
  if (index === 1 && date) return 'Yesterday';
  return date;
}

export function TransactionRow({
  item,
  index = 0,
  showRelativeDate = false,
  dark = false,
}: {
  item: Transaction;
  index?: number;
  showRelativeDate?: boolean;
  dark?: boolean;
}) {
  const isPositive = item.amount >= 0;
  const displayDate = showRelativeDate ? formatDateLabel(item.date, index) : item.date;

  return (
    <View style={[styles.row, dark && styles.rowDark]}>
      <View style={[styles.iconWrap, { backgroundColor: `${item.iconColor}22` }]}>
        <Ionicons
          name={item.icon as keyof typeof Ionicons.glyphMap}
          size={22}
          color={item.iconColor}
        />
      </View>
      <View style={styles.mid}>
        <Text numberOfLines={1} style={[styles.name, dark && styles.nameDark]}>
          {item.name}
        </Text>
        <Text style={[styles.date, dark && styles.dateDark]}>{displayDate}</Text>
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.78}
        style={[styles.amount, isPositive ? styles.positive : styles.negative]}
      >
        {showRelativeDate && !isPositive
          ? `$${Math.abs(item.amount).toFixed(2)}`
          : formatAmount(item.amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowDark: {
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  mid: { flex: 1, minWidth: 0, paddingRight: 12 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text, lineHeight: 20 },
  nameDark: { color: colors.white },
  date: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  dateDark: { color: 'rgba(255,255,255,0.46)' },
  amount: {
    minWidth: 88,
    maxWidth: 132,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'right',
  },
  positive: { color: colors.success },
  negative: { color: colors.error },
});
