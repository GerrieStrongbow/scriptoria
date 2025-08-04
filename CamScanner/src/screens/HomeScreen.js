import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import RNFS from 'react-native-fs';

const HomeScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [newName, setNewName] = useState('');

  const documentsDir = `${RNFS.DocumentDirectoryPath}/scanned_documents`;

  useEffect(() => {
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeApp = async () => {
    await createDocumentsDirectory();
    await loadDocuments();
  };

  const createDocumentsDirectory = async () => {
    try {
      const exists = await RNFS.exists(documentsDir);
      if (!exists) {
        console.log('Creating documents directory:', documentsDir);
        await RNFS.mkdir(documentsDir);
      }
    } catch (error) {
      console.error('Error creating documents directory:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      setRefreshing(true);
      // Ensure directory exists before reading
      const dirExists = await RNFS.exists(documentsDir);
      if (!dirExists) {
        console.log('Documents directory does not exist, no documents to load');
        setDocuments([]);
        return;
      }
      
      const files = await RNFS.readDir(documentsDir);
      const documentFiles = files
        .filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png'))
        .sort((a, b) => b.mtime - a.mtime);
      setDocuments(documentFiles);
      console.log(`Loaded ${documentFiles.length} documents`);
      
      // Debug: Log first document to see structure
      if (documentFiles.length > 0) {
        console.log('First document structure:', JSON.stringify(documentFiles[0], null, 2));
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    } finally {
      setRefreshing(false);
    }
  };

  const deleteDocument = async (filePath) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Wrap in anonymous function to handle async properly
            (async () => {
              try {
                await RNFS.unlink(filePath);
                loadDocuments();
              } catch (error) {
                console.error('Error deleting document:', error);
                Alert.alert('Error', 'Failed to delete document');
              }
            })();
          },
        },
      ]
    );
  };

  const openRenameModal = (document) => {
    setSelectedDocument(document);
    // Extract filename without extension
    const nameWithoutExt = document.name.replace(/\.[^/.]+$/, '');
    setNewName(nameWithoutExt);
    setRenameModalVisible(true);
  };

  const renameDocument = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    if (!selectedDocument) {
      Alert.alert('Error', 'No document selected');
      return;
    }

    try {
      const fileExtension = selectedDocument.name.split('.').pop();
      const newFileName = `${newName.trim()}.${fileExtension}`;
      const newPath = `${documentsDir}/${newFileName}`;

      // Check if file with new name already exists
      const exists = await RNFS.exists(newPath);
      if (exists && newPath !== selectedDocument.path) {
        Alert.alert('Error', 'A document with this name already exists');
        return;
      }

      // Rename the file
      await RNFS.moveFile(selectedDocument.path, newPath);
      
      setRenameModalVisible(false);
      setSelectedDocument(null);
      setNewName('');
      loadDocuments();
    } catch (error) {
      console.error('Error renaming document:', error);
      Alert.alert('Error', 'Failed to rename document');
    }
  };

  const renderDocument = ({ item }) => (
    <TouchableOpacity
      style={styles.documentItem}
      onPress={() => navigation.navigate('Document', { document: item })}
    >
      <View style={styles.documentContent}>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName}>{item.name}</Text>
          <Text style={styles.documentDate}>
            {new Date(item.mtime).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.documentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openRenameModal(item)}
          >
            <Text style={styles.actionButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteDocument(item.path)}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No documents scanned yet</Text>
      <Text style={styles.emptySubtext}>
        Tap the button below to scan your first document
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        renderItem={renderDocument}
        keyExtractor={item => item.path}
        refreshing={refreshing}
        onRefresh={loadDocuments}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={documents.length === 0 ? styles.emptyList : null}
      />
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('Scan')}
      >
        <Text style={styles.scanButtonText}>+</Text>
      </TouchableOpacity>
      
      {/* Rename Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={renameModalVisible}
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Document</Text>
            
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new name"
              autoFocus={true}
              selectTextOnFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setRenameModalVisible(false);
                  setSelectedDocument(null);
                  setNewName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={renameDocument}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
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
  documentItem: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  documentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
    marginRight: 8,
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionButtonText: {
    fontSize: 16,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  documentDate: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  scanButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  scanButtonText: {
    fontSize: 32,
    color: 'white',
    fontWeight: '300',
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#757575',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeScreen;