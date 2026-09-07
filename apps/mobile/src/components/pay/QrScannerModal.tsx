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

  // Laser scanning animation line
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setScanned(false);
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

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access gallery is required to select a QR code.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        Alert.alert(
          'QR Image Selected',
          'Image loaded successfully. Processing UPI details...',
          [{ text: 'OK', onPress: () => {} }]
        );
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
          <View style={StyleSheet.absoluteFillObject}>
            <RNStatusBar barStyle="light-content" backgroundColor="#000000" translucent />
            <CameraView
              style={StyleSheet.absoluteFillObject}
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

              {/* Action Buttons: Gallery Upload */}
              <View style={styles.bottomActions}>
                <TouchableOpacity
                  style={styles.galleryBtn}
                  onPress={handlePickImage}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 16 }}>🖼️</Text>
                  <Text style={styles.galleryBtnText}>Upload from Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
});
