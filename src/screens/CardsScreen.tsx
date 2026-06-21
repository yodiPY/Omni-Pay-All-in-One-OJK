import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const brandLogos = {
  bca: require('../../assets/logos/bca.png'),
  mandiri: require('../../assets/logos/mandiri.png'),
  dana: require('../../assets/logos/dana.png'),
  gopay: require('../../assets/logos/gopay.png'),
  ovo: require('../../assets/logos/ovo.png'),
};

const connectedApps = [
  { name: 'BCA Mobile', type: 'Bank', balance: 'Rp2.000.000', status: 'Aktif', logo: brandLogos.bca, color: '#38BDF8' },
  { name: 'Mandiri Livin', type: 'Bank', balance: 'Rp870.000', status: 'Aktif', logo: brandLogos.mandiri, color: '#FACC15' },
  { name: 'DANA', type: 'E-Wallet', balance: 'Rp320.000', status: 'Aktif', logo: brandLogos.dana, color: '#38BDF8' },
  { name: 'GoPay', type: 'E-Wallet', balance: 'Rp500.000', status: 'Aktif', logo: brandLogos.gopay, color: '#22C55E' },
  { name: 'OVO', type: 'E-Wallet', balance: 'Rp200.000', status: 'Aktif', logo: brandLogos.ovo, color: '#A78BFA' },
];

const suggestions = ['BRI', 'SeaBank', 'LinkAja'];

export function CardsScreen() {
  const disconnect = (name: string) => {
    Alert.alert('Putus Koneksi', `Putuskan koneksi ${name} dari OmniPay?`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Putuskan', style: 'destructive' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Open Finance</Text>
          <Text style={styles.title}>Koneksi</Text>
          <Text style={styles.sub}>Kelola bank dan e-wallet yang tersambung ke OmniPay.</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.78}
          style={styles.addCard}
          onPress={() =>
            Alert.alert('Tambah Koneksi', 'Pilih bank atau e-wallet baru untuk disambungkan ke OmniPay.')
          }
        >
          <View style={styles.addIcon}>
            <Ionicons name="add" size={24} color={colors.ink} />
          </View>
          <View style={styles.addTextWrap}>
            <Text style={styles.addTitle}>Tambah Bank / E-Wallet</Text>
            <Text style={styles.addSub}>BCA, BRI, DANA, OVO, GoPay, dan lainnya</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.55)" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Aplikasi Terhubung</Text>
        {connectedApps.map((app) => (
          <BlurView key={app.name} intensity={52} tint="dark" style={styles.connectionCard}>
            <View style={[styles.appIcon, { backgroundColor: `${app.color}22` }]}>
              <Image source={app.logo} style={styles.brandLogo} resizeMode="contain" />
            </View>
            <View style={styles.appText}>
              <Text style={styles.appName}>{app.name}</Text>
              <Text style={styles.appMeta}>{app.type} • {app.status} • tersinkron sekarang</Text>
              <Text style={styles.appBalance}>{app.balance}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.74} style={styles.disconnectBtn} onPress={() => disconnect(app.name)}>
              <Ionicons name="link-outline" size={16} color={colors.error} />
              <Text style={styles.disconnectText}>Putus</Text>
            </TouchableOpacity>
          </BlurView>
        ))}

        <Text style={styles.sectionTitle}>Rekomendasi</Text>
        <View style={styles.suggestions}>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.76}
              style={styles.suggestion}
              onPress={() => Alert.alert('Tambah Koneksi', `${item} siap disambungkan.`)}
            >
              <Text style={styles.suggestionText}>{item}</Text>
              <Ionicons name="add-circle" size={18} color={colors.accent} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#07111F' },
  scroll: { paddingHorizontal: 20, paddingBottom: 118 },
  header: { marginTop: 8, marginBottom: 20 },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  title: { fontSize: 31, fontWeight: '900', color: colors.white, marginTop: 6 },
  sub: { color: 'rgba(255,255,255,0.58)', fontSize: 14, lineHeight: 20, marginTop: 6 },
  addCard: {
    borderRadius: 25,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    backgroundColor: 'rgba(18,209,142,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(18,209,142,0.32)',
  },
  addIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTextWrap: { flex: 1, minWidth: 0 },
  addTitle: { color: colors.white, fontSize: 15, fontWeight: '900' },
  addSub: { color: 'rgba(255,255,255,0.56)', fontSize: 12, marginTop: 4 },
  sectionTitle: { color: colors.white, fontSize: 19, fontWeight: '900', marginBottom: 12 },
  connectionCard: {
    borderRadius: 24,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  appIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandLogo: { width: 40, height: 40 },
  appText: { flex: 1, minWidth: 0 },
  appName: { color: colors.white, fontSize: 15, fontWeight: '900' },
  appMeta: { color: 'rgba(255,255,255,0.48)', fontSize: 12, marginTop: 3 },
  appBalance: { color: colors.accent, fontSize: 13, fontWeight: '900', marginTop: 6 },
  disconnectBtn: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(239,68,68,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  disconnectText: { color: colors.error, fontSize: 12, fontWeight: '900' },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  suggestion: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionText: { color: colors.white, fontSize: 13, fontWeight: '900' },
});
