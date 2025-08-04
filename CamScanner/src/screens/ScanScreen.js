import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import DocumentScanner from 'react-native-document-scanner-plugin';
import RNFS from 'react-native-fs';

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

      const timestamp = new Date().getTime();
      
      // For now, save the first page as the main document
      // In a future version, we'll combine all pages into a PDF
      const mainImagePath = scannedPages[0];
      const fileName = `scan_${timestamp}.jpg`;
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
        'Success',
        `Document saved successfully (${scannedPages.length} pages)`,
        [
          {
            text: 'OK',
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.statusText}>Scanning document...</Text>
      </View>
    );
  }

  if (processing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.statusText}>Processing document...</Text>
        <Text style={styles.subText}>
          {scannedPages.length} page(s) scanned
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        Follow the on-screen instructions to scan your document
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    marginTop: 16,
    fontSize: 18,
    color: '#333',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
});

ScanScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default ScanScreen;