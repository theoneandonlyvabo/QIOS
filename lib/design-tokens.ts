export const tokens = {
  borderRadius: {
    none: '0',
    sm: '0.375rem',    // 6px - Small elements
    md: '0.5rem',      // 8px - Cards, buttons
    lg: '0.75rem',     // 12px - Modals, large cards
    xl: '1rem',        // 16px - Hero sections
    full: '9999px',    // Pills, avatars
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  animations: {
    fadeIn: 'animate-fadeIn 300ms ease-in',
    slideUp: 'animate-slideUp 300ms ease-out',
    scaleIn: 'animate-scaleIn 200ms ease-out',
  },

  spacing: {
    '0': '0px',
    '1': '0.25rem',  // 4px
    '2': '0.5rem',   // 8px
    '3': '0.75rem',  // 12px
    '4': '1rem',     // 16px
    '5': '1.25rem',  // 20px
    '6': '1.5rem',   // 24px
    '8': '2rem',     // 32px
    '10': '2.5rem',  // 40px
    '12': '3rem',    // 48px
    '16': '4rem',    // 64px
    '20': '5rem',    // 80px
  },

  componentSpacing: {
    card: {
      padding: 'p-6',        // 24px internal padding
      gap: 'gap-4',          // 16px between elements
      marginBottom: 'mb-6',  // 24px between cards
    },
    
    section: {
      padding: 'py-8 px-6',  // 32px vertical, 24px horizontal
      gap: 'gap-6',          // 24px between sections
    },
    
    button: {
      padding: {
        sm: 'px-3 py-1.5',   // 12px x 6px
        md: 'px-4 py-2',     // 16px x 8px
        lg: 'px-6 py-3',     // 24px x 12px
      }
    }
  },
  
  colorUsage: {
    // Primary blue: CTA buttons, navigation active states, links
    primaryAction: 'text-primary-600 hover:text-primary-700',
    primaryBackground: 'bg-primary-600 hover:bg-primary-700',
    primaryBorder: 'border-primary-600',
    
    // Success green: Positive metrics, revenue cards, completed status
    successBackground: 'bg-success-500',
    successText: 'text-success-600',
    successBorder: 'border-success-500',
    
    // Warning amber: Alerts, pending states, low stock warnings
    warningBackground: 'bg-warning-500',
    warningText: 'text-warning-600',
    warningBorder: 'border-warning-500',
    
    // Danger red: Critical issues, overdue items, failed transactions
    dangerBackground: 'bg-danger-500',
    dangerText: 'text-danger-600',
    dangerBorder: 'border-danger-500',
    
    // Neutral gray: Text hierarchy, backgrounds, borders
    text: {
      primary: 'text-neutral-900',
      secondary: 'text-neutral-700',
      tertiary: 'text-neutral-500',
      disabled: 'text-neutral-400',
    },
    background: {
      page: 'bg-neutral-50',
      card: 'bg-white',
      subtle: 'bg-neutral-100',
    },
    border: {
      default: 'border-neutral-200',
      focus: 'focus:border-primary-500',
    }
  },

  typography: {
    display: {
      1: 'text-5xl font-bold leading-tight',     // 48px
      2: 'text-4xl font-bold leading-tight',     // 36px
    },
    heading: {
      1: 'text-3xl font-semibold leading-tight', // 30px
      2: 'text-2xl font-semibold leading-snug',  // 24px
      3: 'text-xl font-semibold leading-snug',   // 20px
      4: 'text-lg font-semibold leading-normal', // 18px
    },
    body: {
      lg: 'text-base font-normal leading-relaxed',   // 16px
      base: 'text-sm font-normal leading-relaxed',   // 14px
      sm: 'text-xs font-normal leading-normal',      // 12px
    },
    label: {
      base: 'text-sm font-medium leading-none',   // 14px
      sm: 'text-xs font-medium leading-none',     // 12px
    },
    caption: 'text-xs font-normal leading-tight text-neutral-500', // 12px
  },
};

// Helper functions for consistent component styling
export const getStatusColor = (status: 'excellent' | 'good' | 'warning' | 'danger') => {
  switch (status) {
    case 'excellent':
      return 'border-success-500 bg-success-50';
    case 'good':
      return 'border-primary-500 bg-primary-50';
    case 'warning':
      return 'border-warning-500 bg-warning-50';
    case 'danger':
      return 'border-danger-500 bg-danger-50';
  }
};

export const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return 'text-success-600';
    case 'down':
      return 'text-danger-600';
    case 'stable':
      return 'text-warning-600';
  }
};

export default tokens;