import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { createFaceFingerprint } from '../utils/faceFingerprint';

type Mode = 'enroll' | 'login';

interface Props {
  visible: boolean;
  mode: Mode;
  onClose: () => void;
  onSuccess: (faceTemplate: string) => void;
}

const enrollSteps = [
  'Tempatkan Wajah di Dalam Lingkaran',
  'Putar Kepala Perlahan ke Kanan',
  'Turunkan Kepala Perlahan',
  'Putar Kepala Perlahan ke Kiri',
  'Angkat Kepala Perlahan',
  'Selesaikan Lingkaran',
  'Face ID Siap',
];
const loginSteps = ['Looking for Your Face', 'Hold Still', 'Face ID Matched'];

const enrollDirections: Array<keyof typeof Ionicons.glyphMap> = [
  'scan',
  'arrow-forward',
  'arrow-back',
  'arrow-up',
  'arrow-down',
  'sync',
  'checkmark',
];

export function FaceIdModal({ visible, mode, onClose, onSuccess }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [stepIndex, setStepIndex] = useState(0);
  const scan = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const headMotion = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView | null>(null);
  const finishingRef = useRef(false);

  const steps = mode === 'enroll' ? enrollSteps : loginSteps;
  const isDone = stepIndex === steps.length - 1;
  const hasPermission = permission?.granted;

  const finishScan = async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        base64: true,
        quality: 0.35,
        skipProcessing: true,
      });
      if (!photo?.base64) {
        finishingRef.current = false;
        return;
      }
      const fingerprint = createFaceFingerprint(photo.base64);
      onSuccess(fingerprint);
    } catch {
      finishingRef.current = false;
    }
  };

  useEffect(() => {
    if (!visible) return;
    setStepIndex(0);
    finishingRef.current = false;
    headMotion.setValue(0);
    if (!hasPermission) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(scan, {
          toValue: 1,
          duration: 1550,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scan, {
          toValue: 0,
          duration: 1550,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(headMotion, {
          toValue: 1,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(headMotion, {
          toValue: 0,
          duration: 950,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const timer = setInterval(() => {
      setStepIndex((current) => {
        if (current >= steps.length - 1) {
          clearInterval(timer);
          setTimeout(finishScan, 650);
          return current;
        }
        return current + 1;
      });
    }, mode === 'enroll' ? 1350 : 1100);

    return () => {
      clearInterval(timer);
      scan.stopAnimation();
      pulse.stopAnimation();
      glow.stopAnimation();
      headMotion.stopAnimation();
    };
  }, [glow, hasPermission, headMotion, mode, pulse, scan, steps.length, visible]);

  const scanY = scan.interpolate({
    inputRange: [0, 1],
    outputRange: [-88, 88],
  });
  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.04],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.52, 0.16],
  });
  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.78],
  });
  const progressTicks = mode === 'enroll' ? 84 : 36;
  const activeTickCount = Math.round(((stepIndex + 1) / steps.length) * progressTicks);
  const markerAngle = (activeTickCount / progressTicks) * Math.PI * 2 - Math.PI / 2;
  const markerRadius = 110;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Ionicons name="close" size={22} color={colors.white} />
          </TouchableOpacity>

          <Text style={styles.title}>{mode === 'enroll' ? 'Face ID' : 'Face ID'}</Text>
          <Text style={styles.subtitle}>
            {mode === 'enroll'
              ? 'Gerakkan kepala perlahan mengikuti lingkaran.'
              : 'Look at the camera to unlock OmniPay.'}
          </Text>

          <View style={styles.cameraStage}>
            {hasPermission ? (
              <CameraView
                ref={cameraRef}
                style={mode === 'enroll' ? styles.cameraHidden : styles.camera}
                facing="front"
              />
            ) : (
              <View style={styles.permissionBox}>
                <Ionicons name="camera-outline" size={34} color={colors.accent} />
                <Text style={styles.permissionText}>
                  Camera access is needed for Face ID.
                </Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                  <Text style={styles.permissionBtnText}>Allow Camera</Text>
                </TouchableOpacity>
              </View>
            )}

            {hasPermission && (
              <>
                <Animated.View
                  style={[
                    styles.outerRing,
                    { opacity: ringOpacity, transform: [{ scale: ringScale }] },
                  ]}
                />
                <View style={styles.tickRing}>
                  {Array.from({ length: progressTicks }).map((_, index) => {
                    const angle = (index / progressTicks) * Math.PI * 2;

                    return (
                      <View
                        key={index}
                        style={[
                          styles.ringTick,
                          { transform: [{ rotate: `${angle}rad` }, { translateY: -109 }] },
                          index < activeTickCount && styles.ringDotActive,
                        ]}
                      />
                    );
                  })}
                </View>
                {mode === 'enroll' ? (
                  <Animated.View
                    style={[
                      styles.orbitMarker,
                      {
                        left: 112 + Math.cos(markerAngle) * markerRadius,
                        top: 112 + Math.sin(markerAngle) * markerRadius,
                        opacity: glowOpacity,
                      },
                    ]}
                  >
                    <Ionicons
                      name={enrollDirections[stepIndex]}
                      size={15}
                      color={colors.primary}
                    />
                  </Animated.View>
                ) : null}
                <View style={[styles.faceFrame, mode === 'enroll' && styles.faceFrameEnroll]}>
                  {mode === 'login' ? (
                    <Animated.View
                      style={[styles.scanLine, { transform: [{ translateY: scanY }] }]}
                    />
                  ) : null}
                  {mode === 'login' ? (
                    <Animated.View style={[styles.frameGlow, { opacity: glowOpacity }]} />
                  ) : null}
                  {mode === 'enroll' ? (
                    <Animated.View
                      style={[
                        styles.setupGlyph,
                        {
                          transform: [
                            {
                              translateX: headMotion.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [-5, 5, -5],
                              }),
                            },
                            {
                              rotate: headMotion.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: ['-4deg', '4deg', '-4deg'],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      <View style={styles.glyphHead}>
                        <View style={styles.glyphEyeLeft} />
                        <View style={styles.glyphEyeRight} />
                        <View style={styles.glyphSmile} />
                      </View>
                      <Animated.View
                        style={[
                          styles.glyphFinger,
                          {
                            transform: [
                              {
                                translateX: headMotion.interpolate({
                                  inputRange: [0, 0.5, 1],
                                  outputRange: [12, -4, 12],
                                }),
                              },
                              {
                                translateY: headMotion.interpolate({
                                  inputRange: [0, 0.5, 1],
                                  outputRange: [-4, -16, -4],
                                }),
                              },
                              { rotate: '-36deg' },
                            ],
                          },
                        ]}
                      />
                    </Animated.View>
                  ) : null}
                </View>
              </>
            )}
          </View>

          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isDone && styles.statusDotDone]}>
              <Ionicons
                name={isDone ? 'checkmark' : mode === 'enroll' ? enrollDirections[stepIndex] : 'scan'}
                size={16}
                color={isDone ? colors.primary : colors.accent}
              />
            </View>
            <Text numberOfLines={2} adjustsFontSizeToFit style={styles.statusText}>
              {steps[stepIndex]}
            </Text>
          </View>

          {mode === 'enroll' ? (
            <View style={styles.helpBox}>
              <Text style={styles.helpText}>
                Tetap di dalam lingkaran sampai semua garis berubah hijau.
              </Text>
            </View>
          ) : (
            <View style={styles.progressTrack}>
              {steps.map((step, index) => (
                <View
                  key={step}
                  style={[styles.progressSegment, index <= stepIndex && styles.progressActive]}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3,6,18,0.74)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 390,
    borderRadius: 34,
    backgroundColor: '#080B18',
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  close: {
    position: 'absolute',
    right: 18,
    top: 18,
    zIndex: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
  },
  title: {
    marginTop: 10,
    color: colors.white,
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 31,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 22,
    color: 'rgba(255,255,255,0.66)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  cameraStage: {
    width: 272,
    height: 272,
    borderRadius: 34,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050607',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraHidden: {
    position: 'absolute',
    width: 272,
    height: 272,
    opacity: 0.01,
  },
  permissionBox: {
    padding: 22,
    alignItems: 'center',
  },
  permissionText: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionBtn: {
    marginTop: 16,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: colors.accent,
  },
  permissionBtnText: {
    color: colors.primary,
    fontWeight: '800',
  },
  outerRing: {
    position: 'absolute',
    width: 198,
    height: 198,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  tickRing: {
    position: 'absolute',
    width: 224,
    height: 224,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringTick: {
    position: 'absolute',
    width: 3,
    height: 14,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.38)',
    transformOrigin: '50% 112px',
  },
  ringDotActive: {
    backgroundColor: '#18F060',
    shadowColor: '#18F060',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  orbitMarker: {
    position: 'absolute',
    zIndex: 3,
    width: 30,
    height: 30,
    marginLeft: -15,
    marginTop: -15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18F060',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#18F060',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
  },
  faceFrame: {
    width: 186,
    height: 220,
    borderRadius: 74,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceFrameEnroll: {
    width: 154,
    height: 154,
    borderRadius: 77,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  frameGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 74,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  scanLine: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '50%',
    height: 3,
    borderRadius: 3,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
  },
  headGuide: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
  },
  setupGlyph: {
    width: 144,
    height: 124,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphHead: {
    width: 70,
    height: 88,
    borderRadius: 34,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphEyeLeft: {
    position: 'absolute',
    top: 30,
    left: 21,
    width: 5,
    height: 13,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  glyphEyeRight: {
    position: 'absolute',
    top: 30,
    right: 21,
    width: 5,
    height: 13,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  glyphSmile: {
    position: 'absolute',
    bottom: 19,
    width: 28,
    height: 13,
    borderBottomWidth: 4,
    borderColor: colors.white,
    borderRadius: 16,
  },
  glyphFinger: {
    position: 'absolute',
    right: 20,
    top: 18,
    width: 28,
    height: 66,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: 'rgba(5,6,7,0.94)',
  },
  headOval: {
    width: 88,
    height: 112,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.95)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  neck: {
    width: 58,
    height: 30,
    marginTop: -2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: 'rgba(255,255,255,0.76)',
  },
  corner: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderColor: colors.white,
  },
  cornerTopLeft: {
    left: 8,
    top: 8,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderTopLeftRadius: 22,
  },
  cornerTopRight: {
    right: 8,
    top: 8,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderTopRightRadius: 22,
  },
  cornerBottomLeft: {
    left: 8,
    bottom: 8,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 22,
  },
  cornerBottomRight: {
    right: 8,
    bottom: 8,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: 22,
  },
  statusRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,169,98,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(201,169,98,0.48)',
  },
  statusDotDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  statusText: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  progressTrack: {
    width: '100%',
    flexDirection: 'row',
    gap: 7,
    marginTop: 20,
  },
  progressSegment: {
    flex: 1,
    height: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  progressActive: {
    backgroundColor: colors.accent,
  },
  helpBox: {
    marginTop: 18,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  helpText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
