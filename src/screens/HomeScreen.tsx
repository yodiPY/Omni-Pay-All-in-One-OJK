import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionModal, ActionType } from '../components/ActionModal';
import { CardItem } from '../components/CardItem';
import { Logo } from '../components/Logo';
import { TransactionRow } from '../components/TransactionRow';
import { useWallet } from '../context/WalletContext';
import { colors } from '../theme/colors';

const brandLogos = {
  bca: require('../../assets/logos/bca.png'),
  mandiri: require('../../assets/logos/mandiri.png'),
  gopay: require('../../assets/logos/gopay.png'),
  ovo: require('../../assets/logos/ovo.png'),
};

const linkedAccounts = [
  { name: 'BCA Prioritas', type: 'Bank', balance: 2000000, logo: brandLogos.bca, color: '#38BDF8' },
  { name: 'Mandiri Tabungan', type: 'Bank', balance: 870000, logo: brandLogos.mandiri, color: '#FACC15' },
  { name: 'GoPay', type: 'E-Wallet', balance: 500000, logo: brandLogos.gopay, color: '#22C55E' },
  { name: 'OVO', type: 'E-Wallet', balance: 200000, logo: brandLogos.ovo, color: '#A78BFA' },
];

const quickActions: { key: ActionType; label: string; icon: keyof typeof Ionicons.glyphMap; tone: string }[] = [
  { key: 'send', label: 'Transfer', icon: 'paper-plane', tone: '#12D18E' },
  { key: 'receive', label: 'Terima', icon: 'arrow-down-circle-outline', tone: '#38BDF8' },
  { key: 'topup', label: 'Top Up', icon: 'add-circle-outline', tone: '#A78BFA' },
  { key: 'bill', label: 'Tagihan', icon: 'document-text-outline', tone: '#F59E0B' },
];

const weeklySpend = [42, 58, 36, 74, 51, 88, 63];
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function HomeScreen() {
  const {
    user,
    balance,
    transactions,
    cards,
    sendMoney,
    receiveMoney,
    topUp,
    payBill,
  } = useWallet();
  const [modalType, setModalType] = useState<ActionType | null>(null);
  const introAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(introAnim, {
      toValue: 1,
      duration: 520,
      useNativeDriver: true,
    }).start();
  }, [introAnim]);

  const smoothIn = {
    opacity: introAnim,
    transform: [
      {
        translateY: introAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  };

  const recent = transactions.slice(0, 2);
  const connectedTotal = linkedAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalBalance = connectedTotal + balance;
  const bankTotal = linkedAccounts
    .filter((account) => account.type === 'Bank')
    .reduce((sum, account) => sum + account.balance, 0);
  const walletTotal = connectedTotal - bankTotal;
  const bankPercent = Math.round((bankTotal / connectedTotal) * 100);
  const walletPercent = 100 - bankPercent;

  const formatRupiah = (value: number) =>
    `Rp${value.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;

  const handleConfirm = (data: { recipient?: string; amount: number; billName?: string }) => {
    if (!modalType) return;
    switch (modalType) {
      case 'send':
        sendMoney(data.recipient ?? '', data.amount);
        break;
      case 'receive':
        receiveMoney(data.amount, data.recipient ?? 'Dana Masuk');
        break;
      case 'topup':
        topUp(data.amount);
        break;
      case 'bill':
        payBill(data.billName ?? 'Bill', data.amount);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.backgroundGlow} />
        <View style={styles.backgroundGlowTwo} />

        <View style={styles.header}>
          <Logo size="small" inverted />
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Alert.alert('Omni Sync', 'Semua akun tersinkron otomatis 12 detik lalu.')}
            >
              <Ionicons name="sync" size={20} color={colors.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Alert.alert('Notifikasi', '2 tagihan dan 1 insight baru menunggu.')}
            >
              <Ionicons name="notifications-outline" size={21} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[styles.heroIntro, smoothIn]}>
          <View style={styles.nameBlock}>
            <Text style={styles.eyebrow}>Pusat Kontrol Keuangan</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.greeting}>
              Hi, {user?.name ?? 'Yodi Pratama'}
            </Text>
          </View>
          <View style={styles.syncPill}>
            <View style={styles.syncDot} />
            <Text style={styles.syncText}>Aktif</Text>
          </View>
        </Animated.View>

        <Animated.View style={smoothIn}>
        <BlurView intensity={72} tint="dark" style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <View>
              <Text style={styles.balanceLabel}>Total Saldo Gabungan</Text>
              <Text style={styles.balanceSub}>Bank + e-wallet + saldo aplikasi</Text>
            </View>
            <View style={styles.currencyPill}>
              <Text style={styles.currencyText}>IDR</Text>
            </View>
          </View>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.balanceAmount}>
            {formatRupiah(totalBalance)}
          </Text>
          <View style={styles.balanceFooter}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Bank</Text>
              <Text style={styles.metricValue}>{bankPercent}%</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>E-Wallet</Text>
              <Text style={styles.metricValue}>{walletPercent}%</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Akun</Text>
              <Text style={styles.metricValue}>{linkedAccounts.length}</Text>
            </View>
          </View>
        </BlurView>
        </Animated.View>

        <Animated.View style={[styles.actions, smoothIn]}>
          {quickActions.map((a) => (
            <TouchableOpacity
              key={a.key}
              style={styles.actionItem}
              onPress={() => setModalType(a.key)}
            >
              <BlurView intensity={50} tint="dark" style={styles.actionIcon}>
                <Ionicons name={a.icon} size={22} color={a.tone} />
              </BlurView>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Akun Terhubung</Text>
          <Text style={styles.sectionAction}>Keuangan Terbuka</Text>
        </View>
        <Animated.View style={smoothIn}>
        <BlurView intensity={56} tint="dark" style={styles.accountsPanel}>
          {linkedAccounts.map((account, index) => (
            <View key={account.name} style={[styles.accountRow, index === linkedAccounts.length - 1 && styles.lastRow]}>
              <View style={[styles.accountIcon, { backgroundColor: `${account.color}22` }]}>
                <Image source={account.logo} style={styles.brandLogo} resizeMode="contain" />
              </View>
              <View style={styles.accountText}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountType}>{account.type} • tersinkron sekarang</Text>
              </View>
              <Text style={styles.accountBalance}>{formatRupiah(account.balance)}</Text>
            </View>
          ))}
        </BlurView>
        </Animated.View>

        <View style={styles.analyticsRow}>
          <BlurView intensity={54} tint="dark" style={styles.chartCard}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>Pengeluaran Mingguan</Text>
              <Text style={styles.cardMeta}>-12%</Text>
            </View>
            <View style={styles.chartBars}>
              {weeklySpend.map((height, index) => (
                <View key={`${weekDays[index]}-${index}`} style={styles.barWrap}>
                  <View style={[styles.bar, { height }]} />
                  <Text style={styles.barLabel}>{weekDays[index]}</Text>
                </View>
              ))}
            </View>
          </BlurView>

          <BlurView intensity={54} tint="dark" style={styles.splitCard}>
            <Text style={styles.cardTitle}>Komposisi Aset</Text>
            <View style={styles.ring}>
              <View style={styles.ringCore}>
                <Text style={styles.ringValue}>{bankPercent}%</Text>
                <Text style={styles.ringLabel}>Bank</Text>
              </View>
            </View>
            <Text style={styles.splitText}>{walletPercent}% tersimpan di e-wallet</Text>
          </BlurView>
        </View>

        <BlurView intensity={58} tint="dark" style={styles.aiPanel}>
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={21} color={colors.ink} />
          </View>
          <View style={styles.aiText}>
            <Text style={styles.aiTitle}>Insight Omni AI</Text>
            <Text style={styles.aiSub}>
              Tagihan internet jatuh tempo 3 hari lagi. Saldo BCA cukup untuk bayar otomatis.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.52)" />
        </BlurView>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Kartu Saya</Text>
          <Text style={styles.sectionAction}>Geser -&gt;</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
          {cards.map((c) => (
            <CardItem key={c.id} card={c} />
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, styles.txTitle]}>Transaksi Terbaru</Text>
        {recent.map((t, i) => (
          <TransactionRow key={t.id} item={t} index={i} showRelativeDate dark />
        ))}
      </ScrollView>

      <ActionModal
        visible={modalType !== null}
        type={modalType ?? 'send'}
        balance={balance}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#07111F' },
  scroll: { paddingHorizontal: 20, paddingBottom: 38 },
  backgroundGlow: {
    position: 'absolute',
    top: 10,
    right: -90,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(18,209,142,0.22)',
  },
  backgroundGlowTwo: {
    position: 'absolute',
    top: 210,
    left: -120,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(56,189,248,0.16)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  headerActions: { flexDirection: 'row', gap: 10 },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIntro: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 18,
  },
  nameBlock: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  greeting: { fontSize: 27, fontWeight: '900', color: colors.white, lineHeight: 33 },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: 'rgba(18,209,142,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(18,209,142,0.32)',
  },
  syncDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent },
  syncText: { color: colors.accent, fontSize: 11, fontWeight: '900' },
  balanceCard: {
    borderRadius: 30,
    padding: 22,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(15,23,42,0.72)',
  },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  balanceLabel: { color: colors.white, fontSize: 15, fontWeight: '900' },
  balanceSub: { color: 'rgba(255,255,255,0.52)', fontSize: 12, marginTop: 4 },
  currencyPill: {
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: 'rgba(18,209,142,0.12)',
  },
  currencyText: { color: colors.accent, fontSize: 12, fontWeight: '900' },
  balanceAmount: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '900',
    marginTop: 16,
    lineHeight: 44,
  },
  balanceFooter: {
    marginTop: 20,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metric: { flex: 1, minWidth: 0 },
  metricLabel: { color: 'rgba(255,255,255,0.52)', fontSize: 11, fontWeight: '800' },
  metricValue: { color: colors.white, fontSize: 15, fontWeight: '900', marginTop: 4 },
  metricDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.12)', marginHorizontal: 8 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionItem: { alignItems: 'center', flex: 1, minWidth: 0 },
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  actionLabel: {
    width: '100%',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 19, fontWeight: '900', color: colors.white },
  sectionAction: { color: colors.accent, fontSize: 12, fontWeight: '900' },
  accountsPanel: {
    borderRadius: 25,
    padding: 14,
    marginBottom: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  lastRow: { borderBottomWidth: 0 },
  accountIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandLogo: { width: 32, height: 32 },
  accountText: { flex: 1, minWidth: 0 },
  accountName: { color: colors.white, fontSize: 14, fontWeight: '900' },
  accountType: { color: 'rgba(255,255,255,0.48)', fontSize: 12, marginTop: 3 },
  accountBalance: { color: colors.white, fontSize: 13, fontWeight: '900' },
  analyticsRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  chartCard: {
    flex: 1.35,
    minHeight: 178,
    borderRadius: 25,
    padding: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  splitCard: {
    flex: 1,
    minHeight: 178,
    borderRadius: 25,
    padding: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { color: colors.white, fontSize: 14, fontWeight: '900' },
  cardMeta: { color: colors.accent, fontSize: 12, fontWeight: '900' },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 18,
  },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: {
    width: '100%',
    minHeight: 22,
    borderRadius: 10,
    backgroundColor: colors.accent,
  },
  barLabel: { color: 'rgba(255,255,255,0.46)', fontSize: 10, fontWeight: '800', marginTop: 7 },
  ring: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 10,
    borderColor: colors.accent,
    borderLeftColor: '#38BDF8',
    borderBottomColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  ringCore: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#07111F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: { color: colors.white, fontSize: 16, fontWeight: '900' },
  ringLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '800' },
  splitText: { color: 'rgba(255,255,255,0.62)', fontSize: 11, lineHeight: 15, textAlign: 'center' },
  aiPanel: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    padding: 16,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiText: { flex: 1, minWidth: 0 },
  aiTitle: { color: colors.white, fontSize: 15, fontWeight: '900', lineHeight: 20 },
  aiSub: { color: 'rgba(255,255,255,0.56)', fontSize: 12, lineHeight: 17, marginTop: 3 },
  cardsScroll: { marginBottom: 24, marginHorizontal: -4 },
  txTitle: { marginBottom: 4 },
});
