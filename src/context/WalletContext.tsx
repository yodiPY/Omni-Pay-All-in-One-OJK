import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  INITIAL_BALANCE,
  initialCards,
  initialTransactions,
} from '../data/initialData';
import { Card, FilterChip, Transaction, User } from '../types';
import { faceFingerprintsMatch } from '../utils/faceFingerprint';

const STORAGE_KEY = '@omnipay_state';

interface StoredState {
  isLoggedIn: boolean;
  user: User | null;
  balance: number;
  transactions: Transaction[];
  cards: Card[];
  pushNotifications: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
}

interface WalletContextValue extends StoredState {
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  loginWithFaceId: (faceTemplate: string) => Promise<{ ok: boolean; message?: string }>;
  register: (name: string, email: string, password: string, faceIdEnabled?: boolean, faceTemplate?: string) => Promise<{ ok: boolean; message?: string }>;
  setFaceIdEnabled: (enabled: boolean, faceTemplate?: string) => void;
  logout: () => void;
  sendMoney: (recipient: string, amount: number) => void;
  receiveMoney: (amount: number, from: string) => void;
  topUp: (amount: number) => void;
  payBill: (billName: string, amount: number) => void;
  setPushNotifications: (v: boolean) => void;
  setEmailNotifications: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  resetPassword: (email: string) => Promise<{ ok: boolean; message: string }>;
  filterTransactions: (query: string, chip: FilterChip) => Transaction[];
  biometricAvailable: boolean;
}

const defaultUser: User = {
  name: 'Yodi Pratama',
  email: DEMO_EMAIL,
  password: DEMO_PASSWORD,
  faceIdEnabled: false,
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredState>({
    isLoggedIn: false,
    user: null,
    balance: INITIAL_BALANCE,
    transactions: initialTransactions,
    cards: initialCards,
    pushNotifications: true,
    emailNotifications: false,
    darkMode: false,
  });
  const [hydrated, setHydrated] = useState(false);
  const biometricAvailable = Boolean((state.user ?? defaultUser).faceIdEnabled && (state.user ?? defaultUser).faceTemplate);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as StoredState;
          setState(parsed);
        }
      } catch {
        /* keep defaults */
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const login = useCallback(async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const stored = state.user ?? defaultUser;
    const matchEmail =
      normalized === stored.email.toLowerCase() ||
      (normalized === DEMO_EMAIL && !state.user);
    const matchPassword = password === (state.user?.password ?? DEMO_PASSWORD);

    if (matchEmail && matchPassword) {
      setState((s) => ({
        ...s,
        isLoggedIn: true,
        user: s.user ?? defaultUser,
      }));
      return { ok: true };
    }
    return { ok: false, message: 'Email atau password salah.' };
  }, [state.user]);

  const loginWithFaceId = useCallback(async (faceTemplate: string) => {
    const stored = state.user ?? defaultUser;
    if (!stored.faceIdEnabled || !stored.faceTemplate) {
      return { ok: false, message: 'Face ID belum didaftarkan untuk akun ini.' };
    }
    if (!faceFingerprintsMatch(stored.faceTemplate, faceTemplate)) {
      return { ok: false, message: 'Wajah tidak cocok. Coba lagi atau gunakan email & password.' };
    }
    setState((s) => ({
      ...s,
      isLoggedIn: true,
      user: s.user ?? defaultUser,
    }));
    return { ok: true };
  }, [state.user]);

  const setFaceIdEnabled = useCallback((enabled: boolean, faceTemplate?: string) => {
    setState((s) => ({
      ...s,
      user: s.user
        ? { ...s.user, faceIdEnabled: enabled, faceTemplate: enabled ? faceTemplate ?? s.user.faceTemplate : undefined }
        : { ...defaultUser, faceIdEnabled: enabled, faceTemplate },
    }));
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, faceIdEnabled = false, faceTemplate?: string) => {
      if (!name.trim() || !email.trim() || password.length < 6) {
        return {
          ok: false,
          message: 'Lengkapi data. Password minimal 6 karakter.',
        };
      }
      const user: User = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        faceIdEnabled: faceIdEnabled && Boolean(faceTemplate),
        faceTemplate,
      };
      setState((s) => ({ ...s, user, isLoggedIn: true }));
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setState((s) => ({ ...s, isLoggedIn: false }));
  }, []);

  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id'>) => {
      const id = Date.now().toString();
      const today = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateStr = `${months[today.getMonth()]} ${today.getDate()}`;
      setState((s) => ({
        ...s,
        balance: Math.round((s.balance + tx.amount) * 100) / 100,
        transactions: [{ ...tx, id, date: dateStr }, ...s.transactions],
      }));
    },
    [],
  );

  const sendMoney = useCallback(
    (recipient: string, amount: number) => {
      if (amount <= 0 || amount > state.balance) return;
      addTransaction({
        name: recipient || 'Transfer',
        date: '',
        amount: -amount,
        type: 'sent',
        icon: 'paper-plane',
        iconColor: colorsRef.accent,
      });
    },
    [addTransaction, state.balance],
  );

  const receiveMoney = useCallback(
    (amount: number, from: string) => {
      if (amount <= 0) return;
      addTransaction({
        name: from || 'Received',
        date: '',
        amount,
        type: 'received',
        icon: 'swap-horizontal',
        iconColor: '#3B82F6',
      });
    },
    [addTransaction],
  );

  const topUp = useCallback(
    (amount: number) => {
      if (amount <= 0) return;
      addTransaction({
        name: 'Top Up',
        date: '',
        amount,
        type: 'received',
        icon: 'add-circle',
        iconColor: '#22C55E',
      });
    },
    [addTransaction],
  );

  const payBill = useCallback(
    (billName: string, amount: number) => {
      if (amount <= 0 || amount > state.balance) return;
      addTransaction({
        name: billName,
        date: '',
        amount: -amount,
        type: 'bill',
        icon: 'document-text',
        iconColor: '#F59E0B',
      });
    },
    [addTransaction, state.balance],
  );

  const resetPassword = useCallback(async (email: string) => {
    const normalized = email.trim().toLowerCase();
    const userEmail = (state.user ?? defaultUser).email.toLowerCase();
    if (normalized !== userEmail) {
      return { ok: false, message: 'Email tidak terdaftar.' };
    }
    return {
      ok: true,
      message: 'Link reset password telah dikirim ke email Anda.',
    };
  }, [state.user]);

  const filterTransactions = useCallback(
    (query: string, chip: FilterChip) => {
      let list = [...state.transactions];
      if (chip === 'Sent') list = list.filter((t) => t.amount < 0 && t.type === 'sent');
      else if (chip === 'Received') list = list.filter((t) => t.amount > 0);
      else if (chip === 'Bills') list = list.filter((t) => t.type === 'bill');
      if (query.trim()) {
        const q = query.toLowerCase();
        list = list.filter((t) => t.name.toLowerCase().includes(q));
      }
      return list;
    },
    [state.transactions],
  );

  const colorsRef = { accent: '#C9A962' };

  const value = useMemo<WalletContextValue>(
    () => ({
      ...state,
      login,
      loginWithFaceId,
      register,
      setFaceIdEnabled,
      logout,
      sendMoney,
      receiveMoney,
      topUp,
      payBill,
      setPushNotifications: (v) => setState((s) => ({ ...s, pushNotifications: v })),
      setEmailNotifications: (v) => setState((s) => ({ ...s, emailNotifications: v })),
      setDarkMode: (v) => setState((s) => ({ ...s, darkMode: v })),
      resetPassword,
      filterTransactions,
      biometricAvailable,
    }),
    [
      state,
      login,
      loginWithFaceId,
      register,
      setFaceIdEnabled,
      logout,
      sendMoney,
      receiveMoney,
      topUp,
      payBill,
      resetPassword,
      filterTransactions,
      biometricAvailable,
    ],
  );

  if (!hydrated) return null;

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
