import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Share from 'react-native-share';

const DocumentScreen = ({ route, navigation }) => {
  const { document } = route.params;

  const shareDocument = async () => {
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
      const documentName = document.name || 'scanned_document.jpg';
      
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
        const fileExists = await RNFS.exists(sharedPath);
        console.log('Copied file exists:', fileExists);
        
        if (!fileExists) {
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
        setTimeout(async () => {
          try {
            await RNFS.unlink(sharedPath);
            console.log('Temporary share file cleaned up');
          } catch (cleanupError) {
            console.log('Failed to cleanup temp file:', cleanupError);
          }
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
          onPress={shareDocument}
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
});

export default DocumentScreen;