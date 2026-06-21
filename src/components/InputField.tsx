import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';

interface Props extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function InputField({ label, icon, isPassword, ...props }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name={icon} size={20} color={colors.textMuted} style={styles.leftIcon} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !visible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setVisible((v) => !v)} hitSlop={12}>
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  leftIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: colors.text },
});
