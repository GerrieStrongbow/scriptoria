import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { createPdf } from 'react-native-images-to-pdf';
import Share from 'react-native-share';
import Feather from 'react-native-vector-icons/Feather';
import {
  IlluminatedButton,
  ManuscriptContainer,
  ManuscriptHeading,
  ParchmentButton,
  ScholarlyText,
  Scriptorium,
  scriptoriaTheme
} from '../components/ScriptoriaComponents';

const DocumentScreen = ({ route, navigation }) => {
  const { document } = route.params;
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    // Handle Android hardware back to go back instead of exiting
    const onBack = () => {
      navigation.goBack();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [navigation]);

  useEffect(() => {
    // Compute image aspect ratio to render full-width with correct height
    const uri = `file://${document.path}`;
    // Image.getSize isn't imported separately; use RN Image API via current import
    Image.getSize(
      uri,
      (w, h) => {
        if (w && h) setAspectRatio(w / h);
      },
      () => { }
    );
  }, [document.path]);

  const shareAsJPG = async () => {
    setShareModalVisible(false);
    try {
      // Debug logging
      console.log('Document object:', JSON.stringify(document, null, 2));
      console.log('Document path:', document?.path);
      console.log('Document name:', document?.name);

      // Check for valid document and path
      if (!document) {
        Alert.alert('Error', 'No document provided');
        return;
      }

      const documentPath = document.path;

      if (!documentPath) {
        Alert.alert('Error', 'Document path is missing');
        return;
      }

      // Verify file exists before sharing
      const fileExists = await require('react-native-fs').exists(documentPath);
      if (!fileExists) {
        Alert.alert('Error', 'Document file not found');
        return;
      }

      // Copy file to a shareable location first
      const RNFS = require('react-native-fs');
      const timestamp = Date.now();
      const sharedFileName = `scanned_doc_${timestamp}.jpg`;
      const sharedPath = `${RNFS.CachesDirectoryPath}/${sharedFileName}`;

      console.log('Copying file for sharing:', documentPath, '->', sharedPath);

      try {
        // Copy to cache directory for sharing
        await RNFS.copyFile(documentPath, sharedPath);
        console.log('File copied successfully');

        // Verify the copied file exists
        const copiedFileExists = await RNFS.exists(sharedPath);
        console.log('Copied file exists:', copiedFileExists);

        if (!copiedFileExists) {
          throw new Error('Failed to copy file for sharing');
        }

        // Share the copied file
        const shareOptions = {
          title: 'Scanned Document',
          message: 'Scanned document from CamScanner',
          url: `file://${sharedPath}`,
          type: 'image/jpeg',
        };

        console.log('Sharing file:', shareOptions);
        await Share.open(shareOptions);

        // Clean up the temporary file after a delay
        setTimeout(() => {
          // Wrap in anonymous function to handle async properly
          (async () => {
            try {
              await RNFS.unlink(sharedPath);
              console.log('Temporary share file cleaned up');
            } catch (cleanupError) {
              console.log('Failed to cleanup temp file:', cleanupError);
            }
          })();
        }, 10000); // 10 seconds delay

      } catch (copyError) {
        // Handle user cancellation without logging errors
        if (copyError?.message?.includes('User did not share')) {
          return;
        }

        // Fallback: try sharing original file directly
        const shareOptions = {
          title: 'Scanned Document',
          url: `file://${documentPath}`,
          type: 'image/jpeg',
        };

        await Share.open(shareOptions);
      }
    } catch (error) {
      if (error?.message?.includes('User did not share')) {
        return;
      }
      Alert.alert('Error', 'Failed to share document. Please try again.');
    }
  };

  const shareAsPDF = async () => {
    setShareModalVisible(false);

    try {
      const RNFS = require('react-native-fs');

      console.log('Converting image to PDF:', document.path);

      // Verify source image exists
      const imageExists = await RNFS.exists(document.path);
      if (!imageExists) {
        throw new Error('Source image not found');
      }

      // Get image stats for debugging
      const imageStat = await RNFS.stat(document.path);
      console.log('Image file size:', imageStat.size, 'bytes');

      // Create PDF from image using react-native-images-to-pdf
      // Use the document's actual name (without extension) + .pdf
      const documentNameWithoutExt = document.name.replace(/\.[^/.]+$/, '');
      const pdfFileName = `${documentNameWithoutExt}.pdf`;
      const outputPath = `${RNFS.CachesDirectoryPath}/${pdfFileName}`;

      console.log('Creating PDF with filename:', pdfFileName);

      // Configure PDF creation options
      const options = {
        pages: [{
          imagePath: document.path,
          // Optional: you can specify width/height if needed
          // width: 595, // A4 width in points
          // height: 842, // A4 height in points
        }],
        outputPath: outputPath,
      };

      // Create the PDF
      const pdfPath = await createPdf(options);

      // Verify PDF file exists
      const pdfExists = await RNFS.exists(pdfPath);

      if (!pdfExists) {
        throw new Error('PDF file was not created successfully');
      }

      // Get PDF file stats for debugging
      const pdfStat = await RNFS.stat(pdfPath);
      // Share the PDF
      const shareOptions = {
        title: 'Scanned Document PDF',
        message: 'Scanned document from CamScanner',
        url: `file://${pdfPath}`,
        type: 'application/pdf',
      };
      await Share.open(shareOptions);

      // Clean up the temporary file after a delay
      setTimeout(() => {
        // Wrap in anonymous function to handle async properly
        (async () => {
          try {
            await RNFS.unlink(pdfPath);
            console.log('Temporary PDF file cleaned up');
          } catch (cleanupError) {
            console.log('Failed to cleanup temp PDF:', cleanupError);
          }
        })();
      }, 10000); // 10 seconds delay

    } catch (error) {
      if (error?.message?.includes('User did not share')) {
        return;
      }
      Alert.alert('Error', 'Failed to create or share PDF. Please try again.');
    }
  };

  return (
    <Scriptorium>
      <StatusBar backgroundColor={scriptoriaTheme.colors.background} barStyle="dark-content" />
      <ManuscriptContainer style={styles.docContainer}>
        {/* Header (no title) */}
        <View style={styles.header}>
          <ParchmentButton style={styles.backButton} onPress={() => navigation.goBack()} textStyle={{ fontFamily: scriptoriaTheme.typography.fonts.sans }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="arrow-left" size={18} color={scriptoriaTheme.colors.deepUmber} style={{ marginRight: 6 }} />
              <ScholarlyText>Library</ScholarlyText>
            </View>
          </ParchmentButton>
          <View style={{ flex: 1 }} />
          <ParchmentButton style={styles.shareButton} onPress={() => setShareModalVisible(true)} textStyle={{ fontFamily: scriptoriaTheme.typography.fonts.sans }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="share-2" size={18} color={scriptoriaTheme.colors.deepUmber} style={{ marginRight: 6 }} />
              <ScholarlyText>Share</ScholarlyText>
            </View>
          </ParchmentButton>
        </View>

        {/* Document Viewer (edge-to-edge) */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          maximumZoomScale={5}
          minimumZoomScale={1}
          pinchGestureEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Image
            source={{ uri: `file://${document.path}` }}
            style={[styles.image, { aspectRatio }]}
            resizeMode="contain"
          />
        </ScrollView>

        {/* Footer with document name (no extension) */}
        <View style={styles.docFooter}>
          <ScholarlyText manuscript style={styles.docName}>
            {document.name.replace(/\.[^/.]+$/, '')}
          </ScholarlyText>
        </View>

        {/* Share Format Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={shareModalVisible}
          onRequestClose={() => setShareModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ManuscriptHeading style={styles.modalTitle}>Share</ManuscriptHeading>
              <ScholarlyText secondary style={styles.modalSubtitle}>
                Choose a format to share
              </ScholarlyText>

              <View style={styles.formatOptions}>
                <IlluminatedButton style={styles.formatButton} onPress={shareAsJPG}>
                  Share as JPG
                </IlluminatedButton>

                <IlluminatedButton style={styles.formatButton} onPress={shareAsPDF}>
                  Share as PDF
                </IlluminatedButton>
              </View>

              <ParchmentButton
                style={styles.cancelModalButton}
                onPress={() => setShareModalVisible(false)}
              >
                Cancel
              </ParchmentButton>
            </View>
          </View>
        </Modal>

        {/* Loading Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isLoading}
        >
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={scriptoriaTheme.colors.primary} />
              <ScholarlyText style={styles.loadingText}>
                Illuminating your manuscript...
              </ScholarlyText>
            </View>
          </View>
        </Modal>
      </ManuscriptContainer>
    </Scriptorium>
  );
};

const styles = StyleSheet.create({
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scriptoriaTheme.spacing.base,
    paddingBottom: scriptoriaTheme.spacing.lg,
  },

  docContainer: {
    paddingBottom: 0,
  },

  backButton: {
    paddingHorizontal: scriptoriaTheme.spacing.sm,
    paddingVertical: scriptoriaTheme.spacing.xs,
    minWidth: 80,
  },

  documentTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: scriptoriaTheme.spacing.sm,
    fontSize: scriptoriaTheme.typography.sizes.lg,
    color: scriptoriaTheme.colors.text.manuscript,
  },

  shareButton: {
    paddingHorizontal: scriptoriaTheme.spacing.sm,
    paddingVertical: scriptoriaTheme.spacing.xs,
  },

  // Document viewer styles

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  image: {
    width: '100%',
  },

  docFooter: {
    paddingVertical: scriptoriaTheme.spacing.base,
    alignItems: 'center',
  },

  docName: {
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    fontSize: scriptoriaTheme.typography.sizes.base,
    color: scriptoriaTheme.colors.text.secondary,
  },

  // Removed parchment border

  // Modal styles - Parchment Inspired
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(47, 47, 47, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: scriptoriaTheme.colors.cardBackground,
    borderRadius: scriptoriaTheme.borderRadius.xl,
    padding: scriptoriaTheme.spacing.xl,
    width: '88%',
    maxWidth: 360,
    shadowColor: scriptoriaTheme.colors.shadowWarm,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: scriptoriaTheme.colors.border,
    borderLeftWidth: 3,
    borderLeftColor: scriptoriaTheme.colors.primary,
  },

  modalTitle: {
    textAlign: 'center',
    marginBottom: scriptoriaTheme.spacing.sm,
    color: scriptoriaTheme.colors.text.manuscript,
  },

  modalSubtitle: {
    textAlign: 'center',
    marginBottom: scriptoriaTheme.spacing.xl,
    fontStyle: 'italic',
  },

  formatOptions: {
    marginBottom: scriptoriaTheme.spacing.lg,
  },

  formatButton: {
    marginBottom: scriptoriaTheme.spacing.sm,
    borderRadius: scriptoriaTheme.borderRadius.base,
  },

  cancelModalButton: {
    borderRadius: scriptoriaTheme.borderRadius.base,
  },

  // Loading modal styles - Illuminated
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(47, 47, 47, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingContent: {
    backgroundColor: scriptoriaTheme.colors.cardBackground,
    borderRadius: scriptoriaTheme.borderRadius.xl,
    padding: scriptoriaTheme.spacing.xl,
    alignItems: 'center',
    minWidth: 240,
    shadowColor: scriptoriaTheme.colors.shadowWarm,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: scriptoriaTheme.colors.border,
    borderTopWidth: 3,
    borderTopColor: scriptoriaTheme.colors.primary,
  },

  loadingText: {
    marginTop: scriptoriaTheme.spacing.base,
    color: scriptoriaTheme.colors.text.secondary,
    textAlign: 'center',
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    fontSize: scriptoriaTheme.typography.sizes.base,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
});

DocumentScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      document: PropTypes.shape({
        path: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default DocumentScreen;
