import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { createPdf } from 'react-native-images-to-pdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Feather from 'react-native-vector-icons/Feather';
import Logger from '../utils/logger';
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
  scriptoriaTheme
} from '../components/ScriptoriaComponents';

const DocumentScreen = ({ route, navigation }) => {
  const { document } = route.params;
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [pages, setPages] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const renameInputRef = useRef(null);

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
    // Load all pages for the document
    const loadDocumentPages = async () => {
      try {
        if (document.isMultiPage && document.allPages) {
          // Multi-page document - use all pages
          const getPageData = (page, index) => {
            return new Promise((resolve) => {
              Image.getSize(
                `file://${page.path}`,
                (w, h) => {
                  resolve({
                    path: page.path,
                    aspectRatio: w / h,
                    pageNumber: page.pageNumber || index + 1
                  });
                },
                () => {
                  resolve({
                    path: page.path,
                    aspectRatio: 1,
                    pageNumber: page.pageNumber || index + 1
                  });
                }
              );
            });
          };
          
          const pageData = await Promise.all(
            document.allPages.map((page, index) => getPageData(page, index))
          );
          const sortedPages = [...pageData].sort((a, b) => a.pageNumber - b.pageNumber);
          setPages(sortedPages);
        } else {
          // Single page document
          Image.getSize(
            `file://${document.path}`,
            (w, h) => {
              setPages([{
                path: document.path,
                aspectRatio: w / h,
                pageNumber: 1
              }]);
            },
            () => {
              setPages([{
                path: document.path,
                aspectRatio: 1,
                pageNumber: 1
              }]);
            }
          );
        }
      } catch (error) {
        Logger.error('Error loading document pages:', error);
        // Fallback to single page
        setPages([{
          path: document.path,
          aspectRatio: 1,
          pageNumber: 1
        }]);
      }
    };

    loadDocumentPages();
  }, [document]);

  const shareAsJPG = async () => {
    setShareModalVisible(false);
    try {
      if (pages.length === 0) {
        Alert.alert('Error', 'No pages to share');
        return;
      }

      if (pages.length === 1) {
        // Single page - share directly
        const documentPath = pages[0].path;
        const fileExists = await RNFS.exists(documentPath);
        if (!fileExists) {
          Alert.alert('Error', 'Document file not found');
          return;
        }

        const timestamp = Date.now();
        const sharedFileName = `scanned_doc_${timestamp}.jpg`;
        const sharedPath = `${RNFS.CachesDirectoryPath}/${sharedFileName}`;

        await RNFS.copyFile(documentPath, sharedPath);

        const shareOptions = {
          title: 'Scanned Document',
          message: 'Scanned document from Scriptoria',
          url: `file://${sharedPath}`,
          type: 'image/jpeg',
        };

        await Share.open(shareOptions);

        // Clean up after delay
        setTimeout(async () => {
          try {
            await RNFS.unlink(sharedPath);
          } catch (cleanupError) {
            Logger.warn('Failed to cleanup temp file:', cleanupError);
          }
        }, 10000);
      } else {
        // Multi-page - create a ZIP file with all pages
        Alert.alert(
          'Multiple Pages',
          `This document has ${pages.length} pages. For multi-page sharing, use PDF format instead.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Share as PDF', onPress: () => { shareAsPDF(); } }
          ]
        );
      }
    } catch (error) {
      if (error?.message?.includes('User did not share')) {
        return;
      }
      Logger.error('Error sharing JPG:', error);
      Alert.alert('Error', 'Failed to share document. Please try again.');
    }
  };

  const shareAsPDF = async () => {
    setShareModalVisible(false);

    try {
      if (pages.length === 0) {
        Alert.alert('Error', 'No pages to create PDF');
        return;
      }

      Logger.debug('DocumentScreen', `Converting ${pages.length} page(s) to PDF`);

      // Verify all pages exist
      for (const page of pages) {
        const pageExists = await RNFS.exists(page.path);
        if (!pageExists) {
          throw new Error(`Page not found: ${page.path}`);
        }
      }

      // Create PDF from all pages
      const documentNameWithoutExt = document.isMultiPage ? document.name : document.name.replace(/\.[^/.]+$/, '');
      const pdfFileName = `${documentNameWithoutExt}.pdf`;
      const outputPath = `${RNFS.CachesDirectoryPath}/${pdfFileName}`;

      Logger.debug('DocumentScreen', 'Creating PDF with filename:', pdfFileName);

      // Configure PDF creation options with all pages
      const options = {
        pages: pages.map(page => ({
          imagePath: page.path,
        })),
        outputPath: outputPath,
      };

      // Create the PDF
      const pdfPath = await createPdf(options);

      // Verify PDF file exists
      const pdfExists = await RNFS.exists(pdfPath);
      if (!pdfExists) {
        throw new Error('PDF file was not created successfully');
      }

      // Share the PDF
      const shareOptions = {
        title: `Scanned Document PDF (${pages.length} page${pages.length > 1 ? 's' : ''})`,
        message: 'Scanned document from Scriptoria',
        url: `file://${pdfPath}`,
        type: 'application/pdf',
      };
      await Share.open(shareOptions);

      // Clean up the temporary file after a delay
      setTimeout(async () => {
        try {
          await RNFS.unlink(pdfPath);
          Logger.debug('DocumentScreen', 'Temporary PDF file cleaned up');
        } catch (cleanupError) {
          Logger.warn('Failed to cleanup temp PDF:', cleanupError);
        }
      }, 10000);

    } catch (error) {
      if (error?.message?.includes('User did not share')) {
        return;
      }
      Logger.error('Error creating PDF:', error);
      Alert.alert('Error', 'Failed to create or share PDF. Please try again.');
    }
  };

  const deleteDocument = async () => {
    const documentName = document.isMultiPage ? document.name : document.name.replace(/\.[^/.]+$/, '');
    const pageText = document.isMultiPage ? ` (${document.pageCount} pages)` : '';
    
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete "${documentName}"${pageText}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (document.isMultiPage && document.allPages) {
                // Delete all pages for multi-page document
                for (const page of document.allPages) {
                  try {
                    await RNFS.unlink(page.path);
                    Logger.fileOp('delete', page.path);
                  } catch (error) {
                    Logger.error(`Error deleting page ${page.path}:`, error);
                  }
                }
                
                // Delete metadata file if it exists
                const metadataPath = `${RNFS.DocumentDirectoryPath}/scanned_documents/${document.name}.metadata.json`;
                try {
                  const metadataExists = await RNFS.exists(metadataPath);
                  if (metadataExists) {
                    await RNFS.unlink(metadataPath);
                    Logger.fileOp('delete', metadataPath);
                  }
                } catch (error) {
                  Logger.error(`Error deleting metadata:`, error);
                }
              } else {
                // Delete single page document
                await RNFS.unlink(document.path);
                Logger.fileOp('delete', document.path);
              }
              
              // Navigate back to home
              navigation.goBack();
            } catch (error) {
              Logger.error('Error deleting document:', error);
              Alert.alert('Error', 'Failed to delete document');
            }
          },
        },
      ]
    );
  };

  const openDropdownMenu = () => {
    setDropdownVisible(true);
  };

  const closeDropdownMenu = () => {
    setDropdownVisible(false);
  };

  const openRenameModal = () => {
    // Extract filename without extension
    const nameWithoutExt = document.isMultiPage ? document.name : document.name.replace(/\.[^/.]+$/, '');
    setNewName(nameWithoutExt);
    setRenameModalVisible(true);
    
    // Focus and select text after modal animation
    setTimeout(() => {
      if (renameInputRef.current) {
        renameInputRef.current.focus();
        renameInputRef.current.setSelection(0, nameWithoutExt.length);
      }
    }, 300);
  };

  const renameDocument = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    try {
      const trimmedNewName = newName.trim();
      const documentsDir = `${RNFS.DocumentDirectoryPath}/scanned_documents`;

      if (document.isMultiPage && document.allPages) {
        // Multi-page document - rename all pages
        Logger.debug('DocumentScreen', `Renaming multi-page document "${document.name}" to "${trimmedNewName}"`);
        
        // Check if any file with new name pattern already exists
        const newPagePath = `${documentsDir}/${trimmedNewName}_page_1.jpg`;
        const exists = await RNFS.exists(newPagePath);
        if (exists && !document.allPages.some(page => page.path === newPagePath)) {
          Alert.alert('Error', 'A document with this name already exists');
          return;
        }

        // Rename all pages
        for (const page of document.allPages) {
          const oldPagePath = page.path;
          const newPagePath = `${documentsDir}/${trimmedNewName}_page_${page.pageNumber}.jpg`;
          
          Logger.fileOp('rename', oldPagePath, '→', newPagePath);
          await RNFS.moveFile(oldPagePath, newPagePath);
        }

        // Rename metadata file if it exists
        const oldMetadataPath = `${documentsDir}/${document.name}.metadata.json`;
        const newMetadataPath = `${documentsDir}/${trimmedNewName}.metadata.json`;
        try {
          const metadataExists = await RNFS.exists(oldMetadataPath);
          if (metadataExists) {
            await RNFS.moveFile(oldMetadataPath, newMetadataPath);
            Logger.fileOp('rename', oldMetadataPath, '→', newMetadataPath);
          }
        } catch (metadataError) {
          Logger.warn('Error renaming metadata file:', metadataError);
        }

      } else {
        // Single page document
        Logger.debug('DocumentScreen', `Renaming single-page document "${document.name}" to "${trimmedNewName}"`);
        
        const fileExtension = document.name.split('.').pop();
        const newFileName = `${trimmedNewName}.${fileExtension}`;
        const newPath = `${documentsDir}/${newFileName}`;

        // Check if file with new name already exists
        const exists = await RNFS.exists(newPath);
        if (exists && newPath !== document.path) {
          Alert.alert('Error', 'A document with this name already exists');
          return;
        }

        // Rename the file
        await RNFS.moveFile(document.path, newPath);
      }

      setRenameModalVisible(false);
      setNewName('');
      
      Logger.debug('DocumentScreen', `Successfully renamed document to "${trimmedNewName}"`);
      
      // Navigate back to home to refresh the list
      navigation.goBack();
      
    } catch (error) {
      Logger.error('Error renaming document:', error);
      Alert.alert('Error', 'Failed to rename document');
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
            <FlatList
              data={pages}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyExtractor={(item, index) => `page-${index}`}
              renderItem={({ item, index }) => (
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
            {document.isMultiPage ? document.name : document.name.replace(/\.[^/.]+$/, '')}
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
                ref={renameInputRef}
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter manuscript title..."
                placeholderTextColor={scriptoriaTheme.colors.text.tertiary}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={renameDocument}
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
                    setNewName('');
                  }}
                >
                  Cancel
                </ParchmentButton>
              </View>
            </View>
          </View>
        </Modal>

        {/* Dropdown Menu */}
        <DropdownMenu
          visible={dropdownVisible}
          onClose={closeDropdownMenu}
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

  // Rename Modal styles
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

  modalButtonsColumn: {
    marginTop: scriptoriaTheme.spacing.sm,
  },

  fullWidthButton: {
    width: '100%',
  },
});

DocumentScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      document: PropTypes.shape({
        path: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        isMultiPage: PropTypes.bool,
        allPages: PropTypes.array,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

export default DocumentScreen;
