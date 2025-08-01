import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';

const HomeScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const documentsDir = `${RNFS.DocumentDirectoryPath}/scanned_documents`;

  useEffect(() => {
    createDocumentsDirectory();
    loadDocuments();
  }, []);

  const createDocumentsDirectory = async () => {
    try {
      const exists = await RNFS.exists(documentsDir);
      if (!exists) {
        await RNFS.mkdir(documentsDir);
      }
    } catch (error) {
      console.error('Error creating documents directory:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      setRefreshing(true);
      const files = await RNFS.readDir(documentsDir);
      const documentFiles = files
        .filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png'))
        .sort((a, b) => b.mtime - a.mtime);
      setDocuments(documentFiles);
    } catch (error) {
      console.error('Error loading documents:', error);
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
          onPress: async () => {
            try {
              await RNFS.unlink(filePath);
              loadDocuments();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete document');
            }
          },
        },
      ]
    );
  };

  const renderDocument = ({ item }) => (
    <TouchableOpacity
      style={styles.documentItem}
      onPress={() => navigation.navigate('Document', { document: item })}
      onLongPress={() => deleteDocument(item.path)}
    >
      <View style={styles.documentInfo}>
        <Text style={styles.documentName}>{item.name}</Text>
        <Text style={styles.documentDate}>
          {new Date(item.mtime).toLocaleDateString()}
        </Text>
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
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});

export default HomeScreen;