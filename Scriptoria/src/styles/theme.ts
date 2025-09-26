// Scriptoria Design System - Warm Literary Theme
// Inspired by creative writing, paper, and stationery

const theme = {
  // Primary Colors - Warm Orange Palette (Claude-inspired)
  colors: {
    // Primary warm oranges
    primary: '#D97706',        // Rich amber - main brand color
    accent: '#D97706',
    primaryLight: '#F59E0B',   // Lighter amber for highlights
    primaryDark: '#92400E',    // Deep amber for depth
    
    // Secondary warm tones
    secondary: '#DC2626',      // Warm red for accents (like red ink)
    tertiary: '#7C2D12',       // Rich brown for elegance
    
    // Paper-inspired neutrals
    background: '#FFFBEB',     // Warm cream paper
    surface: '#FEF7ED',        // Slightly warmer white
    cardBackground: '#FFFFFF', // Pure white for cards
    
    // Typography colors
    text: {
      primary: '#1F2937',     // Deep charcoal for body text
      secondary: '#6B7280',   // Medium gray for secondary text
      tertiary: '#9CA3AF',    // Light gray for hints
      accent: '#D97706',      // Orange for links/accents
    },
    
    // Semantic colors
    success: '#059669',       // Forest green (like approval stamp)
    warning: '#D97706',       // Amber (consistent with brand)
    error: '#DC2626',         // Warm red
    info: '#2563EB',          // Classic blue
    
    // Shadows and borders
    shadow: 'rgba(0, 0, 0, 0.1)',
    border: '#E5E7EB',
    divider: '#F3F4F6',
  },
  
  // Typography - Serif for literary feel
  typography: {
    fonts: {
      // Primary serif font for headings and important text
      serif: 'Lora, serif',           // Elegant, readable serif
      serifDisplay: 'Playfair Display, serif', // More decorative for titles
      
      // Sans-serif for UI elements and body text where needed
      sans: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      
      // Monospace for technical elements
      mono: 'JetBrains Mono, Consolas, monospace',
    },
    
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    } as const,
    
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },
  
  // Spacing system
  spacing: {
    xs: 4,
    sm: 8,
    base: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  // Border radius - slightly more organic
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  // Shadows - soft, paper-like
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    base: '0 2px 8px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    paper: '0 4px 16px rgba(217, 119, 6, 0.1)', // Warm shadow
  },
  
  // Component-specific styles
  components: {
    button: {
      primary: {
        backgroundColor: '#D97706',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
      },
      secondary: {
        backgroundColor: '#FEF7ED',
        borderColor: '#D97706',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
      },
    },
    
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 3,
      padding: 16,
    },
    
    searchBar: {
      backgroundColor: '#FEF7ED',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderColor: '#FDE68A',
      borderWidth: 1,
    },
  },
};

export default theme;
export type WarmTheme = typeof theme;
