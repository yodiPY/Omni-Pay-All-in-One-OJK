import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputField } from '../components/InputField';
import { KeyboardForm } from '../components/KeyboardForm';
import { Logo } from '../components/Logo';
import { PrimaryButton } from '../components/PrimaryButton';
import { useWallet } from '../context/WalletContext';
import { DEMO_EMAIL } from '../data/initialData';
import { AuthStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { resetPassword } = useWallet();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    Alert.alert(result.ok ? 'Berhasil' : 'Gagal', result.message, [
      { text: 'OK', onPress: () => result.ok && navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardForm contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Kembali</Text>
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <Logo />
        </View>

        <Text style={styles.heading}>Reset Password</Text>
        <Text style={styles.sub}>
          Masukkan email terdaftar. Kami akan mengirim link reset password.
        </Text>

        <InputField
          label="Email Address"
          icon="mail-outline"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PrimaryButton title="Kirim Link Reset" onPress={handleReset} loading={loading} />
      </KeyboardForm>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24 },
  back: { color: colors.link, fontSize: 16, marginBottom: 16 },
  logoWrap: { alignItems: 'center', marginVertical: 24 },
  heading: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 8 },
  sub: { color: colors.textSecondary, marginBottom: 24, lineHeight: 22 },
});
