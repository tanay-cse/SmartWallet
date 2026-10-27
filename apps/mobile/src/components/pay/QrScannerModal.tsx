import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon, FlashZapIcon } from '../icons/TabIcon';
import { Colors } from '../../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCAN_FRAME_SIZE = 240;

type QrScannerModalProps = {
  visible: boolean;
  onClose: () => void;
  onScanSuccess?: (data: string) => void;
};

export function QrScannerModal({ visible, onClose, onScanSuccess }: QrScannerModalProps) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [customQrText, setCustomQrText] = useState('upi://pay?pa=starbucks@hdfcbank&am=250&pn=Starbucks');

  // Laser scanning animation line
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setScanned(false);
      setShowSimulator(false);
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 44
  );

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    if (onScanSuccess) {
      onScanSuccess(data);
    } else {
      Alert.alert(
        'UPI QR Scanned',
        `Scanned Data:\n${data}`,
        [
          {
            text: 'Scan Again',
            onPress: () => setScanned(false),
          },
          {
            text: 'Proceed to Pay',
            onPress: onClose,
            style: 'default',
          },
        ]
      );
    }
  };

  const handleSimulate = (payload: string) => {
    handleBarcodeScanned({ data: payload });
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access gallery is required to select a QR code.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Simulated decoded QR from picked image
        handleBarcodeScanned({ data: 'upi://pay?pa=merchant.store@icici&am=350&pn=CafeDelhi&cu=INR' });
      }
    } catch (e) {
      Alert.alert('Gallery Error', 'Could not open gallery. Please try again.');
    }
  };

  const laserTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_FRAME_SIZE - 4],
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {!permission ? (
          <View style={[styles.permissionContainer, { paddingTop: topPadding }]}>
            <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />
            <Text style={styles.permissionLoadingText}>Loading camera permission...</Text>
          </View>
        ) : !permission.granted ? (
          <View style={[styles.permissionContainer, { paddingTop: topPadding }]}>
            <RNStatusBar barStyle="dark-content" backgroundColor={Colors.background} translucent />
            
            {/* Header */}
            <View style={styles.permissionHeaderRow}>
              <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
                <ChevronLeftIcon size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.permissionHeaderTitle}>Scan UPI QR</Text>
              <View style={{ width: 38 }} />
            </View>

            <View style={styles.permissionBody}>
              <View style={styles.cameraIconBadge}>
                <Text style={{ fontSize: 36 }}>📷</Text>
              </View>
              <Text style={styles.permissionHeading}>Camera Access Needed</Text>
              <Text style={styles.permissionDesc}>
                To scan any UPI QR code at merchant stores or transfers, SmartWallet requires access to your device camera.
              </Text>

              <TouchableOpacity
                style={styles.grantBtn}
                onPress={requestPermission}
                activeOpacity={0.85}
              >
                <Text style={styles.grantBtnText}>Grant Camera Permission</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.simulateBtn}
                onPress={() => setShowSimulator(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.simulateBtnText}>⚡ Simulate / Test UPI QR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadAltBtn}
                onPress={handlePickImage}
                activeOpacity={0.85}
              >
                <Text style={styles.uploadAltText}>Upload QR from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Working Camera View */
          <View style={StyleSheet.absoluteFill}>
            <RNStatusBar barStyle="light-content" backgroundColor="#000000" translucent />
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              enableTorch={torchOn}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />

            {/* Dark Overlay Mask */}
            <View style={[styles.overlayTop, { height: (SCREEN_HEIGHT - SCAN_FRAME_SIZE) / 2 }]}>
              {/* Top Navigation Row */}
              <View style={[styles.headerRow, { marginTop: topPadding }]}>
                <TouchableOpacity style={styles.iconCircle} onPress={onClose} activeOpacity={0.7}>
                  <ChevronLeftIcon size={22} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Scan any UPI QR</Text>

                <TouchableOpacity
                  style={[styles.iconCircle, torchOn && styles.iconCircleActive]}
                  onPress={() => setTorchOn(!torchOn)}
                  activeOpacity={0.7}
                >
                  <FlashZapIcon size={20} color={torchOn ? '#0F172A' : '#FFFFFF'} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.middleRow}>
              <View style={styles.overlaySide} />
              
              {/* Scan Frame */}
              <View style={styles.scanFrame}>
                {/* 4 Corner Markers in Forest Green Accent */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />

                {/* Animated Laser Line */}
                <Animated.View
                  style={[
                    styles.laserLine,
                    {
                      transform: [{ translateY: laserTranslateY }],
                    },
                  ]}
                />
              </View>

              <View style={styles.overlaySide} />
            </View>

            <View style={styles.overlayBottom}>
              <Text style={styles.hintText}>Point camera at any Bharat / UPI QR</Text>

              {/* Action Buttons: Simulator & Gallery Upload */}
              <View style={styles.bottomActions}>
                <TouchableOpacity
                  style={styles.simulateChipBtn}
                  onPress={() => setShowSimulator(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.simulateChipText}>⚡ Test / Paste QR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.galleryBtn}
                  onPress={handlePickImage}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 16 }}>🖼️</Text>
                  <Text style={styles.galleryBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* QR Simulation Sheet */}
        <Modal
          visible={showSimulator}
          animationType="fade"
          transparent
          onRequestClose={() => setShowSimulator(false)}
        >
          <View style={styles.simOverlay}>
            <View style={styles.simCard}>
              <View style={styles.simHeaderRow}>
                <Text style={styles.simTitle}>⚡ Test UPI QR Payloads</Text>
                <TouchableOpacity onPress={() => setShowSimulator(false)}>
                  <Text style={styles.simClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.simSubtitle}>
                Select a test preset or enter a custom upi://pay URI to test instant parsing:
              </Text>

              {/* Preset Buttons */}
              <View style={styles.presetsList}>
                <TouchableOpacity
                  style={styles.presetItem}
                  onPress={() => {
                    setShowSimulator(false);
                    handleSimulate('upi://pay?pa=starbucks@hdfcbank&am=250&pn=Starbucks&cu=INR');
                  }}
                >
                  <View>
                    <Text style={styles.presetName}>Starbucks (With Amount)</Text>
                    <Text style={styles.presetDetail}>starbucks@hdfcbank • ₹250</Text>
                  </View>
                  <Text style={styles.presetArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetItem}
                  onPress={() => {
                    setShowSimulator(false);
                    handleSimulate('upi://pay?pa=chaipoint@icici&pn=ChaiPoint');
                  }}
                >
                  <View>
                    <Text style={styles.presetName}>Chai Point (No Amount)</Text>
                    <Text style={styles.presetDetail}>chaipoint@icici • Requires manual amount</Text>
                  </View>
                  <Text style={styles.presetArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.presetItem}
                  onPress={() => {
                    setShowSimulator(false);
                    handleSimulate('upi://pay?pa=swiggy@axisbank&am=420&pn=Swiggy&cu=INR');
                  }}
                >
                  <View>
                    <Text style={styles.presetName}>Swiggy Dining (With Amount)</Text>
                    <Text style={styles.presetDetail}>swiggy@axisbank • ₹420</Text>
                  </View>
                  <Text style={styles.presetArrow}>→</Text>
                </TouchableOpacity>
              </View>

              {/* Custom payload input */}
              <Text style={styles.customInputLabel}>Custom UPI Payload:</Text>
              <TextInput
                style={styles.customTextInput}
                value={customQrText}
                onChangeText={setCustomQrText}
                autoCapitalize="none"
                placeholder="upi://pay?pa=..."
                placeholderTextColor={Colors.textMuted}
              />

              <TouchableOpacity
                style={styles.customApplyBtn}
                onPress={() => {
                  setShowSimulator(false);
                  handleSimulate(customQrText);
                }}
              >
                <Text style={styles.customApplyBtnText}>Use Custom Payload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background, // Crisp white
  },
  permissionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: '#FBBF24',
  },
  permissionBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  cameraIconBadge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.forestGreenLight,
    borderWidth: 1,
    borderColor: Colors.forestGreenBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  permissionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  grantBtn: {
    backgroundColor: Colors.forestGreen,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  grantBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  uploadAltBtn: {
    backgroundColor: Colors.surfaceSubtle,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  uploadAltText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  permissionLoadingText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 40,
  },
  overlayTop: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  middleRow: {
    flexDirection: 'row',
    height: SCAN_FRAME_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  scanFrame: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#10B981',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 10,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 10,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 10,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 10,
  },
  laserLine: {
    height: 2.5,
    backgroundColor: '#10B981',
    width: '100%',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    paddingTop: 24,
  },
  hintText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bottomActions: {
    marginTop: 28,
    flexDirection: 'row',
    gap: 16,
  },
  galleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  galleryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  simulateBtn: {
    backgroundColor: Colors.forestGreenLight,
    borderWidth: 1.5,
    borderColor: Colors.forestGreen,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  simulateBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.forestGreen,
  },
  simulateChipBtn: {
    backgroundColor: Colors.forestGreen,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.forestGreenBorder,
    shadowColor: Colors.forestGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  simulateChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  simOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  simCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  simHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  simTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  simClose: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
    padding: 4,
  },
  simSubtitle: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 17,
  },
  presetsList: {
    gap: 8,
    marginBottom: 16,
  },
  presetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  presetName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  presetDetail: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  presetArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.forestGreen,
  },
  customInputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  customTextInput: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 12,
  },
  customApplyBtn: {
    backgroundColor: Colors.forestGreen,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  customApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
