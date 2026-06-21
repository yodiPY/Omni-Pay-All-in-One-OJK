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
import { AuthStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { register } = useWallet();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [faceIdVisible, setFaceIdVisible] = useState(false);

  const validate = () => {
    if (!name.trim() || !email.trim() || password.length < 6) {
      Alert.alert('Daftar gagal', 'Lengkapi data. Password minimal 6 karakter.');
      return false;
    }
    return true;
  };

  const handleSignUp = async (withFaceId = false, faceTemplate?: string) => {
    setLoading(true);
    const result = await register(name, email, password, withFaceId, faceTemplate);
    setLoading(false);
    if (!result.ok) Alert.alert('Daftar gagal', result.message);
  };

  const handleFaceIdSignUp = () => {
    if (!validate()) return;
    setFaceIdVisible(true);
  };

  const handleFaceIdComplete = (faceTemplate: string) => {
    setFaceIdVisible(false);
    handleSignUp(true, faceTemplate);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardForm contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>{"<"} Kembali</Text>
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <Logo size="large" />
        </View>

        <Text style={styles.heading}>Create OmniPay</Text>
        <Text style={styles.subheading}>Start with a glass wallet, Face ID, rewards, and smart cashflow tools.</Text>

        <InputField
          label="Full Name"
          icon="person-outline"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
        />
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
          placeholder="Min. 6 characters"
          value={password}
          onChangeText={setPassword}
          isPassword
        />

        <PrimaryButton title="Sign Up" onPress={() => handleSignUp(false)} loading={loading} />

        <TouchableOpacity style={styles.faceButton} onPress={handleFaceIdSignUp}>
          <View style={styles.faceIcon}>
            <Text style={styles.faceGlyph}>Face</Text>
          </View>
          <View style={styles.faceCopy}>
            <Text style={styles.faceTitle}>Sign Up with Face ID</Text>
            <Text numberOfLines={1} style={styles.faceSub}>
              Register using the front camera
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.login} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.bold}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardForm>

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
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 24 },
  back: { marginBottom: 8 },
  backText: { color: colors.link, fontSize: 16 },
  logoWrap: { alignItems: 'center', marginVertical: 16 },
  heading: { fontSize: 28, fontWeight: '900', color: colors.text, marginBottom: 8 },
  subheading: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  faceButton: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: colors.white,
    borderRadius: 22,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.glassStrong,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  faceIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  faceGlyph: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
  },
  faceCopy: { flex: 1, minWidth: 0 },
  faceTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  faceSub: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  login: { marginTop: 24, alignItems: 'center' },
  loginText: { color: colors.textSecondary, fontSize: 15 },
  bold: { fontWeight: '700', color: colors.text },
});
