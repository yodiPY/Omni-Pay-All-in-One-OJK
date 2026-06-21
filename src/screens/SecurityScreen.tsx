import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FaceIdModal } from '../components/FaceIdModal';
import { useWallet } from '../context/WalletContext';
import { colors } from '../theme/colors';

export function SecurityScreen() {
  const { biometricAvailable, setFaceIdEnabled } = useWallet();
  const [passcodeEnabled, setPasscodeEnabled] = useState(true);
  const [faceIdVisible, setFaceIdVisible] = useState(false);

  const handleFaceSwitch = (enabled: boolean) => {
    if (enabled) {
      setFaceIdVisible(true);
      return;
    }
    Alert.alert('Face ID', 'Matikan Face ID untuk akun ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Matikan',
        style: 'destructive',
        onPress: () => setFaceIdEnabled(false),
      },
    ]);
  };

  const handleFaceIdComplete = (faceTemplate: string) => {
    setFaceIdVisible(false);
    setFaceIdEnabled(true, faceTemplate);
    Alert.alert('Face ID', 'Face ID berhasil didaftarkan.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.title}>Face ID</Text>
          <Text style={styles.sub}>
            {biometricAvailable
              ? 'Aktif untuk login dengan kamera depan'
              : 'Belum aktif. Daftarkan wajah dengan kamera depan.'}
          </Text>
        </View>
        <Switch
          value={biometricAvailable}
          onValueChange={handleFaceSwitch}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>

      <TouchableOpacity style={styles.enrollCard} onPress={() => setFaceIdVisible(true)}>
        <View>
          <Text style={styles.enrollTitle}>
            {biometricAvailable ? 'Re-scan Face ID' : 'Set Up Face ID'}
          </Text>
          <Text style={styles.enrollSub}>Open the iOS-style face scan animation</Text>
        </View>
        <Text style={styles.enrollAction}>Start</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.title}>Passcode</Text>
          <Text style={styles.sub}>Kunci aplikasi dengan PIN 6 digit</Text>
        </View>
        <Switch
          value={passcodeEnabled}
          onValueChange={setPasscodeEnabled}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>

      <Text style={styles.hint}>
        Password default: password123{'\n'}Email: yodi@omnipay.app
      </Text>

      <FaceIdModal
        visible={faceIdVisible}
        mode="enroll"
        onClose={() => setFaceIdVisible(false)}
        onSuccess={handleFaceIdComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 16,
  },
  copy: { flex: 1, minWidth: 0 },
  title: { fontSize: 16, fontWeight: '600', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
  enrollCard: {
    marginTop: 18,
    marginBottom: 2,
    borderRadius: 18,
    padding: 18,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  enrollTitle: { color: colors.white, fontSize: 17, fontWeight: '800' },
  enrollSub: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.68)',
    fontSize: 13,
    lineHeight: 18,
  },
  enrollAction: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 14,
  },
  hint: { marginTop: 24, color: colors.textSecondary, lineHeight: 22, fontSize: 14 },
});
