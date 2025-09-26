import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import Feather from 'react-native-vector-icons/Feather';
import Logger from '../utils/logger';
import RNFS from 'react-native-fs';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  ensureDocumentsDirectory,
  generateUniqueDocumentName,
  getPageFilePath,
  getSinglePageFilePath,
  writeMetadataFile,
} from '../services/documentService';
import type { AppStackParamList } from '../navigation/types';
import { showError, showInfo } from '../utils/feedback';

type ScanScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Scan'>;

type ScanScreenProps = {
  navigation: ScanScreenNavigationProp;
};
import {
  AnnotationText,
  ManuscriptContainer,
  ManuscriptHeading,
  ScholarlyText,
  Scriptorium,
  scriptoriaTheme,
} from '../components/ScriptoriaComponents';

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scannedPages, setScannedPages] = useState<string[]>([]);

  const startScan = () => {
    setScanning(true);
    const scanOptions = {
      letUserAdjustCrop: true,
      maxNumDocuments: 20,
      responseType: 'imageFilePath',
    } as const;

    DocumentScanner.scanDocument(scanOptions as unknown as Parameters<typeof DocumentScanner.scanDocument>[0])
      .then((response: { scannedImages?: string[] }) => {
        if (response.scannedImages && response.scannedImages.length > 0) {
          Logger.debug('ScanScreen', 'Scanned images received:', response.scannedImages.length, 'pages');
          setScannedPages(response.scannedImages);
        } else {
          Logger.debug('ScanScreen', 'No scanned images in response');
          showInfo('Please try again', { title: 'No pages scanned' });
          navigation.goBack();
        }
      })
      .catch((error: unknown) => {
        Logger.error('Scan error:', error);
        showError('Failed to scan document', { title: 'Scan Error' });
        navigation.goBack();
      })
      .finally(() => {
        setScanning(false);
      });
  };

  const saveDocument = async (): Promise<void> => {
    try {
      setProcessing(true);

      await ensureDocumentsDirectory();

      // Generate unique "Untitled Manuscript" base name
      const baseFileName = 'Untitled Manuscript';
      const isMultiPage = scannedPages.length > 1;
      const primaryExtension = scannedPages[0]?.split('.').pop()?.toLowerCase() || 'jpg';
      const baseDocumentName = await generateUniqueDocumentName(baseFileName, {
        isMultiPage,
        extension: primaryExtension,
      });

      Logger.debug('ScanScreen', `Saving ${scannedPages.length} pages for document: ${baseDocumentName}`);

      const savedPages: { path: string; pageNumber: number; extension: string }[] = [];
      for (let i = 0; i < scannedPages.length; i++) {
        const sourcePath = scannedPages[i];

        const sourceExists = await RNFS.exists(sourcePath);
        if (!sourceExists) {
          throw new Error(`Source file not found: ${sourcePath}`);
        }

        const extension = sourcePath.split('.').pop()?.toLowerCase() || 'jpg';
        const destinationPath = isMultiPage
          ? getPageFilePath(baseDocumentName, i + 1, extension)
          : getSinglePageFilePath(baseDocumentName, extension);

        Logger.fileOp('copy', sourcePath, '→', destinationPath);
        await RNFS.copyFile(sourcePath, destinationPath);

        const destExists = await RNFS.exists(destinationPath);
        if (!destExists) {
          throw new Error(`Failed to create destination file: ${destinationPath}`);
        }

        savedPages.push({ path: destinationPath, pageNumber: i + 1, extension });
      }

      if (isMultiPage) {
        await writeMetadataFile(baseDocumentName, {
          documentName: baseDocumentName,
          pageCount: savedPages.length,
          pages: savedPages.map(({ path, pageNumber, extension }) => {
            const nameFromPath = path.split('/').pop();
            const fileName = nameFromPath ?? `${baseDocumentName}_page_${pageNumber}.${extension}`;
            return {
              pageNumber,
              filePath: path,
              fileName,
            };
          }),
          createdAt: new Date().toISOString(),
        });
      }

      // Clean up temp files (only if they still exist)
      for (const imagePath of scannedPages) {
        try {
          const tempExists = await RNFS.exists(imagePath);
          if (tempExists) {
            await RNFS.unlink(imagePath);
            Logger.fileOp('cleanup', imagePath);
          } else {
            Logger.debug('ScanScreen', `Temp file already cleaned up: ${imagePath}`);
          }
        } catch (error) {
          Logger.error('Error deleting temp file:', error);
        }
      }

      showInfo(
        `${scannedPages.length} page${scannedPages.length > 1 ? 's' : ''} saved to your library`,
        {
          title: 'Document saved',
          buttons: [
            {
              text: 'Return to Library',
              onPress: () => navigation.navigate('Home'),
            },
          ],
        },
      );
    } catch (error) {
      Logger.error('Save error:', error);
      showError('Failed to save document');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    startScan();
  }, []);

  useEffect(() => {
    if (scannedPages.length > 0 && !scanning) {
      saveDocument();
    }
  }, [scannedPages, scanning]);

  if (scanning) {
    return (
      <Scriptorium>
        <StatusBar backgroundColor={scriptoriaTheme.colors.background} barStyle="dark-content" />
        <View style={styles.centerContainer}>
          <View style={styles.loadingCard}>
            <Feather name="camera" size={48} color={scriptoriaTheme.colors.primary} style={styles.scanIcon} />
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
            <Feather name="info" size={56} color={scriptoriaTheme.colors.primary} style={styles.instructionIcon} />
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

export default ScanScreen;
