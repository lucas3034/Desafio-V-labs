import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    line-height: 1.6;
    color: ${props => props.theme.colors.gray800};
    background: ${props => props.theme.colors.background};
    font-weight: ${props => props.theme.typography.fontWeight.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
    color: inherit;
    transition: ${props => props.theme.transitions.fast};
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
    transition: ${props => props.theme.transitions.normal};
  }

  input, textarea, select {
    outline: none;
    font-family: inherit;
    transition: ${props => props.theme.transitions.fast};
  }

  ul, ol {
    list-style: none;
  }

  /* Scrollbar customization */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.gray100};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray300};
    border-radius: ${props => props.theme.borderRadius.full};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.gray400};
  }
`;

export const theme = {
  colors: {
    primary: '#6366f1',
    primaryLight: '#8b5cf6',
    primaryDark: '#4f46e5',
    primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: '#64748b',
    success: '#10b981',
    successLight: '#34d399',
    error: '#ef4444',
    errorLight: '#f87171',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    white: '#ffffff',
    background: '#f8fafc',
    surface: '#ffffff',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    accent: '#06b6d4',
    accentLight: '#22d3ee'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    xxl: '1.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
    glowSuccess: '0 0 0 3px rgba(16, 185, 129, 0.1)',
    glowError: '0 0 0 3px rgba(239, 68, 68, 0.1)'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.2s ease',
    slow: '0.3s ease'
  },
  typography: {
    fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace"
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  }
};

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0 ${props => props.theme.spacing.sm};
  }
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.lg};
  padding: ${props => props.theme.spacing.xl};
  border: 1px solid ${props => props.theme.colors.gray100};
  transition: ${props => props.theme.transitions.normal};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    opacity: 0;
    transition: ${props => props.theme.transitions.normal};
  }

  &:hover {
    box-shadow: ${props => props.theme.shadows.xl};
    transform: translateY(-2px);
    
    &::before {
      opacity: 1;
    }
  }

  ${props => props.featured && `
    &::before {
      opacity: 1;
    }
    box-shadow: ${props.theme.shadows.xl};
  `}

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.lg};
  }
`;

export const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth', 'icon'].includes(prop),
})`
  position: relative;
  background: ${props => {
    switch (props.variant) {
      case 'secondary':
        return props.theme.colors.white;
      case 'danger':
        return props.theme.colors.error;
      case 'success':
        return props.theme.colors.success;
      case 'gradient':
        return props.theme.colors.primaryGradient;
      default:
        return props.theme.colors.primary;
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'secondary':
        return props.theme.colors.gray700;
      default:
        return props.theme.colors.white;
    }
  }};
  border: ${props => props.variant === 'secondary' ? `1px solid ${props.theme.colors.gray300}` : 'none'};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: all ${props => props.theme.transitions.normal};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  box-shadow: ${props => props.theme.shadows.sm};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.lg};
    background: ${props => {
      switch (props.variant) {
        case 'secondary':
          return props.theme.colors.gray50;
        case 'danger':
          return props.theme.colors.errorLight;
        case 'success':
          return props.theme.colors.successLight;
        default:
          return props.theme.colors.primaryDark;
      }
    }};

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${props => props.theme.shadows.sm};
  }

  &:focus {
    box-shadow: ${props => {
      switch (props.variant) {
        case 'danger':
          return props.theme.shadows.glowError;
        case 'success':
          return props.theme.shadows.glowSuccess;
        default:
          return props.theme.shadows.glow;
      }
    }};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: ${props => props.theme.shadows.sm};
    }
  }

  ${props => props.size === 'small' && `
    padding: ${props.theme.spacing.xs} ${props.theme.spacing.md};
    font-size: ${props.theme.typography.fontSize.xs};
  `}

  ${props => props.size === 'large' && `
    padding: ${props.theme.spacing.md} ${props.theme.spacing.xl};
    font-size: ${props.theme.typography.fontSize.base};
  `}

  ${props => props.fullWidth && `
    width: 100%;
  `}

  ${props => props.icon && `
    padding: ${props.theme.spacing.sm};
    aspect-ratio: 1;
  `}
`;

export const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => !['hasError'].includes(prop),
})`
  width: 100%;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border: 2px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.gray200};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.base};
  background: ${props => props.theme.colors.white};
  transition: all ${props => props.theme.transitions.fast};
  box-shadow: ${props => props.theme.shadows.sm};

  &:focus {
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: ${props => {
      if (props.hasError) return props.theme.shadows.glowError;
      return props.theme.shadows.glow;
    }};
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${props => props.hasError ? props.theme.colors.errorLight : props.theme.colors.gray300};
    box-shadow: ${props => props.theme.shadows.md};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray400};
    font-weight: ${props => props.theme.typography.fontWeight.normal};
  }

  &:disabled {
    background: ${props => props.theme.colors.gray100};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const TextArea = styled.textarea.withConfig({
  shouldForwardProp: (prop) => !['hasError'].includes(prop),
})`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.gray300};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.gray400};
  }
`;

export const Select = styled.select.withConfig({
  shouldForwardProp: (prop) => !['hasError'].includes(prop),
})`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.gray300};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background: ${props => props.theme.colors.white};

  &:focus {
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary};
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: 500;
  color: ${props => props.theme.colors.gray700};
`;

export const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: ${props => props.theme.spacing.xs};
  display: block;
`;

export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme.spacing.lg};
  }
`;

export const Flex = styled.div.withConfig({
  shouldForwardProp: (prop) => !['align', 'justify', 'gap', 'wrap', 'mobileColumn'].includes(prop),
})`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || props.theme.spacing.md};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: ${props => props.mobileColumn ? 'column' : 'row'};
  }
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.theme.colors.gray300};
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Modal Components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.2); /* Subtle dark tint */
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.lg};
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0) saturate(100%);
      -webkit-backdrop-filter: blur(0) saturate(100%);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(12px) saturate(180%);
      -webkit-backdrop-filter: blur(12px) saturate(180%);
    }
  }
`;

export const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.85);
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xxl};
  padding: ${props => props.theme.spacing.xl};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);

  @keyframes slideIn {
    from {
      transform: translateY(30px) scale(0.98);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.gray200};
`;

export const ModalTitle = styled.h2`
  color: ${props => props.theme.colors.gray800};
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  background: ${props => props.theme.colors.gray100};
  color: ${props => props.theme.colors.gray600};
  border: none;
  border-radius: ${props => props.theme.borderRadius.full};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};

  &:hover {
    background: ${props => props.theme.colors.gray200};
    color: ${props => props.theme.colors.gray800};
  }
`;

// Additional UI Components
export const Badge = styled.span`
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return props.theme.colors.success;
      case 'error':
        return props.theme.colors.error;
      case 'warning':
        return props.theme.colors.warning;
      case 'secondary':
        return props.theme.colors.gray500;
      default:
        return props.theme.colors.primary;
    }
  }};
  color: ${props => props.theme.colors.white};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Alert = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 4px solid;
  margin-bottom: ${props => props.theme.spacing.lg};
  background: ${props => {
    switch (props.variant) {
      case 'success':
        return `${props.theme.colors.success}10`;
      case 'error':
        return `${props.theme.colors.error}10`;
      case 'warning':
        return `${props.theme.colors.warning}10`;
      default:
        return `${props.theme.colors.primary}10`;
    }
  }};
  border-left-color: ${props => {
    switch (props.variant) {
      case 'success':
        return props.theme.colors.success;
      case 'error':
        return props.theme.colors.error;
      case 'warning':
        return props.theme.colors.warning;
      default:
        return props.theme.colors.primary;
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'success':
        return props.theme.colors.success;
      case 'error':
        return props.theme.colors.error;
      case 'warning':
        return props.theme.colors.warning;
      default:
        return props.theme.colors.primary;
    }
  }};
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.gray600};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.gray100};
    color: ${props => props.theme.colors.gray800};
  }

  &:active {
    background: ${props => props.theme.colors.gray200};
  }
`;
