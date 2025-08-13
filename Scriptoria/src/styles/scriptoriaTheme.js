// Scriptoria Design System - Scriptorium Theme (per brand spec)
// Warm, scholarly, minimalist — parchment, ink, and gold accents
import { Platform } from 'react-native';

const scriptoriaTheme = {
  // Color System (from spec)
  colors: {
    // Primary accent (Burnished Gold)
    primary: '#C6A664',
    primaryLight: '#D6BC7E',
    primaryDark: '#9E8A48',

    // Core brand neutrals
    inkBlack: '#1E1B18', // Ink Black
    deepUmber: '#4B3621', // Headings / accents
    oliveBrown: '#72634F', // Subtle borders, dividers
    burgundy: '#7A3B3F', // Secondary / selection

    // Surfaces (Parchment)
    background: '#F8F1E7', // Parchment Beige
    surface: '#F3E9DD', // Slightly darker parchment
    cardBackground: '#FFFBF4', // Light paper card
    manuscriptBg: '#FAF4EA', // Manuscript page

    // Text
    text: {
      primary: '#1E1B18', // Ink Black
      secondary: '#4B3621', // Deep Umber
      tertiary: '#72634F', // Olive Brown
      accent: '#C6A664', // Burnished Gold
      manuscript: '#1E1B18',
    },

    // Semantics (kept subtle)
    success: '#2F6D3A',
    warning: '#C6A664',
    error: '#7A3B3F',
    info: '#546A7B',

    // Shadows and rules
    shadow: 'rgba(30, 27, 24, 0.12)',
    shadowWarm: 'rgba(198, 166, 100, 0.18)',
    border: '#D8CBB9', // subtle parchment border
    divider: '#E6D8C7',

    // Parchment tones
    parchment: {
      light: '#FFFBF4',
      medium: '#F3E9DD',
      aged: '#EADFCF',
      vintage: '#E1D4C2',
    },
  },

  // Typography — Serif + Sans pairing (custom-first with platform-safe fallbacks)
  typography: {
    fonts: {
      // If custom fonts are installed (assets/fonts + react-native-asset), these will be used.
      // Otherwise we gracefully fall back to platform defaults.
      serifDisplay: Platform.select({ 
        ios: 'PlayfairDisplay-Regular', 
        android: 'PlayfairDisplay-Regular', 
        default: 'PlayfairDisplay-Regular' 
      }),
      serif: Platform.select({ ios: 'Lora-Regular', android: 'Lora-Regular', default: 'Lora-Regular' }),
      serifElegant: Platform.select({ ios: 'Lora-SemiBold', android: 'Lora-SemiBold', default: 'Lora-SemiBold' }),

      // Sans-serif for functional text
      sans: Platform.select({ ios: 'Inter-Regular', android: 'Inter-Regular', default: 'Inter-Regular' }),

      // Monospace
      mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    },

    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 20,
      xl: 24,
      '2xl': 28,
      '3xl': 34,
      '4xl': 42,
      '5xl': 56,
    },

    weights: {
      light: 300,     // Elegant light text
      normal: 400,    // Standard body text
      medium: 500,    // Emphasis within body
      semibold: 600,  // Strong emphasis, subheadings
      bold: 700,      // Bold headings
      heavy: 800,     // Strong impact text
    },

    lineHeights: {
      tight: 1.25,
      snug: 1.4,
      normal: 1.6,
      relaxed: 1.75,
      loose: 2.0,
    },
  },

  // Spacing system - more refined
  spacing: {
    xs: 4,
    sm: 8,
    base: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 80,
  },

  // Border radius — soft, tactile
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    base: 8,
    md: 10,
    lg: 12,
    xl: 16,
    '2xl': 20,
    full: 9999,
  },

  // Shadows — matte, paper-like
  shadows: {
    none: 'none',
    sm: '0 2px 4px rgba(30, 27, 24, 0.06)',
    base: '0 4px 12px rgba(30, 27, 24, 0.10)',
    lg: '0 8px 24px rgba(30, 27, 24, 0.12)',
    xl: '0 12px 32px rgba(30, 27, 24, 0.14)',
    manuscript: '0 6px 20px rgba(198, 166, 100, 0.16)',
    parchment: '0 3px 10px rgba(114, 99, 79, 0.18)',
  },

  // Component styles
  components: {
    // Primary button — burnished gold
    buttonPrimary: {
      backgroundColor: '#C6A664',
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 28,
      shadowColor: 'rgba(198, 166, 100, 0.28)',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 6,
      elevation: 4,
    },

    // Secondary button — parchment with gold keyline
    buttonSecondary: {
      backgroundColor: '#F3E9DD',
      borderColor: '#C6A664',
      borderWidth: 1.5,
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 28,
    },

    // Manuscript card
    manuscriptCard: {
      backgroundColor: '#FFFBF4',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#D8CBB9',
      shadowColor: 'rgba(30, 27, 24, 0.10)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 4,
      padding: 20,
    },

    // Parchment card
    parchmentCard: {
      backgroundColor: '#FAF4EA',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E6D8C7',
      shadowColor: 'rgba(114, 99, 79, 0.18)',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 3,
      padding: 16,
    },

    // Search bar
    searchBar: {
      backgroundColor: '#F3E9DD',
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderColor: '#D8CBB9',
      borderWidth: 1.5,
      shadowColor: 'rgba(30, 27, 24, 0.08)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 2,
    },

    // Floating action button — gold
    floatingAction: {
      backgroundColor: '#C6A664',
      width: 64,
      height: 64,
      borderRadius: 32,
      shadowColor: 'rgba(198, 166, 100, 0.35)',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 2,
      borderColor: '#D6BC7E',
    },
  },

  // Action icons (emoji placeholders; replace with vector icons later)
  actionIcons: {
    edit: '✒️',
    delete: '🗑️',
    share: '📜',
    folder: '📁',
    document: '📄',
    quill: '🪶',
    manuscript: '📖',
    seal: '🏺',
  },

  // Animation timings
  animations: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

export default scriptoriaTheme;
