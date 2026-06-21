import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '../theme/colors';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'outline';
}

export function PrimaryButton({
  title,
  loading,
  variant = 'primary',
  style,
  disabled,
  ...rest
}: Props) {
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isOutline && styles.outline,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.85}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.accent} />
      ) : (
        <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  disabled: { opacity: 0.6 },
  text: { color: colors.accent, fontSize: 17, fontWeight: '900' },
  outlineText: { color: colors.text },
});
