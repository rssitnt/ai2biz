/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // синий
          dark: '#2563EB',
        },
        secondary: {
          DEFAULT: '#EC4899', // розовый
          dark: '#DB2777',
        },
        accent: {
          DEFAULT: '#8B5CF6', // фиолетовый
          dark: '#7C3AED',
        },
        tertiary: {
          DEFAULT: '#60A5FA', // голубой
          dark: '#3B82F6',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'gradient-x': 'gradient-x 6s ease-in-out infinite',
        'gradient-y': 'gradient-y 6s ease-in-out infinite',
        'gradient-xy': 'gradient-xy 6s ease-in-out infinite',
        'slow-spin': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'top center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'bottom center',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left top',
          },
          '25%': {
            'background-size': '400% 400%',
            'background-position': 'right top',
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right bottom',
          },
          '75%': {
            'background-size': '400% 400%',
            'background-position': 'left bottom',
          },
        },
      },
      transitionDuration: {
        '1500': '1500ms',
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.45, 0, 0.25, 1)',
      },
    },
  },
  plugins: [],
} 