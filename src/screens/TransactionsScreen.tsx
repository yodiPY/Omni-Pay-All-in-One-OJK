import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Source = 'Semua' | 'BCA' | 'Mandiri' | 'GoPay' | 'OVO' | 'DANA';

const sources: Source[] = ['Semua', 'BCA', 'Mandiri', 'GoPay', 'OVO', 'DANA'];

const aggregatedTransactions = [
  { id: '1', source: 'BCA', merchant: 'Netflix', category: 'Hiburan', date: 'Hari ini', amount: -186000, icon: 'play-circle-outline' as const, color: '#38BDF8' },
  { id: '2', source: 'GoPay', merchant: 'Gojek Ride', category: 'Transportasi', date: 'Hari ini', amount: -27000, icon: 'bicycle-outline' as const, color: '#22C55E' },
  { id: '3', source: 'Mandiri', merchant: 'Gaji Bulanan', category: 'Pemasukan', date: 'Kemarin', amount: 5200000, icon: 'briefcase-outline' as const, color: '#12D18E' },
  { id: '4', source: 'OVO', merchant: 'Kopi Kenangan', category: 'Makanan', date: 'Kemarin', amount: -32000, icon: 'cafe-outline' as const, color: '#A78BFA' },
  { id: '5', source: 'DANA', merchant: 'PLN Prabayar', category: 'Tagihan', date: '18 Jun', amount: -150000, icon: 'flash-outline' as const, color: '#F59E0B' },
  { id: '6', source: 'BCA', merchant: 'Transfer ke Raka', category: 'Transfer', date: '17 Jun', amount: -250000, icon: 'paper-plane-outline' as const, color: '#EF4444' },
];

export function TransactionsScreen() {
  const [search, setSearch] = useState('');
  const [activeSource, setActiveSource] = useState<Source>('Semua');

  const list = useMemo(() => {
    const query = search.trim().toLowerCase();
    return aggregatedTransactions.filter((item) => {
      const sourceMatch = activeSource === 'Semua' || item.source === activeSource;
      const queryMatch =
        !query ||
        item.merchant.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return sourceMatch && queryMatch;
    });
  }, [activeSource, search]);

  const formatRupiah = (value: number) =>
    `${value < 0 ? '-' : '+'}Rp${Math.abs(value).toLocaleString('id-ID')}`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Mutasi Terpusat</Text>
        <Text style={styles.title}>Transaksi</Text>
      </View>

      <BlurView intensity={54} tint="dark" style={styles.searchWrap}>
        <Ionicons name="search" size={20} color="rgba(255,255,255,0.55)" />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari merchant, bank, e-wallet"
          placeholderTextColor="rgba(255,255,255,0.42)"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.55)" />
          </TouchableOpacity>
        )}
      </BlurView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsScroll}
        contentContainerStyle={styles.chips}
      >
        {sources.map((source) => (
          <TouchableOpacity
            key={source}
            style={[styles.chip, activeSource === source && styles.chipActive]}
            onPress={() => setActiveSource(source)}
          >
            <Text style={[styles.chipText, activeSource === source && styles.chipTextActive]}>
              {source}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const positive = item.amount > 0;
          return (
            <BlurView intensity={44} tint="dark" style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: `${item.color}22` }]}>
                <Ionicons name={item.icon} size={21} color={item.color} />
              </View>
              <View style={styles.mid}>
                <Text numberOfLines={1} style={styles.name}>{item.merchant}</Text>
                <Text numberOfLines={1} style={styles.meta}>
                  {item.source} • {item.category} • {item.date}
                </Text>
              </View>
              <Text style={[styles.amount, positive ? styles.positive : styles.negative]}>
                {formatRupiah(item.amount)}
              </Text>
            </BlurView>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Tidak ada transaksi ditemukan.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#07111F', paddingHorizontal: 20 },
  header: { marginTop: 8, marginBottom: 18 },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  title: { fontSize: 31, fontWeight: '900', color: colors.white, marginTop: 6 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.white },
  chipsScroll: { minHeight: 48, maxHeight: 52, marginBottom: 12 },
  chips: { gap: 10, paddingBottom: 6, alignItems: 'center' },
  chip: {
    minWidth: 64,
    height: 36,
    paddingHorizontal: 17,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.58)',
    includeFontPadding: false,
    textAlign: 'center',
  },
  chipTextActive: { color: colors.ink },
  list: { paddingBottom: 118 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mid: { flex: 1, minWidth: 0, paddingRight: 8 },
  name: { color: colors.white, fontSize: 15, fontWeight: '900' },
  meta: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 },
  amount: { maxWidth: 112, textAlign: 'right', fontSize: 13, fontWeight: '900' },
  positive: { color: colors.accent },
  negative: { color: colors.white },
  empty: { textAlign: 'center', color: 'rgba(255,255,255,0.45)', marginTop: 40 },
});
