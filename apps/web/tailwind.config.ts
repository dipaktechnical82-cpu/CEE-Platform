import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0284c7', // Primary accessible medical cyan/blue
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
          950: '#031726',
          // Official Approved CEE Medical Prep Brand Palette
          sky: '#B8DFF4',
          aqua: '#A9E6DD',
          mint: '#D5F3E8',
          cloud: '#F5FBFA',
          teal: '#244A50',
          // Dark Dashboard Theme Navy Surfaces
          navy: {
            DEFAULT: '#0A1128',
            deep: '#060A18',
            card: '#101A3C',
            surface: '#131D45',
            hover: '#162354',
          },
          // Muted Violet for interactive & active states in dark dashboard
          violet: {
            DEFAULT: '#7367F0',
            hover: '#6457E2',
            muted: '#5B52D6',
          },
        },
        cee: {
          physics: '#3b82f6',
          chemistry: '#10b981',
          botany: '#22c55e',
          zoology: '#eab308',
          mat: '#8b5cf6',
        },
      },
    },
  },
  plugins: [],
};

export default config;
