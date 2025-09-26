import React from 'react';
import { Modal, StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import {
  IlluminatedButton,
  ManuscriptHeading,
  ParchmentButton,
  ScholarlyText,
  scriptoriaTheme,
} from '../ScriptoriaComponents';

interface RenameDocumentModalProps {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onRename: () => void | Promise<void>;
  onCancel: () => void;
  inputRef?: React.RefObject<TextInput | null>;
  arrangement?: 'row' | 'column';
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  inputProps?: TextInputProps;
  confirmButtonProps?: Partial<React.ComponentProps<typeof IlluminatedButton>>;
  cancelButtonProps?: Partial<React.ComponentProps<typeof ParchmentButton>>;
}

const RenameDocumentModal: React.FC<RenameDocumentModalProps> = ({
  visible,
  value,
  onChangeText,
  onRename,
  onCancel,
  inputRef,
  arrangement = 'row',
  title = 'Rename Manuscript',
  subtitle,
  confirmLabel = 'Rename',
  cancelLabel = 'Cancel',
  inputProps = {},
  confirmButtonProps = {},
  cancelButtonProps = {},
}) => {
  const { style: confirmStyle, textStyle: confirmTextStyle, ...restConfirmButtonProps } = confirmButtonProps;
  const { style: cancelStyle, textStyle: cancelTextStyle, ...restCancelButtonProps } = cancelButtonProps;

  const isRowLayout = arrangement === 'row';
  const containerStyles: StyleProp<ViewStyle> = [
    styles.modalButtons,
    isRowLayout ? styles.modalButtonsRow : styles.modalButtonsColumn,
  ];
  const confirmButtonStyle: StyleProp<ViewStyle> = [
    styles.fullWidthButton,
    isRowLayout ? styles.rowButtonSpacing : undefined,
    confirmStyle,
  ];
  const cancelButtonStyle: StyleProp<ViewStyle> = [
    styles.fullWidthButton,
    !isRowLayout ? styles.columnButtonSpacing : undefined,
    cancelStyle,
  ];

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ManuscriptHeading style={styles.modalTitle}>{title}</ManuscriptHeading>
          {subtitle ? (
            <ScholarlyText secondary style={styles.modalSubtitle}>
              {subtitle}
            </ScholarlyText>
          ) : null}

          <TextInput
            ref={inputRef}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder="Enter manuscript title..."
            placeholderTextColor={scriptoriaTheme.colors.text.tertiary}
            returnKeyType="done"
            {...inputProps}
          />

          <View style={containerStyles}>
            <IlluminatedButton
              onPress={onRename}
              style={confirmButtonStyle}
              textStyle={confirmTextStyle}
              {...restConfirmButtonProps}
            >
              {confirmLabel}
            </IlluminatedButton>
            <ParchmentButton
              onPress={onCancel}
              style={cancelButtonStyle}
              textStyle={cancelTextStyle}
              {...restCancelButtonProps}
            >
              {cancelLabel}
            </ParchmentButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scriptoriaTheme.spacing.base,
  },
  modalContent: {
    backgroundColor: scriptoriaTheme.colors.cardBackground,
    borderRadius: scriptoriaTheme.borderRadius.lg,
    padding: scriptoriaTheme.spacing.xl,
    width: '100%',
    maxWidth: 360,
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
    marginBottom: scriptoriaTheme.spacing.md,
    color: scriptoriaTheme.colors.text.primary,
  },
  modalSubtitle: {
    textAlign: 'center',
    marginBottom: scriptoriaTheme.spacing.lg,
    color: scriptoriaTheme.colors.text.secondary,
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
    width: '100%',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalButtonsColumn: {
    flexDirection: 'column',
  },
  fullWidthButton: {
    flex: 1,
  },
  rowButtonSpacing: {
    marginRight: scriptoriaTheme.spacing.sm,
  },
  columnButtonSpacing: {
    marginTop: scriptoriaTheme.spacing.sm,
  },
});

export default RenameDocumentModal;
