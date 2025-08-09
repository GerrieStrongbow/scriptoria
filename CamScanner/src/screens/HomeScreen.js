import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import RNFS from 'react-native-fs';
import {
  AnnotationText,
  DeleteAction,
  DocumentRow,
  EditAction,
  IlluminatedButton,
  ManuscriptContainer,
  ManuscriptHeading,
  ParchmentButton,
  QuillButton,
  ScholarlyInput,
  ScholarlyText,
  scriptoriaTheme,
  ScriptoriaTitle,
  Scriptorium,
} from '../components/ScriptoriaComponents';

const HomeScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [newName, setNewName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter documents based on search query
  const filteredDocuments = documents.filter(document =>
    document.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDocument = ({ item }) => (
    <DocumentRow onPress={() => navigation.navigate('Document', { document: item })}>
      <View style={styles.documentContent}>
        <View style={styles.documentIcon} />
        <View style={styles.documentInfo}>
          <ScholarlyText manuscript style={styles.documentName}>
            {item.name.replace(/\.[^/.]+$/, '')}
          </ScholarlyText>
          <AnnotationText>
            Saved on {new Date(item.mtime).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </AnnotationText>
        </View>
        <View style={styles.documentActions}>
          <EditAction
            onPress={(e) => {
              e.stopPropagation();
              openRenameModal(item);
            }}
          />
          <DeleteAction
            onPress={(e) => {
              e.stopPropagation();
              deleteDocument(item.path);
            }}
          />
        </View>
      </View>
    </DocumentRow>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <ManuscriptHeading style={styles.emptyText}>Your Library</ManuscriptHeading>
      <ScholarlyText secondary style={styles.emptySubtext}>
        Begin curating your document collection.{'\n'}
        Tap the + button to scan your first document.
      </ScholarlyText>
    </View>
  );

  return (
    <Scriptorium>
      <StatusBar backgroundColor={scriptoriaTheme.colors.background} barStyle="dark-content" />
      <ManuscriptContainer>
        {/* Header */}
        <View style={styles.header}>
          <ScriptoriaTitle style={styles.appTitle}>Scriptoria</ScriptoriaTitle>
          <ScholarlyInput
            placeholder="Search manuscripts"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
          />
        </View>

        {/* Documents Section */}
        <View style={styles.documentsSection}>
          {documents.length > 0 && (
            <ManuscriptHeading style={styles.sectionHeading}>Recent Manuscripts</ManuscriptHeading>
          )}
          <FlatList
            data={filteredDocuments}
            renderItem={renderDocument}
            keyExtractor={item => item.path}
            refreshing={refreshing}
            onRefresh={loadDocuments}
            ListEmptyComponent={renderEmptyList}
            contentContainerStyle={filteredDocuments.length === 0 ? styles.emptyList : styles.documentsList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Floating Action Button */}
        <QuillButton onPress={() => navigation.navigate('Scan')} />

        {/* Rename Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={renameModalVisible}
          onRequestClose={() => setRenameModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ManuscriptHeading style={styles.modalTitle}>Rename Manuscript</ManuscriptHeading>

              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter manuscript title..."
                placeholderTextColor={scriptoriaTheme.colors.text.tertiary}
                autoFocus={true}
                selectTextOnFocus={true}
              />

              <View style={styles.modalButtonsColumn}>
                <IlluminatedButton onPress={renameDocument} style={styles.fullWidthButton} textStyle={{ fontSize: scriptoriaTheme.typography.sizes.sm }}>
                  Rename
                </IlluminatedButton>
                <ParchmentButton
                  style={[styles.fullWidthButton, { marginTop: scriptoriaTheme.spacing.sm }]}
                  textStyle={{ fontSize: scriptoriaTheme.typography.sizes.sm }}
                  onPress={() => {
                    setRenameModalVisible(false);
                    setSelectedDocument(null);
                    setNewName('');
                  }}
                >
                  Cancel
                </ParchmentButton>
              </View>
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
    paddingTop: scriptoriaTheme.spacing.base,
    marginBottom: scriptoriaTheme.spacing.lg,
  },

  appTitle: {
    fontSize: scriptoriaTheme.typography.sizes['3xl'],
    letterSpacing: 0.2,
  },

  searchBar: {
    marginBottom: scriptoriaTheme.spacing.sm,
  },

  // Documents section
  documentsSection: {
    flex: 1,
  },

  documentsList: {
    paddingBottom: 100, // Space for FAB
  },

  sectionHeading: {
    fontSize: scriptoriaTheme.typography.sizes.lg,
    marginBottom: scriptoriaTheme.spacing.sm,
  },

  // Document card content
  documentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  documentIcon: {
    marginRight: scriptoriaTheme.spacing.base,
  },

  documentEmoji: {
    fontSize: 24,
    color: scriptoriaTheme.colors.primary,
  },

  documentInfo: {
    flex: 1,
    marginRight: scriptoriaTheme.spacing.sm,
  },

  documentName: {
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    fontSize: scriptoriaTheme.typography.sizes.sm,
    fontWeight: scriptoriaTheme.typography.weights.medium,
    color: scriptoriaTheme.colors.text.primary,
    marginBottom: scriptoriaTheme.spacing.xs / 2,
  },

  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scriptoriaTheme.spacing.xl,
    paddingVertical: scriptoriaTheme.spacing['3xl'],
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: scriptoriaTheme.spacing.base,
  },

  emptyText: {
    textAlign: 'center',
    marginBottom: scriptoriaTheme.spacing.sm,
    color: scriptoriaTheme.colors.text.primary,
  },

  emptySubtext: {
    textAlign: 'center',
    lineHeight: scriptoriaTheme.typography.lineHeights.relaxed * scriptoriaTheme.typography.sizes.base,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: scriptoriaTheme.colors.cardBackground,
    borderRadius: scriptoriaTheme.borderRadius.lg,
    padding: scriptoriaTheme.spacing.xl,
    width: '85%',
    maxWidth: 340,
    shadowColor: scriptoriaTheme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: scriptoriaTheme.colors.border,
  },

  modalTitle: {
    textAlign: 'center',
    marginBottom: scriptoriaTheme.spacing.lg,
    color: scriptoriaTheme.colors.text.primary,
  },

  input: {
    borderWidth: 1,
    borderColor: scriptoriaTheme.colors.border,
    borderRadius: scriptoriaTheme.borderRadius.base,
    padding: scriptoriaTheme.spacing.base,
    fontSize: scriptoriaTheme.typography.sizes.sm,
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    color: scriptoriaTheme.colors.text.primary,
    marginBottom: scriptoriaTheme.spacing.lg,
    backgroundColor: scriptoriaTheme.colors.surface,
    lineHeight: scriptoriaTheme.typography.lineHeights.normal * scriptoriaTheme.typography.sizes.base,
    letterSpacing: 0.1,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  modalButton: {
    flex: 1,
  },

  modalButtonsColumn: {
    marginTop: scriptoriaTheme.spacing.sm,
  },

  fullWidthButton: {
    width: '100%',
  },
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeScreen;
