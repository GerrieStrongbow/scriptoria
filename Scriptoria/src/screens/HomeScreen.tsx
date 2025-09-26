import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  UIManager,
  type GestureResponderEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Share from 'react-native-share';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ListRenderItem, TextInput } from 'react-native';
import Logger from '../utils/logger';
import {
  deleteDocument as deleteDocumentRecord,
  ensureDocumentsDirectory,
  exportDocumentAsPdf,
  exportSinglePageAsImage,
  listDocuments,
  renameDocument as renameDocumentRecord,
  scheduleTemporaryCleanup,
} from '../services/documentService';
import type { DocumentRecord } from '../services/documentService';
import DocumentListItem from '../components/documents/DocumentListItem';
import RenameDocumentModal from '../components/documents/RenameDocumentModal';
import { showConfirmation, showError, showInfo } from '../utils/feedback';
import {
  DropdownMenu,
  ManuscriptContainer,
  ManuscriptHeading,
  QuillButton,
  ScholarlyInput,
  ScholarlyText,
  scriptoriaTheme,
  ScriptoriaTitle,
  Scriptorium,
} from '../components/ScriptoriaComponents';
import type { DropdownAnchorPosition } from '../components/ScriptoriaComponents';
import type { AppStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Home'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentRecord | null>(null);
  const [newName, setNewName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownDocument, setDropdownDocument] = useState<DocumentRecord | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownAnchorPosition | null>(null);
  const renameInputRef = useRef<TextInput | null>(null);
  const closeRenameModal = () => {
    setRenameModalVisible(false);
    setSelectedDocument(null);
    setNewName('');
  };

  const loadDocuments = useCallback(async () => {
    try {
      setRefreshing(true);
      const documentRecords = await listDocuments();
      setDocuments(documentRecords);
      Logger.debug(
        'HomeScreen',
        `Loaded ${documentRecords.length} documents (${documentRecords.filter((doc) => doc.isMultiPage).length} multi-page)`,
      );

      if (documentRecords.length > 0) {
        Logger.debug('HomeScreen', 'First document structure:', documentRecords[0]);
      }
    } catch (error) {
      Logger.error('Error loading documents:', error);
      setDocuments([]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const initializeApp = useCallback(async () => {
    await ensureDocumentsDirectory();
    await loadDocuments();
  }, [loadDocuments]);

  // Debug log the insets
  useEffect(() => {
    Logger.debug('HomeScreen', `Safe area insets - top: ${insets.top}, bottom: ${insets.bottom}, left: ${insets.left}, right: ${insets.right}`);
  }, [insets]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useFocusEffect(
    useCallback(() => {
      loadDocuments();
    }, [loadDocuments]),
  );

  const deleteDocument = (document: DocumentRecord) => {
    const documentName = document.displayName;
    const pageText = document.isMultiPage ? ` (${document.pageCount} pages)` : '';

    showConfirmation(
      'Delete Document',
      `Are you sure you want to delete "${documentName}"${pageText}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            (async () => {
              try {
                await deleteDocumentRecord(document);
                await loadDocuments();
              } catch (error) {
                Logger.error('Error deleting document:', error);
                showError('Failed to delete document');
              }
            })();
          },
        },
      ],
    );
  };

  const openDropdownMenu = (document: DocumentRecord, event?: GestureResponderEvent) => {
    const fallbackTop = event?.nativeEvent?.pageY != null
      ? event.nativeEvent.pageY - scriptoriaTheme.spacing.lg
      : 60 + insets.top;

    const commitPosition = (position: DropdownAnchorPosition) => {
      setDropdownDocument(document);
      setDropdownPosition(position);
      setDropdownVisible(true);
    };

    const target = event?.nativeEvent?.target;

    if (typeof target === 'number') {
      UIManager.measureInWindow(
        target,
        (x, y, width, height) => {
          const windowWidth = Dimensions.get('window').width;
          const margin = scriptoriaTheme.spacing.base;
          const estimatedTop = y + height + scriptoriaTheme.spacing.xs;
          const right = Math.max(margin, windowWidth - (x + width));

          Logger.debug('HomeScreen', `Dropdown anchor measured -> x: ${x}, y: ${y}, width: ${width}, height: ${height}`);

          commitPosition({ top: estimatedTop, right });
        },
      );

      return;
    }

    Logger.debug('HomeScreen', `Dropdown anchor fallback top used: ${fallbackTop}`);
    commitPosition({ top: fallbackTop });
  };

  const closeDropdownMenu = () => {
    setDropdownVisible(false);
    setDropdownDocument(null);
    setDropdownPosition(null);
  };

  const openRenameModal = (document: DocumentRecord) => {
    setSelectedDocument(document);
    setNewName(document.displayName);
    setRenameModalVisible(true);
    
    // Focus and select text after modal animation
    setTimeout(() => {
      renameInputRef.current?.focus();
      renameInputRef.current?.setNativeProps?.({
        selection: { start: 0, end: document.displayName.length },
      });
    }, 300);
  };

  const shareDocument = async (document: DocumentRecord) => {
    try {
      Logger.debug('HomeScreen', 'Sharing document:', document.displayName);

      if (document.isMultiPage) {
        const pdfPath = await exportDocumentAsPdf(document);
        const shareOptions = {
          title: `Scanned Document PDF (${document.pageCount} pages)`,
          message: 'Scanned document from Scriptoria',
          url: `file://${pdfPath}`,
          type: 'application/pdf',
        };

        await Share.open(shareOptions);
        scheduleTemporaryCleanup(pdfPath);
      } else {
        const { sharedPath } = await exportSinglePageAsImage(document.primaryPage, {
          prefix: document.displayName,
        });

        const extension = document.primaryPage.name.split('.').pop()?.toLowerCase();
        const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

        const shareOptions = {
          title: 'Scanned Document',
          message: 'Scanned document from Scriptoria',
          url: `file://${sharedPath}`,
          type: mimeType,
        };

        await Share.open(shareOptions);
        scheduleTemporaryCleanup(sharedPath);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('User did not share')) {
        return;
      }
      Logger.error('Error sharing document:', error);
      showError('Failed to share document. Please try again.');
    }
  };

  const renameDocument = async (): Promise<void> => {
    if (!newName.trim()) {
      showError('Please enter a valid name');
      return;
    }

    if (!selectedDocument) {
      showError('No document selected');
      return;
    }

    try {
      const trimmedNewName = newName.trim();
      Logger.debug(
        'HomeScreen',
        `Renaming document "${selectedDocument.displayName}" to "${trimmedNewName}"`,
      );

      await renameDocumentRecord(selectedDocument, trimmedNewName);

      closeRenameModal();
      loadDocuments();

      Logger.debug('HomeScreen', `Successfully renamed document to "${trimmedNewName}"`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        showError('A document with this name already exists');
        return;
      }

      Logger.error('Error renaming document:', error);
      showError('Failed to rename document');
    }
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(document =>
    document.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDocument: ListRenderItem<DocumentRecord> = ({ item }) => (
    <DocumentListItem
      document={item}
      onPress={() => navigation.navigate('Document', { document: item })}
      onMenuPress={(event) => openDropdownMenu(item, event)}
    />
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
      <StatusBar 
        backgroundColor="transparent" 
        barStyle="dark-content" 
        translucent={true}
        animated={true}
      />
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
          <FlatList<DocumentRecord>
            data={filteredDocuments}
            renderItem={renderDocument}
            keyExtractor={item => item.id}
            refreshing={refreshing}
            onRefresh={loadDocuments}
            ListEmptyComponent={renderEmptyList}
            contentContainerStyle={filteredDocuments.length === 0 ? styles.emptyList : styles.documentsList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Floating Action Button */}
        <QuillButton 
          onPress={() => navigation.navigate('Scan')} 
          style={{ 
            position: 'absolute', 
            right: 16, 
            bottom: Math.max(24, insets.bottom + 24)
          }} 
        />

        {/* Rename Modal */}
        <RenameDocumentModal
          visible={renameModalVisible}
          value={newName}
          onChangeText={setNewName}
          onRename={renameDocument}
          onCancel={closeRenameModal}
          inputRef={renameInputRef}
          arrangement="row"
          inputProps={{
            autoCapitalize: 'words',
            onSubmitEditing: () => {
              void renameDocument();
            },
          }}
          confirmButtonProps={{
            textStyle: { fontSize: scriptoriaTheme.typography.sizes.sm },
          }}
          cancelButtonProps={{
            textStyle: { fontSize: scriptoriaTheme.typography.sizes.sm },
          }}
        />

        {/* Dropdown Menu */}

        {dropdownDocument && (
          <DropdownMenu
            visible={dropdownVisible}
            onClose={closeDropdownMenu}
            anchorPosition={dropdownPosition ?? undefined}
            options={[
              {
                label: 'Share',
                icon: 'share-2',
                onPress: () => shareDocument(dropdownDocument)
              },
              {
                label: 'Rename',
                icon: 'feather',
                onPress: () => openRenameModal(dropdownDocument)
              },
              {
                label: 'Delete',
                icon: 'trash-2',
                destructive: true,
                onPress: () => deleteDocument(dropdownDocument)
              }
            ]}
          />
        )}
      </ManuscriptContainer>
    </Scriptorium>
  );
};

const styles = StyleSheet.create({
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
  documentsSection: {
    flex: 1,
  },
  documentsList: {
    paddingBottom: 80,
  },
  sectionHeading: {
    fontSize: scriptoriaTheme.typography.sizes.lg,
    marginBottom: scriptoriaTheme.spacing.sm,
  },
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
  emptyText: {
    textAlign: 'center',
    marginBottom: scriptoriaTheme.spacing.sm,
    color: scriptoriaTheme.colors.text.primary,
  },
  emptySubtext: {
    textAlign: 'center',
    lineHeight: scriptoriaTheme.typography.lineHeights.relaxed * scriptoriaTheme.typography.sizes.base,
  },
});



export default HomeScreen;
