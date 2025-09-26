import React from 'react';
import { StyleSheet, View, type TextStyle } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import {
  AnnotationText,
  DocumentRow,
  MenuButton,
  ScholarlyText,
  scriptoriaTheme,
} from '../ScriptoriaComponents';
import type { DocumentRecord } from '../../services/documentService';

interface DocumentListItemProps {
  document: DocumentRecord;
  onPress: () => void;
  onMenuPress?: (event?: GestureResponderEvent) => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({ document, onPress, onMenuPress }) => {
  const savedTimestamp = document.createdAt ?? document.updatedAt ?? Date.now();

  const handleMenuPress = (event?: GestureResponderEvent) => {
    event?.stopPropagation?.();
    onMenuPress?.(event);
  };

  return (
    <DocumentRow onPress={onPress}>
      <View style={styles.documentContent}>
        <View style={styles.documentInfo}>
          <ScholarlyText manuscript style={styles.documentName}>
            {document.displayName}
            {document.isMultiPage && (
              <AnnotationText> ({document.pageCount} pages)</AnnotationText>
            )}
          </ScholarlyText>
          <AnnotationText>
            Saved on {new Date(savedTimestamp).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </AnnotationText>
        </View>
        <MenuButton onPress={handleMenuPress} />
      </View>
    </DocumentRow>
  );
};

const styles = StyleSheet.create({
  documentContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  } as TextStyle,
});

export default DocumentListItem;
