/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // High-energy Hackathon Palette
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Electric Indigo
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        accent: {
          purple: '#8B5CF6',
          violet: '#7C3AED',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        dark: {
          bg: '#0A0A0F',        // Deep obsidian void
          surface: '#11111B',   // Dark surface panel
          card: '#161626',      // Glass card
          cardHover: '#1F1E36', // Hover lift state
          border: '#27263D',    // Subtle border
          text: '#F3F4F6',
          muted: '#9CA3AF',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 25px -3px rgba(99, 102, 241, 0.45)',
        cyanGlow: '0 0 25px -3px rgba(6, 182, 212, 0.45)',
        card: '0 8px 30px rgba(0, 0, 0, 0.12)',
        darkCard: '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        hover: '0 20px 40px -10px rgba(99, 102, 241, 0.35)',
      },
      animation: {
        'pulse-glow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
