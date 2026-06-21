import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FaceIdModal } from '../components/FaceIdModal';
import { InputField } from '../components/InputField';
import { KeyboardForm } from '../components/KeyboardForm';
import { Logo } from '../components/Logo';
import { PrimaryButton } from '../components/PrimaryButton';
import { useWallet } from '../context/WalletContext';
import { DEMO_EMAIL, DEMO_PASSWORD } from '../data/initialData';
import { AuthStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login, loginWithFaceId, biometricAvailable } = useWallet();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [faceIdVisible, setFaceIdVisible] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) Alert.alert('Login gagal', result.message);
  };

  const handleFaceIdPress = () => {
    if (!biometricAvailable) {
      Alert.alert('Face ID', 'Face ID belum didaftarkan. Buat akun baru dengan Face ID dulu.');
      return;
    }
    setFaceIdVisible(true);
  };

  const handleFaceIdComplete = async (faceTemplate: string) => {
    setFaceIdVisible(false);
    const result = await loginWithFaceId(faceTemplate);
    if (!result.ok) {
      Alert.alert('Face ID', result.message ?? 'Gunakan email & password.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardForm contentContainerStyle={styles.scroll}>
        <View style={styles.logoWrap}>
          <Logo size="large" />
        </View>

        <Text style={styles.heading}>Welcome Back</Text>
        <Text style={styles.subheading}>Your money, cards, vaults, and rewards in one premium wallet.</Text>

        <InputField
          label="Email Address"
          icon="mail-outline"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputField
          label="Password"
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          isPassword
        />

        <TouchableOpacity
          style={styles.forgot}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <PrimaryButton title="Log In" onPress={handleLogin} loading={loading} />

        <Text style={styles.divider}>Or log in with</Text>

        <View style={styles.bioRow}>
          <TouchableOpacity style={styles.bioBtn} onPress={handleFaceIdPress}>
            <Ionicons name="scan-outline" size={32} color={colors.primary} />
            <Text style={styles.bioLabel}>Face ID</Text>
          </TouchableOpacity>
        </View>

        {!biometricAvailable && (
          <Text style={styles.bioHint}>
            Face ID belum aktif. Daftar akun baru dan aktifkan Face ID dengan kamera depan.
          </Text>
        )}

        <TouchableOpacity
          style={styles.signUp}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signUpText}>
            Don&apos;t have an account? <Text style={styles.signUpBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardForm>

      <FaceIdModal
        visible={faceIdVisible}
        mode="login"
        onClose={() => setFaceIdVisible(false)}
        onSuccess={handleFaceIdComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 24 },
  logoWrap: { alignItems: 'center', marginTop: 24, marginBottom: 32 },
  heading: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 28,
  },
  forgot: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -8 },
  forgotText: { color: colors.link, fontSize: 14, fontWeight: '500' },
  divider: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginVertical: 24,
    fontSize: 14,
  },
  bioRow: { flexDirection: 'row' },
  bioBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.white,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.glassStrong,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  bioLabel: { fontSize: 14, fontWeight: '800', color: colors.text },
  bioHint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 17,
  },
  signUp: { marginTop: 32, alignItems: 'center' },
  signUpText: { color: colors.textSecondary, fontSize: 15 },
  signUpBold: { fontWeight: '700', color: colors.text },
});
