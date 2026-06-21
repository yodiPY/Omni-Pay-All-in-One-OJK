import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const {
    user,
    logout,
    pushNotifications,
    emailNotifications,
    darkMode,
    setPushNotifications,
    setEmailNotifications,
    setDarkMode,
  } = useWallet();

  const menuItems = [
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'Keamanan Akun',
      subtitle: 'Face ID dan kode akses',
      onPress: () => navigation.navigate('Security'),
    },
    {
      icon: 'card-outline' as const,
      title: 'Metode Pembayaran',
      subtitle: 'Kelola kartu dan rekening',
      onPress: () => navigation.navigate('Cards'),
    },
    {
      icon: 'color-palette-outline' as const,
      title: 'Tampilan',
      subtitle: 'Tema gelap premium',
      onPress: () => setDarkMode(!darkMode),
    },
    {
      icon: 'help-circle-outline' as const,
      title: 'Bantuan',
      subtitle: 'Pusat bantuan OmniPay',
      onPress: () => navigation.navigate('Help'),
    },
  ];

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar dari OmniPay?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.backgroundGlow} />
      <View style={styles.backgroundGlowTwo} />
      <View style={styles.topBar}>
        <View>
          <Text style={styles.eyebrow}>Akun OmniPay</Text>
          <Text style={styles.pageTitle}>Profil</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <BlurView intensity={50} tint="dark" style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={22} color={colors.white} />
          </BlurView>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <BlurView intensity={64} tint="dark" style={styles.profileCard}>
          <View style={styles.avatar}>
            <View style={styles.avatarGlow} />
            <Text style={styles.avatarText}>YP</Text>
          </View>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.name}>
            {user?.name ?? 'Yodi Pratama'}
          </Text>
          <Text style={styles.email}>{user?.email ?? 'yodi@omnipay.app'}</Text>
          <View style={styles.memberPill}>
            <Ionicons name="sparkles" size={14} color={colors.ink} />
            <Text style={styles.memberText}>Omni Priority</Text>
          </View>
        </BlurView>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <BlurView key={item.title} intensity={44} tint="dark" style={styles.menuGlass}>
              <TouchableOpacity style={styles.menuRow} onPress={item.onPress} activeOpacity={0.78}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={21} color={colors.accent} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.subtitle ? (
                  <Text style={styles.menuSub}>{item.subtitle}</Text>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.48)" />
            </TouchableOpacity>
            </BlurView>
          ))}

          <BlurView intensity={44} tint="dark" style={styles.menuGlass}>
          <View style={styles.menuRow}>
            <View style={styles.menuIcon}>
              <Ionicons name="notifications-outline" size={21} color={colors.accent} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Notifikasi</Text>
              <Text style={styles.menuSub}>Pilih kanal pemberitahuan</Text>
            </View>
            <View style={styles.toggles}>
              <TouchableOpacity
                style={[styles.toggle, pushNotifications && styles.toggleOn]}
                onPress={() => setPushNotifications(!pushNotifications)}
              >
                <Text style={[styles.toggleText, pushNotifications && styles.toggleTextOn]}>
                  Push
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggle, emailNotifications && styles.toggleOn]}
                onPress={() => setEmailNotifications(!emailNotifications)}
              >
                <Text style={[styles.toggleText, emailNotifications && styles.toggleTextOn]}>
                  Email
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          </BlurView>

          <BlurView intensity={44} tint="dark" style={styles.menuGlass}>
          <View style={styles.menuRow}>
            <View style={styles.menuIcon}>
              <Ionicons name="moon-outline" size={21} color={colors.accent} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Mode Gelap</Text>
              <Text style={styles.menuSub}>{darkMode ? 'Aktif' : 'Nonaktif'}</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: 'rgba(255,255,255,0.14)', true: colors.accent }}
              thumbColor={colors.white}
            />
          </View>
          </BlurView>
        </View>

        <TouchableOpacity activeOpacity={0.82} style={styles.logout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={19} color={colors.error} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#07111F' },
  backgroundGlow: {
    position: 'absolute',
    top: 34,
    right: -80,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(18,209,142,0.18)',
  },
  backgroundGlowTwo: {
    position: 'absolute',
    bottom: 160,
    left: -110,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(56,189,248,0.12)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  pageTitle: { color: colors.white, fontSize: 30, fontWeight: '900', marginTop: 3 },
  settingsButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  scroll: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 128 },
  profileCard: {
    width: '100%',
    borderRadius: 30,
    padding: 22,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    marginBottom: 18,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(18,209,142,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(18,209,142,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(18,209,142,0.32)',
  },
  avatarText: { color: colors.white, fontSize: 28, fontWeight: '900' },
  name: { fontSize: 24, fontWeight: '900', color: colors.white, marginTop: 16, maxWidth: '100%' },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.58)', marginTop: 4 },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 14,
  },
  memberText: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  menu: { width: '100%', gap: 10 },
  menuGlass: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    minHeight: 72,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(18,209,142,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuText: { flex: 1, minWidth: 0 },
  menuTitle: { fontSize: 15, fontWeight: '900', color: colors.white },
  menuSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 },
  toggles: { flexDirection: 'row', gap: 8 },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  toggleOn: { backgroundColor: colors.accent },
  toggleText: { fontSize: 12, fontWeight: '900', color: 'rgba(255,255,255,0.58)' },
  toggleTextOn: { color: colors.ink },
  logout: {
    width: '100%',
    marginTop: 18,
    borderRadius: 22,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  logoutText: { color: colors.error, fontSize: 15, fontWeight: '900' },
});
