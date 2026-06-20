import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#0F172A',
        accent: '#F97316',
        success: '#22C55E',
        warning: '#EAB308',
        danger: '#EF4444',
        background: '#F8FAFC',
        card: '#FFFFFF',
        muted: '#64748B',
        border: '#E2E8F0'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      }
    }
  },
  plugins: []
};

export default config;
