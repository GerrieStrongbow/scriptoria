import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  UIManager,
  View,
  type GestureResponderEvent,
} from 'react-native';
import type { ListRenderItem, TextInput } from 'react-native';
import Share from 'react-native-share';
import Feather from 'react-native-vector-icons/Feather';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import Logger from '../utils/logger';
import {
  deleteDocument as deleteDocumentRecord,
  exportDocumentAsPdf,
  exportSinglePageAsImage,
  renameDocument as renameDocumentRecord,
  scheduleTemporaryCleanup,
} from '../services/documentService';
import type { DocumentRecord } from '../services/documentService';
import {
  AnnotationText,
  DropdownMenu,
  IlluminatedButton,
  ManuscriptContainer,
  ManuscriptHeading,
  MenuButton,
  ParchmentButton,
  ScholarlyText,
  Scriptorium,
  scriptoriaTheme,
} from '../components/ScriptoriaComponents';
import type { DropdownAnchorPosition } from '../components/ScriptoriaComponents';
import RenameDocumentModal from '../components/documents/RenameDocumentModal';
import type { AppStackParamList } from '../navigation/types';
import { showConfirmation, showError, showInfo } from '../utils/feedback';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DocumentScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Document'>;
type DocumentScreenRouteProp = RouteProp<AppStackParamList, 'Document'>;

type DocumentScreenProps = {
  navigation: DocumentScreenNavigationProp;
  route: DocumentScreenRouteProp;
};

type DisplayPage = {
  path: string;
  aspectRatio: number;
  pageNumber: number;
};

const DocumentScreen: React.FC<DocumentScreenProps> = ({ route, navigation }) => {
  const { document } = route.params;
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [pages, setPages] = useState<DisplayPage[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownAnchorPosition | null>(null);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const renameInputRef = useRef<TextInput | null>(null);
  const insets = useSafeAreaInsets();
  const closeRenameModal = () => {
    setRenameModalVisible(false);
    setNewName('');
  };

  useEffect(() => {
    const onBackPress = () => {
      navigation.goBack();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [navigation]);


  useEffect(() => {
    const loadDocumentPages = async () => {
      try {
        const sourcePages = document.pages && document.pages.length > 0
          ? document.pages
          : document.primaryPage
            ? [document.primaryPage]
            : [];

        const getPageData = (page: DocumentRecord['pages'][number], index: number): Promise<DisplayPage> =>
          new Promise((resolve) => {
            Image.getSize(
              `file://${page.path}`,
              (w, h) => {
                resolve({
                  path: page.path,
                  aspectRatio: w / h,
                  pageNumber: page.pageNumber || index + 1,
                });
              },
              () => {
                resolve({
                  path: page.path,
                  aspectRatio: 1,
                  pageNumber: page.pageNumber || index + 1,
                });
              },
            );
          });

        const pageData = await Promise.all(sourcePages.map((page, index) => getPageData(page, index)));
        const sortedPages = [...pageData].sort((a, b) => a.pageNumber - b.pageNumber);
        setPages(sortedPages);
      } catch (error) {
        Logger.error('Error loading document pages:', error);
        if (document.primaryPage?.path) {
          const fallbackPage: DisplayPage = {
            path: document.primaryPage.path,
            aspectRatio: 1,
            pageNumber: 1,
          };
          setPages([fallbackPage]);
        }
      }
    };

    loadDocumentPages();
  }, [document]);

  const shareAsJPG = async (): Promise<void> => {
    setShareModalVisible(false);
    try {
      if (pages.length === 0) {
        showError('No pages to share');
        return;
      }

      if (pages.length === 1) {
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
      } else {
        showConfirmation(
          'Multiple Pages',
          `This document has ${pages.length} pages. For multi-page sharing, use PDF format instead.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Share as PDF', onPress: () => { void shareAsPDF(); } },
          ],
        );
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('User did not share')) {
        return;
      }
      Logger.error('Error sharing JPG:', error);
      showError('Failed to share document. Please try again.');
    }
  };

  const shareAsPDF = async (): Promise<void> => {
    setShareModalVisible(false);

    try {
      if (pages.length === 0) {
        showError('No pages to create PDF');
        return;
      }

      Logger.debug('DocumentScreen', `Converting ${pages.length} page(s) to PDF`);

      const pdfPath = await exportDocumentAsPdf(document);

      const shareOptions = {
        title: `Scanned Document PDF (${pages.length} page${pages.length > 1 ? 's' : ''})`,
        message: 'Scanned document from Scriptoria',
        url: `file://${pdfPath}`,
        type: 'application/pdf',
      };
      await Share.open(shareOptions);
      scheduleTemporaryCleanup(pdfPath);
    } catch (error) {
      if (error instanceof Error && error.message.includes('User did not share')) {
        return;
      }
      Logger.error('Error creating PDF:', error);
      showError('Failed to create or share PDF. Please try again.');
    }
  };

  const deleteDocument = async (): Promise<void> => {
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
          onPress: async () => {
            try {
              await deleteDocumentRecord(document);
              navigation.goBack();
            } catch (error) {
              Logger.error('Error deleting document:', error);
              showError('Failed to delete document');
            }
          },
        },
      ],
    );
  };

  const openDropdownMenu = (event?: GestureResponderEvent) => {
    const fallbackTop = event?.nativeEvent?.pageY != null
      ? event.nativeEvent.pageY - scriptoriaTheme.spacing.lg
      : 60 + insets.top;

    const commitPosition = (position: DropdownAnchorPosition) => {
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

          Logger.debug('DocumentScreen', `Dropdown anchor measured -> x: ${x}, y: ${y}, width: ${width}, height: ${height}`);

          commitPosition({ top: estimatedTop, right });
        },
      );

      return;
    }

    Logger.debug('DocumentScreen', `Dropdown anchor fallback top used: ${fallbackTop}`);
    commitPosition({ top: fallbackTop });
  };

  const closeDropdownMenu = () => {
    setDropdownVisible(false);
    setDropdownPosition(null);
  };

  const openRenameModal = () => {
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

  const renameDocument = async (): Promise<void> => {
    if (!newName.trim()) {
      showError('Please enter a valid name');
      return;
    }

    try {
      const trimmedNewName = newName.trim();
      Logger.debug(
        'DocumentScreen',
        `Renaming document \"${document.displayName}\" to \"${trimmedNewName}\"`,
      );

      await renameDocumentRecord(document, trimmedNewName);

      closeRenameModal();

      navigation.goBack();
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        showError('A document with this name already exists');
        return;
      }

      Logger.error('Error renaming document:', error);
      showError('Failed to rename document');
    }
  };

  return (
    <Scriptorium>
      <StatusBar 
        backgroundColor="transparent" 
        barStyle="dark-content" 
        translucent={true}
        animated={true}
      />
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
          <MenuButton onPress={openDropdownMenu} />
        </View>

        {/* Document Viewer */}
        {pages.length > 0 && (
          pages.length === 1 ? (
            // Single page - no scrolling
            <View style={styles.singlePageContainer}>
              <Image
                source={{ uri: `file://${pages[0].path}` }}
                style={[styles.singlePageImage, { aspectRatio: pages[0].aspectRatio }]}
                resizeMode="contain"
              />
            </View>
          ) : (
            // Multi-page - vertical scrolling
            <FlatList<DisplayPage>
              data={pages}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyExtractor={(item, index) => `page-${index}`}
              renderItem={({ item, index }: { item: DisplayPage; index: number }) => (
                <View style={styles.verticalPageContainer}>
                  <Image
                    source={{ uri: `file://${item.path}` }}
                    style={[styles.verticalPageImage, { aspectRatio: item.aspectRatio }]}
                    resizeMode="contain"
                  />
                  {index < pages.length - 1 && <View style={styles.pageSeparator} />}
                </View>
              )}
            />
          )
        )}

        {/* Footer with document name and page indicator */}
        <View style={styles.docFooter}>
          <ScholarlyText manuscript style={styles.docName}>
            {document.displayName}
          </ScholarlyText>
          {pages.length > 1 && (
            <AnnotationText style={styles.pageIndicator}>
              {pages.length} pages • Scroll to view all
            </AnnotationText>
          )}
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

        {/* Rename Modal */}
        <RenameDocumentModal
          visible={renameModalVisible}
          value={newName}
          onChangeText={setNewName}
          onRename={renameDocument}
          onCancel={closeRenameModal}
          inputRef={renameInputRef}
          arrangement="column"
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

        <DropdownMenu
          visible={dropdownVisible}
          onClose={closeDropdownMenu}
          anchorPosition={dropdownPosition ?? undefined}
          options={[
            {
              label: 'Share',
              icon: 'share-2',
              onPress: () => setShareModalVisible(true)
            },
            {
              label: 'Rename',
              icon: 'feather',
              onPress: openRenameModal
            },
            {
              label: 'Delete',
              icon: 'trash-2',
              destructive: true,
              onPress: deleteDocument
            }
          ]}
        />

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
  singlePageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scriptoriaTheme.spacing.base,
    paddingVertical: scriptoriaTheme.spacing.sm,
  },

  singlePageImage: {
    width: '100%',
    maxHeight: '100%',
  },

  verticalPageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scriptoriaTheme.spacing.base,
    paddingVertical: scriptoriaTheme.spacing.sm,
  },

  verticalPageImage: {
    width: '100%',
    minHeight: 200,
    maxHeight: 600,
  },

  pageSeparator: {
    height: scriptoriaTheme.spacing.sm,
    backgroundColor: 'transparent',
  },

  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scriptoriaTheme.spacing.sm,
  },

  image: {
    width: '95%',
    maxHeight: '90%',
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

  pageIndicator: {
    marginTop: scriptoriaTheme.spacing.xs,
    fontSize: scriptoriaTheme.typography.sizes.sm,
    color: scriptoriaTheme.colors.text.tertiary,
    textAlign: 'center',
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

});

export default DocumentScreen;
