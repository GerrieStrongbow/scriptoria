import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import Share from 'react-native-share';
import { createPdf } from 'react-native-images-to-pdf';

const DocumentScreen = ({ route, navigation }) => {
  const { document } = route.params;
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        // Check if user just cancelled sharing
        if (copyError.message === 'User did not share') {
          console.log('User cancelled sharing');
          return;
        }

        console.error('Failed to copy file for sharing:', copyError);

        // Fallback: try sharing original file directly
        console.log('Trying fallback sharing method');
        const shareOptions = {
          title: 'Scanned Document',
          url: `file://${documentPath}`,
          type: 'image/jpeg',
        };

        await Share.open(shareOptions);
      }
    } catch (error) {
      console.error('Share error:', error);

      // Handle user cancellation gracefully
      if (error.message === 'User did not share' || error.message.includes('User did not share')) {
        console.log('User cancelled sharing');
        return;
      }

      // Only show error for actual technical failures
      console.error('Error details:', error.message, error.code);
      Alert.alert('Error', 'Failed to share document. Please try again.');
    }
  };

  const shareAsPDF = async () => {
    setShareModalVisible(false);
    setIsLoading(true);

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
      console.log('Creating PDF at:', outputPath);

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

      console.log('PDF creation options:', JSON.stringify(options, null, 2));

      // Create the PDF
      const pdfPath = await createPdf(options);
      console.log('PDF created successfully at:', pdfPath);

      // Verify PDF file exists
      const pdfExists = await RNFS.exists(pdfPath);
      console.log('PDF file exists:', pdfExists);
      
      if (!pdfExists) {
        throw new Error('PDF file was not created successfully');
      }

      // Get PDF file stats for debugging
      const pdfStat = await RNFS.stat(pdfPath);
      console.log('PDF file size:', pdfStat.size, 'bytes');

      // Share the PDF
      const shareOptions = {
        title: 'Scanned Document PDF',
        message: 'Scanned document from CamScanner',
        url: `file://${pdfPath}`,
        type: 'application/pdf',
      };

      console.log('Sharing PDF with options:', shareOptions);
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
      console.error('PDF share error:', error);

      // Handle user cancellation gracefully
      if (error.message === 'User did not share' || error.message.includes('User did not share')) {
        console.log('User cancelled sharing');
        return;
      }

      Alert.alert('Error', 'Failed to create or share PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => setShareModalVisible(true)}
        >
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        maximumZoomScale={5}
        minimumZoomScale={0.5}
        pinchGestureEnabled={true}
      >
        <Image
          source={{ uri: `file://${document.path}` }}
          style={styles.image}
          resizeMode="contain"
        />
      </ScrollView>

      {/* Share Format Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Format</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={shareAsJPG}
            >
              <Text style={styles.modalButtonText}>Share as Image (JPG)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={shareAsPDF}
            >
              <Text style={styles.modalButtonText}>Share as PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShareModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
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
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Converting to PDF...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#757575',
    borderRadius: 4,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  shareButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginBottom: 12,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#757575',
    marginBottom: 0,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
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
