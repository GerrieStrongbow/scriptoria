// Styled Components for DocuSnap - Literary Theme
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import theme from '../styles/theme';

const { width } = Dimensions.get('window');

// Typography Components
export const Title = ({ children, style, ...props }) => (
  <Text style={[styles.title, style]} {...props}>
    {children}
  </Text>
);

export const Heading = ({ children, style, ...props }) => (
  <Text style={[styles.heading, style]} {...props}>
    {children}
  </Text>
);

export const BodyText = ({ children, style, secondary, ...props }) => (
  <Text style={[styles.bodyText, secondary && styles.bodyTextSecondary, style]} {...props}>
    {children}
  </Text>
);

export const Caption = ({ children, style, ...props }) => (
  <Text style={[styles.caption, style]} {...props}>
    {children}
  </Text>
);

// Button Components
export const PrimaryButton = ({ children, onPress, style, disabled, ...props }) => (
  <TouchableOpacity
    style={[
      styles.primaryButton,
      disabled && styles.buttonDisabled,
      style
    ]}
    onPress={onPress}
    disabled={disabled}
    {...props}
  >
    <Text style={styles.primaryButtonText}>{children}</Text>
  </TouchableOpacity>
);

export const SecondaryButton = ({ children, onPress, style, disabled, ...props }) => (
  <TouchableOpacity
    style={[
      styles.secondaryButton,
      disabled && styles.buttonDisabled,
      style
    ]}
    onPress={onPress}
    disabled={disabled}
    {...props}
  >
    <Text style={styles.secondaryButtonText}>{children}</Text>
  </TouchableOpacity>
);

// Card Components
export const Card = ({ children, style, ...props }) => (
  <View style={[styles.card, style]} {...props}>
    {children}
  </View>
);

export const DocumentCard = ({ children, onPress, style, ...props }) => (
  <TouchableOpacity
    style={[styles.documentCard, style]}
    onPress={onPress}
    {...props}
  >
    {children}
  </TouchableOpacity>
);

// Input Components
export const SearchInput = ({ placeholder, style, ...props }) => (
  <TextInput
    style={[styles.searchInput, style]}
    placeholder={placeholder}
    placeholderTextColor={theme.colors.text.tertiary}
    {...props}
  />
);

// Layout Components
export const Container = ({ children, style, ...props }) => (
  <View style={[styles.container, style]} {...props}>
    {children}
  </View>
);

export const SafeContainer = ({ children, style, ...props }) => (
  <View style={[styles.safeContainer, style]} {...props}>
    {children}
  </View>
);

export const Section = ({ children, title, style, ...props }) => (
  <View style={[styles.section, style]} {...props}>
    {title && <Heading style={styles.sectionTitle}>{title}</Heading>}
    {children}
  </View>
);

// Floating Action Button (Literary Style)
export const FloatingActionButton = ({ onPress, style, ...props }) => (
  <TouchableOpacity
    style={[styles.fab, style]}
    onPress={onPress}
    {...props}
  >
    <Text style={styles.fabText}>✎</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // Typography Styles
  title: {
    fontFamily: theme.typography.fonts.serifDisplay,
    fontSize: theme.typography.sizes['4xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    letterSpacing: -0.5,
  },
  
  heading: {
    fontFamily: theme.typography.fonts.serif,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeights.tight * theme.typography.sizes.xl,
  },
  
  bodyText: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.normal,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeights.normal * theme.typography.sizes.base,
  },
  
  bodyTextSecondary: {
    color: theme.colors.text.secondary,
  },
  
  caption: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.normal,
    color: theme.colors.text.tertiary,
    lineHeight: theme.typography.lineHeights.normal * theme.typography.sizes.sm,
  },
  
  // Button Styles
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  
  primaryButtonText: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  secondaryButtonText: {
    fontFamily: theme.typography.fonts.sans,
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  
  buttonDisabled: {
    opacity: 0.5,
  },
  
  // Card Styles
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: theme.spacing.xs,
  },
  
  documentCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  
  // Input Styles
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.base,
    fontSize: theme.typography.sizes.base,
    fontFamily: theme.typography.fonts.sans,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  // Layout Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.base,
  },
  
  section: {
    marginBottom: theme.spacing.xl,
  },
  
  sectionTitle: {
    marginBottom: theme.spacing.base,
  },
  
  // Floating Action Button
  fab: {
    position: 'absolute',
    right: theme.spacing.base,
    bottom: 80, // Above bottom navigation
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  
  fabText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export { theme };