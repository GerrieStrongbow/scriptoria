import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type TouchableOpacityProps,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  type EdgeInsets,
  type SafeAreaViewProps,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import scriptoriaTheme from '../styles/scriptoriaTheme';

export { scriptoriaTheme };

// Reusable helpers -----------------------------------------------------------

type WithChildren<Props> = Props & { children?: React.ReactNode };

type RNTextProps = WithChildren<Omit<TextProps, 'style'>> & { style?: StyleProp<TextStyle> };

type RNViewProps = WithChildren<Omit<ViewProps, 'style'>> & { style?: StyleProp<ViewStyle> };

type TouchableProps = WithChildren<Omit<TouchableOpacityProps, 'style'>> & {
  style?: StyleProp<ViewStyle>;
};

// Typography Components ------------------------------------------------------

export const ScriptoriaTitle: React.FC<RNTextProps> = ({ children, style, ...props }) => (
  <Text style={[styles.scriptoriaTitle, style]} {...props}>
    {children}
  </Text>
);

export const ManuscriptHeading: React.FC<RNTextProps> = ({ children, style, ...props }) => (
  <Text style={[styles.manuscriptHeading, style]} {...props}>
    {children}
  </Text>
);

interface ScholarlyTextProps extends RNTextProps {
  secondary?: boolean;
  manuscript?: boolean;
}

export const ScholarlyText: React.FC<ScholarlyTextProps> = ({
  children,
  style,
  secondary,
  manuscript,
  ...props
}) => (
  <Text
    style={[
      styles.scholarlyText,
      secondary ? styles.scholarlyTextSecondary : undefined,
      manuscript ? styles.manuscriptText : undefined,
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

export const AnnotationText: React.FC<RNTextProps> = ({ children, style, ...props }) => (
  <Text style={[styles.annotationText, style]} {...props}>
    {children}
  </Text>
);

// Button Components ----------------------------------------------------------

interface ButtonWithTextProps extends TouchableProps {
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const IlluminatedButton: React.FC<ButtonWithTextProps> = ({
  children,
  style,
  disabled,
  textStyle,
  ...props
}) => (
  <TouchableOpacity
    style={[styles.illuminatedButton, disabled ? styles.buttonDisabled : undefined, style]}
    disabled={disabled}
    {...props}
  >
    <Text style={[styles.illuminatedButtonText, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

export const ParchmentButton: React.FC<ButtonWithTextProps> = ({
  children,
  style,
  disabled,
  textStyle,
  ...props
}) => (
  <TouchableOpacity
    style={[styles.parchmentButton, disabled ? styles.buttonDisabled : undefined, style]}
    disabled={disabled}
    {...props}
  >
    <Text style={[styles.parchmentButtonText, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

// Card Components ------------------------------------------------------------

export const ManuscriptCard: React.FC<RNViewProps> = ({ children, style, ...props }) => (
  <View style={[styles.manuscriptCard, style]} {...props}>
    {children}
  </View>
);

interface DocumentRowProps extends TouchableProps {
  onPress?: (event: GestureResponderEvent) => void;
}

export const DocumentRow: React.FC<DocumentRowProps> = ({ children, style, onPress, ...props }) => (
  <TouchableOpacity style={[styles.documentScroll, style]} onPress={onPress} {...props}>
    {children}
  </TouchableOpacity>
);

export const ParchmentCard: React.FC<RNViewProps> = ({ children, style, ...props }) => (
  <View style={[styles.parchmentCard, style]} {...props}>
    {children}
  </View>
);

// Input Components -----------------------------------------------------------

type ScholarlyInputProps = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  style?: StyleProp<TextStyle>;
  placeholder?: string;
};

export const ScholarlyInput: React.FC<ScholarlyInputProps> = ({ placeholder, style, ...props }) => (
  <TextInput
    style={[styles.scholarlyInput, style]}
    placeholder={placeholder}
    placeholderTextColor={scriptoriaTheme.colors.text.tertiary}
    {...props}
  />
);

// Layout Components ----------------------------------------------------------

type ScriptoriumProps = WithChildren<Omit<SafeAreaViewProps, 'style' | 'edges'>> & {
  style?: StyleProp<ViewStyle>;
};

export const Scriptorium: React.FC<ScriptoriumProps> = ({ children, style, ...props }) => (
  <SafeAreaView
    style={[styles.scriptorium, style]}
    edges={['top', 'left', 'right']}
    {...props}
  >
    {children}
  </SafeAreaView>
);

export const ManuscriptContainer: React.FC<RNViewProps> = ({ children, style, ...props }) => (
  <View style={[styles.manuscriptContainer, style]} {...props}>
    {children}
  </View>
);

interface ChapterProps extends RNViewProps {
  title?: string;
}

export const Chapter: React.FC<ChapterProps> = ({ children, title, style, ...props }) => (
  <View style={[styles.chapter, style]} {...props}>
    {title ? <ManuscriptHeading style={styles.chapterTitle}>{title}</ManuscriptHeading> : null}
    {children}
  </View>
);

// Floating Action Button -----------------------------------------------------

export const QuillButton: React.FC<TouchableProps> = ({ style, children, ...props }) => (
  <TouchableOpacity style={[styles.quillButton, style]} {...props}>
    {children ?? <Feather name="plus" size={28} color="#1E1B18" />}
  </TouchableOpacity>
);

// Action Buttons -------------------------------------------------------------

export const EditAction: React.FC<TouchableProps> = ({ style, ...props }) => (
  <TouchableOpacity style={[styles.actionButton, styles.editAction, style]} {...props}>
    <Feather name="feather" size={18} color={scriptoriaTheme.colors.deepUmber} />
  </TouchableOpacity>
);

export const DeleteAction: React.FC<TouchableProps> = ({ style, ...props }) => (
  <TouchableOpacity style={[styles.actionButton, styles.deleteAction, style]} {...props}>
    <Feather name="trash-2" size={18} color={scriptoriaTheme.colors.burgundy} />
  </TouchableOpacity>
);

export const ShareAction: React.FC<TouchableProps> = ({ style, ...props }) => (
  <TouchableOpacity style={[styles.actionButton, styles.shareAction, style]} {...props}>
    <Feather name="share-2" size={18} color={scriptoriaTheme.colors.primaryDark} />
  </TouchableOpacity>
);

// Dropdown Menu --------------------------------------------------------------

interface DropdownOption {
  label: string;
  icon: string;
  onPress: () => void;
  destructive?: boolean;
}

type DropdownAnchorPosition = Partial<Pick<ViewStyle, 'top' | 'right' | 'bottom' | 'left'>>;

interface DropdownMenuProps extends RNViewProps {
  visible: boolean;
  onClose: () => void;
  options: DropdownOption[];
  anchorPosition?: DropdownAnchorPosition;
  style?: StyleProp<ViewStyle>;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  onClose,
  options,
  anchorPosition,
  style,
  ...props
}) => {
  const insets: EdgeInsets = useSafeAreaInsets();

  const menuPosition: DropdownAnchorPosition = React.useMemo(() => {
    const defaultPosition: DropdownAnchorPosition = { top: 60 + insets.top, right: 16 };

    if (!visible) {
      return defaultPosition;
    }

    const resolvedPosition: DropdownAnchorPosition = { ...defaultPosition, ...anchorPosition };

    if (typeof resolvedPosition.top === 'number') {
      const windowHeight = Dimensions.get('window').height;
      const estimatedOptionHeight = scriptoriaTheme.spacing.sm * 2 + 20;
      const estimatedMenuHeight = options.length * estimatedOptionHeight + scriptoriaTheme.spacing.xs * 2;
      const maxTop = windowHeight - estimatedMenuHeight - scriptoriaTheme.spacing.lg;
      const minTop = insets.top + scriptoriaTheme.spacing.xs;
      resolvedPosition.top = Math.min(Math.max(minTop, resolvedPosition.top), Math.max(minTop, maxTop));
    }

    return resolvedPosition;
  }, [anchorPosition, insets.top, options.length, visible]);

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.dropdownOverlay]} {...props}>
      <TouchableOpacity style={styles.dropdownBackdrop} onPress={onClose} />
      <View style={[styles.dropdownMenu, menuPosition, style]}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={`${option.label}-${index}`}
            style={[
              styles.dropdownOption,
              index === 0 ? styles.dropdownOptionFirst : undefined,
              index === options.length - 1 ? styles.dropdownOptionLast : undefined,
            ]}
            onPress={() => {
              option.onPress();
              onClose();
            }}
          >
            <Feather
              name={option.icon}
              size={20}
              color={option.destructive ? scriptoriaTheme.colors.burgundy : scriptoriaTheme.colors.deepUmber}
              style={styles.dropdownIcon}
            />
            <ScholarlyText
              style={[styles.dropdownText, option.destructive ? styles.dropdownTextDestructive : undefined]}
            >
              {option.label}
            </ScholarlyText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Three-dot Menu Button ------------------------------------------------------

export const MenuButton: React.FC<TouchableProps> = ({ style, ...props }) => (
  <TouchableOpacity style={[styles.menuButton, style]} {...props}>
    <Feather name="more-vertical" size={20} color={scriptoriaTheme.colors.deepUmber} />
  </TouchableOpacity>
);

// Styles ---------------------------------------------------------------------

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
    fontWeight: scriptoriaTheme.typography.weights.semibold as TextStyle['fontWeight'],
    color: scriptoriaTheme.colors.text.manuscript,
    marginBottom: scriptoriaTheme.spacing.sm,
    lineHeight: scriptoriaTheme.typography.lineHeights.snug * scriptoriaTheme.typography.sizes.xl,
    letterSpacing: 0.2,
  },

  scholarlyText: {
    fontFamily: scriptoriaTheme.typography.fonts.sans,
    fontSize: scriptoriaTheme.typography.sizes.base,
    fontWeight: scriptoriaTheme.typography.weights.normal as TextStyle['fontWeight'],
    color: scriptoriaTheme.colors.text.primary,
    lineHeight: scriptoriaTheme.typography.lineHeights.normal * scriptoriaTheme.typography.sizes.base,
    letterSpacing: 0.1,
  },

  scholarlyTextSecondary: {
    color: scriptoriaTheme.colors.text.secondary,
    fontWeight: scriptoriaTheme.typography.weights.light as TextStyle['fontWeight'],
  },

  manuscriptText: {
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    color: scriptoriaTheme.colors.text.manuscript,
    fontWeight: scriptoriaTheme.typography.weights.medium as TextStyle['fontWeight'],
    letterSpacing: 0.15,
  },

  annotationText: {
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    fontSize: scriptoriaTheme.typography.sizes.sm,
    fontWeight: scriptoriaTheme.typography.weights.light as TextStyle['fontWeight'],
    color: scriptoriaTheme.colors.text.tertiary,
    lineHeight: scriptoriaTheme.typography.lineHeights.relaxed * scriptoriaTheme.typography.sizes.sm,
    fontStyle: 'italic',
    letterSpacing: 0.1,
  },

  illuminatedButton: {
    ...scriptoriaTheme.components.buttonPrimary,
    borderWidth: 1,
    borderColor: scriptoriaTheme.colors.primaryLight,
  },

  illuminatedButtonText: {
    fontFamily: scriptoriaTheme.typography.fonts.sans,
    fontSize: scriptoriaTheme.typography.sizes.sm,
    fontWeight: scriptoriaTheme.typography.weights.semibold as TextStyle['fontWeight'],
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
    fontWeight: scriptoriaTheme.typography.weights.semibold as TextStyle['fontWeight'],
    color: scriptoriaTheme.colors.primary,
    letterSpacing: 0.2,
    lineHeight: scriptoriaTheme.typography.lineHeights.snug * scriptoriaTheme.typography.sizes.base,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  manuscriptCard: {
    ...scriptoriaTheme.components.manuscriptCard,
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

  scholarlyInput: {
    ...scriptoriaTheme.components.searchBar,
    fontSize: scriptoriaTheme.typography.sizes.base,
    fontFamily: scriptoriaTheme.typography.fonts.serif,
    color: scriptoriaTheme.colors.text.primary,
    lineHeight: scriptoriaTheme.typography.lineHeights.normal * scriptoriaTheme.typography.sizes.base,
    letterSpacing: 0.1,
  },

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

  quillButton: {
    ...scriptoriaTheme.components.floatingAction,
    justifyContent: 'center',
    alignItems: 'center',
  },

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
  },

  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },

  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  dropdownMenu: {
    position: 'absolute',
    right: 16,
    backgroundColor: scriptoriaTheme.colors.cardBackground,
    borderRadius: scriptoriaTheme.borderRadius.md,
    paddingVertical: scriptoriaTheme.spacing.xs,
    minWidth: 196,
    shadowColor: scriptoriaTheme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: scriptoriaTheme.colors.border,
    zIndex: 1001,
  },

  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scriptoriaTheme.spacing.sm,
    paddingHorizontal: scriptoriaTheme.spacing.base,
  },

  dropdownOptionFirst: {
    borderTopLeftRadius: scriptoriaTheme.borderRadius.md,
    borderTopRightRadius: scriptoriaTheme.borderRadius.md,
  },

  dropdownOptionLast: {
    borderBottomLeftRadius: scriptoriaTheme.borderRadius.md,
    borderBottomRightRadius: scriptoriaTheme.borderRadius.md,
  },

  dropdownIcon: {
    marginRight: scriptoriaTheme.spacing.sm,
  },

  dropdownText: {
    flex: 1,
  },

  dropdownTextDestructive: {
    color: scriptoriaTheme.colors.burgundy,
  },

  menuButton: {
    padding: scriptoriaTheme.spacing.sm,
    borderRadius: scriptoriaTheme.borderRadius.sm,
    backgroundColor: 'transparent',
  },
});

export type { DropdownAnchorPosition, DropdownOption, DropdownMenuProps };
