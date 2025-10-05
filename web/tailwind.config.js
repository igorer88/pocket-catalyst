import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,mjs,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },

  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            default: {
              50: '#fafafa',
              100: '#f2f2f3',
              200: '#ebebec',
              300: '#e5e7eb',
              400: '#dcdcdf',
              500: '#d4d4d8',
              600: '#afafb2',
              700: '#8a8a8c',
              800: '#656567',
              900: '#1e1121',
              foreground: '#1e1121',
              DEFAULT: '#e5e7eb'
            },
            primary: {
              50: '#f3e4f5',
              100: '#e1bee7',
              200: '#d098d9',
              300: '#bf73cc',
              400: '#ad4dbe',
              500: '#9c27b0',
              600: '#812091',
              700: '#651972',
              800: '#4a1354',
              900: '#2f0c35',
              foreground: '#fff',
              DEFAULT: '#9c27b0'
            },
            secondary: {
              50: '#dff7fa',
              100: '#b3ebf2',
              200: '#86dfeb',
              300: '#59d3e3',
              400: '#2dc8dc',
              500: '#00bcd4',
              600: '#009baf',
              700: '#007a8a',
              800: '#005965',
              900: '#003840',
              foreground: '#000',
              DEFAULT: '#00bcd4'
            },
            success: {
              50: '#e2f8ec',
              100: '#b9efd1',
              200: '#91e5b5',
              300: '#68dc9a',
              400: '#40d27f',
              500: '#17c964',
              600: '#13a653',
              700: '#0f8341',
              800: '#0b5f30',
              900: '#073c1e',
              foreground: '#000',
              DEFAULT: '#17c964'
            },
            warning: {
              50: '#fef4e4',
              100: '#fce4bd',
              200: '#fad497',
              300: '#f9c571',
              400: '#f7b54a',
              500: '#f5a524',
              600: '#ca881e',
              700: '#9f6b17',
              800: '#744e11',
              900: '#4a320b',
              foreground: '#000',
              DEFAULT: '#f5a524'
            },
            danger: {
              50: '#fee1eb',
              100: '#fbb8cf',
              200: '#f98eb3',
              300: '#f76598',
              400: '#f53b7c',
              500: '#f31260',
              600: '#c80f4f',
              700: '#9e0c3e',
              800: '#73092e',
              900: '#49051d',
              foreground: '#000',
              DEFAULT: '#f31260'
            },
            background: '#f8f6f8',
            foreground: '#1e1121',
            content1: {
              DEFAULT: '#ffffff',
              foreground: '#1e1121'
            },
            content2: {
              DEFAULT: '#f8f6f8',
              foreground: '#1e1121'
            },
            content3: {
              DEFAULT: '#e5e7eb',
              foreground: '#1e1121'
            },
            content4: {
              DEFAULT: '#d4d4d8',
              foreground: '#1e1121'
            },
            focus: '#006FEE',
            overlay: '#000000'
          }
        },
        dark: {
          colors: {
            default: {
              50: '#1e1121',
              100: '#2a1a2e',
              200: '#374151',
              300: '#4b5563',
              400: '#6b7280',
              500: '#9ca3af',
              600: '#d1d5db',
              700: '#e5e7eb',
              800: '#f3f4f6',
              900: '#f8f6f8',
              foreground: '#f8f6f8',
              DEFAULT: '#374151'
            },
            primary: {
              50: '#2f0c35',
              100: '#4a1354',
              200: '#651972',
              300: '#812091',
              400: '#9c27b0',
              500: '#ad4dbe',
              600: '#bf73cc',
              700: '#d098d9',
              800: '#e1bee7',
              900: '#f3e4f5',
              foreground: '#fff',
              DEFAULT: '#9c27b0'
            },
            secondary: {
              50: '#003840',
              100: '#005965',
              200: '#007a8a',
              300: '#009baf',
              400: '#00bcd4',
              500: '#2dc8dc',
              600: '#59d3e3',
              700: '#86dfeb',
              800: '#b3ebf2',
              900: '#dff7fa',
              foreground: '#000',
              DEFAULT: '#00bcd4'
            },
            success: {
              50: '#073c1e',
              100: '#0b5f30',
              200: '#0f8341',
              300: '#13a653',
              400: '#17c964',
              500: '#40d27f',
              600: '#68dc9a',
              700: '#91e5b5',
              800: '#b9efd1',
              900: '#e2f8ec',
              foreground: '#000',
              DEFAULT: '#17c964'
            },
            warning: {
              50: '#4a320b',
              100: '#744e11',
              200: '#9f6b17',
              300: '#ca881e',
              400: '#f5a524',
              500: '#f7b54a',
              600: '#f9c571',
              700: '#fad497',
              800: '#fce4bd',
              900: '#fef4e4',
              foreground: '#000',
              DEFAULT: '#f5a524'
            },
            danger: {
              50: '#49051d',
              100: '#73092e',
              200: '#9e0c3e',
              300: '#c80f4f',
              400: '#f31260',
              500: '#f53b7c',
              600: '#f76598',
              700: '#f98eb3',
              800: '#fbb8cf',
              900: '#fee1eb',
              foreground: '#000',
              DEFAULT: '#f31260'
            },
            background: '#1e1121',
            foreground: '#f8f6f8',
            content1: {
              DEFAULT: '#2a1a2e',
              foreground: '#f8f6f8'
            },
            content2: {
              DEFAULT: '#374151',
              foreground: '#f8f6f8'
            },
            content3: {
              DEFAULT: '#4b5563',
              foreground: '#f8f6f8'
            },
            content4: {
              DEFAULT: '#6b7280',
              foreground: '#f8f6f8'
            },
            focus: '#006FEE',
            overlay: '#ffffff'
          }
        }
      },
      layout: {
        disabledOpacity: '0.5'
      }
    })
  ]
}
