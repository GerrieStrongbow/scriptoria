import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import RNFS from 'react-native-fs';
import Feather from 'react-native-vector-icons/Feather';
import {
  AnnotationText,
  ManuscriptContainer,
  ManuscriptHeading,
  ScholarlyText,
  scriptoriaTheme,
  Scriptorium,
} from '../components/ScriptoriaComponents';

const ScanScreen = ({ navigation }) => {
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scannedPages, setScannedPages] = useState([]);

  const documentsDir = `${RNFS.DocumentDirectoryPath}/scanned_documents`;

  const startScan = () => {
    setScanning(true);
    DocumentScanner.scanDocument({
      letUserAdjustCrop: true,
      maxNumDocuments: 20,
      responseType: 'imageFilePath',
    })
      .then((response) => {
        if (response.scannedImages && response.scannedImages.length > 0) {
          setScannedPages(response.scannedImages);
        } else {
          Alert.alert('No pages scanned', 'Please try again');
          navigation.goBack();
        }
      })
      .catch((error) => {
        console.error('Scan error:', error);
        Alert.alert('Scan Error', 'Failed to scan document');
        navigation.goBack();
      })
      .finally(() => {
        setScanning(false);
      });
  };

  const saveDocument = async () => {
    try {
      setProcessing(true);

      // Ensure documents directory exists
      const dirExists = await RNFS.exists(documentsDir);
      if (!dirExists) {
        console.log('Creating documents directory for saving');
        await RNFS.mkdir(documentsDir);
      }

      // Generate readable filename: scan_YYMMDD_HHMM
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const y = String(now.getFullYear()).slice(2);
      const m = pad(now.getMonth() + 1);
      const d = pad(now.getDate());
      const hh = pad(now.getHours());
      const mm = pad(now.getMinutes());
      const formatted = `${y}${m}${d}_${hh}${mm}`;

      // For now, save the first page as the main document
      // In a future version, we'll combine all pages into a PDF
      const mainImagePath = scannedPages[0];
      const fileName = `scan_${formatted}.jpg`;
      const destPath = `${documentsDir}/${fileName}`;

      // Copy the scanned image to documents directory
      await RNFS.copyFile(mainImagePath, destPath);

      // Clean up temp files
      for (const imagePath of scannedPages) {
        try {
          await RNFS.unlink(imagePath);
        } catch (error) {
          console.error('Error deleting temp file:', error);
        }
      }

      Alert.alert(
        'Document saved',
        `${scannedPages.length} page${scannedPages.length > 1 ? 's' : ''} saved to your library`,
        [
          {
            text: 'Return to Library',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save document');
    } finally {
      setProcessing(false);
    }
  };

  React.useEffect(() => {
    startScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (scannedPages.length > 0 && !scanning) {
      saveDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedPages, scanning]);

  if (scanning) {
    return (
      <Scriptorium>
        <StatusBar backgroundColor={scriptoriaTheme.colors.background} barStyle="dark-content" />
        <View style={styles.centerContainer}>
          <View style={styles.loadingCard}>
            <Feather name="camera" size={48} color={scriptoriaTheme.colors.primary} style={styles.scanIconFix} />
            <ActivityIndicator size="large" color={scriptoriaTheme.colors.primary} />
            <ManuscriptHeading style={styles.statusText}>Scanning document</ManuscriptHeading>
            <AnnotationText style={styles.subText}>Position your document within the frame</AnnotationText>
          </View>
        </View>
      </Scriptorium>
    );
  }

  if (processing) {
    return (
      <Scriptorium>
        <StatusBar backgroundColor={scriptoriaTheme.colors.background} barStyle="dark-content" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={scriptoriaTheme.colors.primary} />
        </View>
      </Scriptorium>
    );
  }

  return (
    <Scriptorium>
      <StatusBar backgroundColor={scriptoriaTheme.colors.background} barStyle="dark-content" />
      <ManuscriptContainer>
        <View style={styles.centerContainer}>
          <View style={styles.instructionCard}>
            <Feather name="info" size={56} color={scriptoriaTheme.colors.primary} style={styles.scanIconFix} />
            <ManuscriptHeading style={styles.instructionTitle}>Prepare to scan</ManuscriptHeading>
            <ScholarlyText secondary style={styles.instructionText}>
              Ensure the document is well lit and flat before scanning
            </ScholarlyText>
          </View>
        </View>
      </ManuscriptContainer>
    </Scriptorium>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scriptoriaTheme.spacing.xl,
  },

  // Sacred chamber for illumination ceremonies
  loadingCard: {
    backgroundColor: scriptoriaTheme.colors.cardBackground,
    borderRadius: scriptoriaTheme.borderRadius.xl,
    padding: scriptoriaTheme.spacing['3xl'],
    alignItems: 'center',
    minWidth: 300,
    shadowColor: scriptoriaTheme.colors.shadowWarm,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 2,
    borderColor: scriptoriaTheme.colors.border,
    borderTopWidth: 4,
    borderTopColor: scriptoriaTheme.colors.primary,
    // Manuscript-like texture
    borderLeftWidth: 3,
    borderLeftColor: scriptoriaTheme.colors.accent,
  },

  // Scholarly preparation chamber
  instructionCard: {
    backgroundColor: scriptoriaTheme.colors.cardBackground,
    borderRadius: scriptoriaTheme.borderRadius.xl,
    padding: scriptoriaTheme.spacing.xl,
    alignItems: 'center',
    maxWidth: 340,
    shadowColor: scriptoriaTheme.colors.shadowWarm,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: scriptoriaTheme.colors.border,
    borderLeftWidth: 3,
    borderLeftColor: scriptoriaTheme.colors.primary,
  },

  // Sacred illumination icons
  scanIcon: {
    fontSize: 52,
    marginBottom: scriptoriaTheme.spacing.base,
    color: scriptoriaTheme.colors.primary,
    textShadowColor: scriptoriaTheme.colors.shadowWarm,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  processingIcon: {
    fontSize: 52,
    marginBottom: scriptoriaTheme.spacing.base,
    color: scriptoriaTheme.colors.accent,
    textShadowColor: scriptoriaTheme.colors.shadowWarm,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  instructionIcon: {
    fontSize: 68,
    marginBottom: scriptoriaTheme.spacing.base,
    color: scriptoriaTheme.colors.primary,
    textShadowColor: scriptoriaTheme.colors.shadowWarm,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  // Scholarly text styles
  statusText: {
    textAlign: 'center',
    marginTop: scriptoriaTheme.spacing.base,
    marginBottom: scriptoriaTheme.spacing.sm,
    color: scriptoriaTheme.colors.text.manuscript,
    letterSpacing: 0.5,
  },

  subText: {
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.3,
    lineHeight: scriptoriaTheme.typography.lineHeights.normal * scriptoriaTheme.typography.sizes.sm,
  },

  instructionTitle: {
    textAlign: 'center',
    marginBottom: scriptoriaTheme.spacing.sm,
    color: scriptoriaTheme.colors.text.manuscript,
    letterSpacing: 0.8,
  },

  instructionText: {
    textAlign: 'center',
    lineHeight: scriptoriaTheme.typography.lineHeights.relaxed * scriptoriaTheme.typography.sizes.base,
    letterSpacing: 0.2,
  },
});

ScanScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default ScanScreen;
