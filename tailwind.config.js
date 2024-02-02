/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    colors: {
      'dark-base': 'rgb(0 0 0)', // black
      'dark-input': 'rgb(0 0 0)', // black
      'dark-codeblock': 'rgb(36 41 46)', // github-dark
      'dark-cmp': 'rgb(51 65 85)', // slate-700
      'dark-overlay': 'rgb(71 85 105)', // slate-600
      'dark-highlight': 'rgb(100 116 139)', // slate-500
      'dark-contrast': 'rgb(148 163 184)', // slate-400
      'dark-text': 'rgb(255 255 255)', // white

      'light-base': 'rgb(255 255 255)', // white
      'light-input': 'rgb(255 255 255)', // white
      'light-codeblock': 'rgb(255 255 255)', // github-light
      'light-cmp': 'rgb(226 232 240)', // slate-200
      'light-overlay': 'rgb(203 213 225)', // slate-300
      'light-highlight': 'rgb(148 163 184)', // slate-400
      'light-contrast': 'rgb(100 116 139)', // slate-500
      'light-text': 'rgb(0 0 0)', // black

      warn: 'rgb(250 204 21)', // yellow-400
      error: 'rgb(220 38 38)' // red-600
      // 'rgb(36 41 46)', // github-dark
      // 'rgb(255 255 255)', // github-light
      // 'rgb(17 24 39)', // gray-900
      // 'rgb(107 114 128)', // gray-500
      // 'rgb(226 232 240)', // slate-200
      // 'rgb(203 213 225)', // slate-300
      // 'rgb(209 213 219)', // gray-300
      // 'rgb(148 163 184)', // slate-400
      // 'rgb(100 116 139)', // slate-500
      // 'rgb(71 85 105)', // slate-600
      // 'rgb(51 65 85)', // slate-700
    },
    extend: {
      animation: {
        'bounce-fast': 'bounce 1s infinite',
        'bounce-normal': 'bounce 2s infinite',
        'bounce-slow': 'bounce 3s infinite'
      }
    }
  },
  plugins: []
};
