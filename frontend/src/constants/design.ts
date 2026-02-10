// Design System Constants - Paperback Theme
export const DESIGN = {
  // Spacing - Consistent 8px grid system
  spacing: {
    xs: '0.5rem', // 8px
    sm: '1rem', // 16px
    md: '1.5rem', // 24px
    lg: '2rem', // 32px
    xl: '3rem', // 48px
    '2xl': '4rem', // 64px
  },
  
  // Typography
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem', // 32px
    '4xl': '2.5rem', // 40px
  },
  
  // Border Radius - Paperback style
  radius: {
    none: '0',
    sm: '0.25rem', // 4px - subtle corners
    md: '0.5rem', // 8px - card corners
    lg: '0.75rem', // 12px - larger elements
  },
  
  // Shadows - Subtle, paper-like
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    paper: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
  },
  
  // Layout
  maxWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Grid gaps
  gap: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  },
} as const;

// Color tokens - Neutral paperback palette
export const COLORS = {
  background: {
    primary: 'hsl(0 0% 100%)', // Pure white - paper
    secondary: 'hsl(0 0% 98%)', // Off-white
    tertiary: 'hsl(0 0% 96%)', // Light gray
  },
  text: {
    primary: 'hsl(0 0% 9%)', // Near black
    secondary: 'hsl(0 0% 35%)', // Dark gray
    tertiary: 'hsl(0 0% 55%)', // Medium gray
    muted: 'hsl(0 0% 70%)', // Light gray
  },
  border: {
    light: 'hsl(0 0% 90%)',
    medium: 'hsl(0 0% 80%)',
    dark: 'hsl(0 0% 70%)',
  },
  accent: {
    primary: 'hsl(222 47% 11%)', // Dark blue
    secondary: 'hsl(215 16% 47%)', // Slate
  },
} as const;

// Animation durations
export const ANIMATION = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
} as const;

// Z-index scale
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;
