import { Ionicons } from '@expo/vector-icons';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardsScreen } from '../screens/CardsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { colors } from '../theme/colors';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Transactions: 'swap-horizontal',
  Cards: 'card',
  Profile: 'person',
};

const tabLabels: Record<keyof MainTabParamList, string> = {
  Home: 'Beranda',
  Transactions: 'Transaksi',
  Cards: 'Koneksi',
  Profile: 'Profil',
};

function LiquidTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const trackWidth = width - 68;
  const innerWidth = trackWidth - 14;
  const segmentWidth = innerWidth / state.routes.length;
  const pillWidth = Math.max(72, segmentWidth - 6);
  const pillTranslate = useRef(new Animated.Value(0)).current;
  const dragStart = useRef(0);

  const targetForIndex = (index: number) => segmentWidth * index + (segmentWidth - pillWidth) / 2;
  const minTranslate = targetForIndex(0);
  const maxTranslate = targetForIndex(state.routes.length - 1);

  useEffect(() => {
    Animated.spring(pillTranslate, {
      toValue: targetForIndex(state.index),
      damping: 22,
      stiffness: 210,
      mass: 0.7,
      useNativeDriver: true,
    }).start();
  }, [pillTranslate, segmentWidth, pillWidth, state.index]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 14 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.35,
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dx) > 10 && Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.2,
        onPanResponderGrant: () => {
          dragStart.current = targetForIndex(state.index);
          pillTranslate.stopAnimation();
        },
        onPanResponderMove: (_, gesture) => {
          const next = Math.max(minTranslate, Math.min(maxTranslate, dragStart.current + gesture.dx));
          pillTranslate.setValue(next);
        },
        onPanResponderTerminationRequest: () => true,
        onPanResponderRelease: (_, gesture) => {
          const raw = Math.max(minTranslate, Math.min(maxTranslate, dragStart.current + gesture.dx));
          const nextIndex = Math.max(
            0,
            Math.min(state.routes.length - 1, Math.round(raw / segmentWidth)),
          );
          const nextRoute = state.routes[nextIndex];

          Animated.spring(pillTranslate, {
            toValue: targetForIndex(nextIndex),
            damping: 20,
            stiffness: 240,
            mass: 0.7,
            useNativeDriver: true,
          }).start();

          if (nextIndex !== state.index && nextRoute) {
            navigation.navigate(nextRoute.name as never);
          }
        },
      }),
    [maxTranslate, navigation, pillTranslate, segmentWidth, state.index, state.routes, pillWidth],
  );

  return (
    <View
      style={[styles.tabShell, { paddingBottom: Math.max(insets.bottom, 12) }]}
      {...panResponder.panHandlers}
    >
      <BlurView
        intensity={88}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={styles.glassTrack}
        {...panResponder.panHandlers}
      >
        <View style={styles.glassTint} />
        <Animated.View
          style={[
            styles.activeSlider,
            {
              width: pillWidth,
              transform: [{ translateX: pillTranslate }],
            },
          ]}
        >
          <View style={styles.liquidGlow} />
          <View style={styles.liquidHighlight} />
        </Animated.View>
        {state.routes.map((route, index) => {
          const name = route.name as keyof MainTabParamList;
          const focused = state.index === index;
          const iconName = focused ? tabIcons[name] : (`${tabIcons[name]}-outline` as keyof typeof Ionicons.glyphMap);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabButton}
            >
              <View style={styles.tabPill}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name={iconName}
                    size={focused ? 22 : 21}
                    color={focused ? colors.ink : 'rgba(255,255,255,0.58)'}
                  />
                </View>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                  style={[styles.tabLabel, focused && styles.tabLabelActive]}
                >
                  {tabLabels[name]}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <LiquidTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Cards" component={CardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabShell: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 34,
    paddingTop: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 18,
  },
  glassTrack: {
    minHeight: 70,
    borderRadius: 32,
    backgroundColor: 'rgba(15,23,42,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
    overflow: 'hidden',
    alignSelf: 'center',
    width: '100%',
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,12,20,0.34)',
  },
  activeSlider: {
    position: 'absolute',
    left: 7,
    top: 7,
    bottom: 7,
    borderRadius: 24,
    backgroundColor: 'rgba(18,209,142,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
  },
  tabPill: {
    width: '100%',
    maxWidth: 92,
    minHeight: 56,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    overflow: 'hidden',
    paddingHorizontal: 6,
  },
  liquidGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  liquidHighlight: {
    position: 'absolute',
    top: 5,
    left: 10,
    right: 10,
    height: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  iconWrap: {
    width: 26,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    width: '100%',
    color: 'rgba(255,255,255,0.56)',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
    textAlign: 'center',
    includeFontPadding: false,
  },
  tabLabelActive: {
    color: colors.ink,
  },
});
