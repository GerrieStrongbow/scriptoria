// Scriptoria Styled Components - Medieval Manuscript Theme
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import scriptoriaTheme from '../styles/scriptoriaTheme';

// Typography Components with Medieval Styling
export const ScriptoriaTitle = ({ children, style, ...props }) => (
  <Text style={[styles.scriptoriaTitle, style]} {...props}>
    {children}
  </Text>
);

export const ManuscriptHeading = ({ children, style, ...props }) => (
  <Text style={[styles.manuscriptHeading, style]} {...props}>
    {children}
  </Text>
);

export const ScholarlyText = ({ children, style, secondary, manuscript, ...props }) => (
  <Text style={[
    styles.scholarlyText,
    secondary && styles.scholarlyTextSecondary,
    manuscript && styles.manuscriptText,
    style
  ]} {...props}>
    {children}
  </Text>
);

export const AnnotationText = ({ children, style, ...props }) => (
  <Text style={[styles.annotationText, style]} {...props}>
    {children}
  </Text>
);

// Button Components - Elegant Medieval Style
export const IlluminatedButton = ({ children, onPress, style, disabled, textStyle, ...props }) => (
  <TouchableOpacity
    style={[
      styles.illuminatedButton,
      disabled && styles.buttonDisabled,
      style
    ]}
    onPress={onPress}
    disabled={disabled}
    {...props}
  >
    <Text style={[styles.illuminatedButtonText, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

export const ParchmentButton = ({ children, onPress, style, disabled, textStyle, ...props }) => (
  <TouchableOpacity
    style={[
      styles.parchmentButton,
      disabled && styles.buttonDisabled,
      style
    ]}
    onPress={onPress}
    disabled={disabled}
    {...props}
  >
    <Text style={[styles.parchmentButtonText, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

// Card Components - Manuscript Inspired
export const ManuscriptCard = ({ children, style, ...props }) => (
  <View style={[styles.manuscriptCard, style]} {...props}>
    {children}
  </View>
);

export const DocumentRow = ({ children, onPress, style, ...props }) => (
  <TouchableOpacity style={[styles.documentScroll, style]} onPress={onPress} {...props}>
    {children}
  </TouchableOpacity>
);

export const ParchmentCard = ({ children, style, ...props }) => (
  <View style={[styles.parchmentCard, style]} {...props}>
    {children}
  </View>
);

// Input Components - Scholarly Style
export const ScholarlyInput = ({ placeholder, style, ...props }) => (
  <TextInput
    style={[styles.scholarlyInput, style]}
    placeholder={placeholder}
    placeholderTextColor={scriptoriaTheme.colors.text.tertiary}
    {...props}
  />
);

// Layout Components
export const Scriptorium = ({ children, style, ...props }) => (
  <View style={[styles.scriptorium, style]} {...props}>
    {children}
  </View>
);

export const ManuscriptContainer = ({ children, style, ...props }) => (
  <View style={[styles.manuscriptContainer, style]} {...props}>
    {children}
  </View>
);

export const Chapter = ({ children, title, style, ...props }) => (
  <View style={[styles.chapter, style]} {...props}>
    {title && <ManuscriptHeading style={styles.chapterTitle}>{title}</ManuscriptHeading>}
    {children}
  </View>
);

// Floating Action Button - Quill Inspired
export const QuillButton = ({ onPress, style, ...props }) => (
  <TouchableOpacity
    style={[styles.quillButton, style]}
    onPress={onPress}
    {...props}
  >
    <Feather name="plus" size={28} color="#1E1B18" />
  </TouchableOpacity>
);

// Action Buttons - Elegant and Sophisticated
export const EditAction = ({ onPress, style, ...props }) => (
  <TouchableOpacity style={[styles.actionButton, styles.editAction, style]} onPress={onPress} {...props}>
    <Feather name="feather" size={18} color={scriptoriaTheme.colors.deepUmber} />
  </TouchableOpacity>
);

export const DeleteAction = ({ onPress, style, ...props }) => (
  <TouchableOpacity style={[styles.actionButton, styles.deleteAction, style]} onPress={onPress} {...props}>
    <Feather name="trash-2" size={18} color={scriptoriaTheme.colors.burgundy} />
  </TouchableOpacity>
);

export const ShareAction = ({ onPress, style, ...props }) => (
  <TouchableOpacity style={[styles.actionButton, styles.shareAction, style]} onPress={onPress} {...props}>
    <Feather name="share-2" size={18} color={scriptoriaTheme.colors.primaryDark} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // Typography Styles - Modern Sophisticated Serif
  scriptoriaTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: scriptoriaTheme.typography.sizes['4xl'],
    color: scriptoriaTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: scriptoriaTheme.spacing.lg,
    letterSpacing: -0.5,
    lineHeight: scriptoriaTheme.typography.lineHeights.tight * scriptoriaTheme.typography.sizes['4xl'],
    textShadowColor: scriptoriaTheme.colors.shadowWarm,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  manuscriptHeading: {
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    fontSize: scriptoriaTheme.typography.sizes.xl,
    fontWeight: scriptoriaTheme.typography.weights.semibold,
    color: scriptoriaTheme.colors.text.manuscript,
    marginBottom: scriptoriaTheme.spacing.sm,
    lineHeight: scriptoriaTheme.typography.lineHeights.snug * scriptoriaTheme.typography.sizes.xl,
    letterSpacing: 0.2,
  },

  scholarlyText: {
    fontFamily: scriptoriaTheme.typography.fonts.sans,
    fontSize: scriptoriaTheme.typography.sizes.base,
    fontWeight: scriptoriaTheme.typography.weights.normal,
    color: scriptoriaTheme.colors.text.primary,
    lineHeight: scriptoriaTheme.typography.lineHeights.normal * scriptoriaTheme.typography.sizes.base,
    letterSpacing: 0.1,
  },

  scholarlyTextSecondary: {
    color: scriptoriaTheme.colors.text.secondary,
    fontWeight: scriptoriaTheme.typography.weights.light,
  },

  manuscriptText: {
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    color: scriptoriaTheme.colors.text.manuscript,
    fontWeight: scriptoriaTheme.typography.weights.medium,
    letterSpacing: 0.15,
  },

  annotationText: {
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    fontSize: scriptoriaTheme.typography.sizes.sm,
    fontWeight: scriptoriaTheme.typography.weights.light,
    color: scriptoriaTheme.colors.text.tertiary,
    lineHeight: scriptoriaTheme.typography.lineHeights.relaxed * scriptoriaTheme.typography.sizes.sm,
    fontStyle: 'italic',
    letterSpacing: 0.1,
  },

  // Button Styles - Illuminated Manuscript Inspired
  illuminatedButton: {
    ...scriptoriaTheme.components.buttonPrimary,
    borderWidth: 1,
    borderColor: scriptoriaTheme.colors.primaryLight,
  },

  illuminatedButtonText: {
    fontFamily: scriptoriaTheme.typography.fonts.sans,
    fontSize: scriptoriaTheme.typography.sizes.sm,
    fontWeight: scriptoriaTheme.typography.weights.semibold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
    lineHeight: scriptoriaTheme.typography.lineHeights.snug * scriptoriaTheme.typography.sizes.base,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  parchmentButton: {
    ...scriptoriaTheme.components.buttonSecondary,
    shadowColor: scriptoriaTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },

  parchmentButtonText: {
    fontFamily: scriptoriaTheme.typography.fonts.sans,
    fontSize: scriptoriaTheme.typography.sizes.sm,
    fontWeight: scriptoriaTheme.typography.weights.semibold,
    color: scriptoriaTheme.colors.primary,
    letterSpacing: 0.2,
    lineHeight: scriptoriaTheme.typography.lineHeights.snug * scriptoriaTheme.typography.sizes.base,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  // Card Styles - Manuscript Pages
  manuscriptCard: {
    ...scriptoriaTheme.components.manuscriptCard,
    // Add subtle parchment texture effect
    borderLeftWidth: 3,
    borderLeftColor: scriptoriaTheme.colors.primary,
  },

  documentScroll: {
    ...scriptoriaTheme.components.manuscriptCard,
    borderLeftWidth: 3,
    borderLeftColor: scriptoriaTheme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },

  parchmentCard: {
    ...scriptoriaTheme.components.parchmentCard,
  },

  // Input Styles - Scholar's Desk
  scholarlyInput: {
    ...scriptoriaTheme.components.searchBar,
    fontSize: scriptoriaTheme.typography.sizes.base,
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    color: scriptoriaTheme.colors.text.primary,
    lineHeight: scriptoriaTheme.typography.lineHeights.normal * scriptoriaTheme.typography.sizes.base,
    letterSpacing: 0.1,
  },

  // Layout Styles
  scriptorium: {
    flex: 1,
    backgroundColor: scriptoriaTheme.colors.background,
  },

  manuscriptContainer: {
    flex: 1,
    backgroundColor: scriptoriaTheme.colors.background,
    paddingHorizontal: scriptoriaTheme.spacing.base,
  },

  chapter: {
    marginBottom: scriptoriaTheme.spacing.xl,
  },

  chapterTitle: {
    marginBottom: scriptoriaTheme.spacing.base,
  },

  // Floating Action Button - Quill
  quillButton: {
    ...scriptoriaTheme.components.floatingAction,
    position: 'absolute',
    right: scriptoriaTheme.spacing.base,
    bottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quillIcon: {
    fontSize: 28,
    fontWeight: '400',
    color: '#1E1B18',
    textShadowColor: 'rgba(198, 166, 100, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Action Buttons - Sophisticated Icons
  actionButton: {
    padding: scriptoriaTheme.spacing.sm,
    marginHorizontal: scriptoriaTheme.spacing.xs,
    borderRadius: scriptoriaTheme.borderRadius.sm,
    backgroundColor: scriptoriaTheme.colors.surface,
    borderWidth: 1,
    borderColor: scriptoriaTheme.colors.border,
    shadowColor: scriptoriaTheme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },

  editAction: {
    backgroundColor: scriptoriaTheme.colors.parchment.light,
    borderColor: scriptoriaTheme.colors.accent,
  },

  deleteAction: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },

  shareAction: {
    backgroundColor: scriptoriaTheme.colors.parchment.medium,
    borderColor: scriptoriaTheme.colors.primaryLight,
  },

  actionIcon: {
    fontSize: 18,
  },
});

export { scriptoriaTheme };
