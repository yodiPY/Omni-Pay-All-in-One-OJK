import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { PrimaryButton } from './PrimaryButton';

export type ActionType = 'send' | 'receive' | 'topup' | 'bill';

interface Props {
  visible: boolean;
  type: ActionType;
  balance: number;
  onClose: () => void;
  onConfirm: (data: { recipient?: string; amount: number; billName?: string }) => void;
}

const titles: Record<ActionType, string> = {
  send: 'Transfer Dana',
  receive: 'Terima Dana',
  topup: 'Top Up Saldo',
  bill: 'Bayar Tagihan',
};

export function ActionModal({ visible, type, balance, onClose, onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [billName, setBillName] = useState('');

  const reset = () => {
    setRecipient('');
    setAmount('');
    setBillName('');
  };

  const handleClose = () => {
    Keyboard.dismiss();
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Error', 'Masukkan jumlah yang valid.');
      return;
    }
    if ((type === 'send' || type === 'bill') && num > balance) {
      Alert.alert('Error', 'Saldo tidak mencukupi.');
      return;
    }
    if (type === 'send' && !recipient.trim()) {
      Alert.alert('Error', 'Masukkan nama penerima.');
      return;
    }
    if (type === 'bill' && !billName.trim()) {
      Alert.alert('Error', 'Masukkan nama tagihan.');
      return;
    }

    onConfirm({
      recipient: recipient.trim(),
      amount: num,
      billName: billName.trim(),
    });
    Keyboard.dismiss();
    reset();
    onClose();
    Alert.alert('Berhasil', 'Transaksi berhasil diproses.');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <KeyboardAvoidingView
          style={styles.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View
                style={[
                  styles.sheet,
                  { paddingBottom: Math.max(insets.bottom, 16) + 8 },
                ]}
              >
                <View style={styles.handle} />
                <Text style={styles.title}>{titles[type]}</Text>
                <Text style={styles.balanceHint}>Saldo aplikasi: Rp{Math.round(balance).toLocaleString('id-ID')}</Text>

                {type === 'send' && (
                  <TextInput
                    style={styles.input}
                    placeholder="Nama penerima"
                    placeholderTextColor={colors.textMuted}
                    value={recipient}
                    onChangeText={setRecipient}
                    returnKeyType="next"
                  />
                )}
                {type === 'receive' && (
                  <TextInput
                    style={styles.input}
                    placeholder="Dari (opsional)"
                    placeholderTextColor={colors.textMuted}
                    value={recipient}
                    onChangeText={setRecipient}
                    returnKeyType="next"
                  />
                )}
                {type === 'bill' && (
                  <TextInput
                    style={styles.input}
                    placeholder="Nama tagihan (mis. Listrik)"
                    placeholderTextColor={colors.textMuted}
                    value={billName}
                    onChangeText={setBillName}
                    returnKeyType="next"
                  />
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Jumlah (Rp)"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                />

                <PrimaryButton title="Konfirmasi" onPress={handleSubmit} />
                <TouchableOpacity onPress={handleClose} style={styles.cancel}>
                  <Text style={styles.cancelText}>Batal</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  kav: {
    maxHeight: '90%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
  balanceHint: { fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    color: colors.text,
  },
  cancel: { alignItems: 'center', marginTop: 16 },
  cancelText: { color: colors.textSecondary, fontSize: 16 },
});
