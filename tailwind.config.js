/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    colors: {
      'dark-base': 'rgb(51 65 85)', // slate-700
      'dark-flat': 'rgb(107 114 128)', // gray-500
      'dark-cmp': 'rgb(36 41 46)', // github-dark
      'dark-input': 'rgb(0 0 0)', // black
      'dark-highlight': 'rgb(75 85 99)', // gray-600
      'dark-text': 'rgb(255 255 255)', // white
      'light-base': 'rgb(203 213 225)', // slate-300
      'light-flat': 'rgb(107 114 128)', // gray-500
      'light-cmp': 'rgb(255 255 255)', // github-light
      'light-input': 'rgb(255 255 255)', // white
      'light-highlight': 'rgb(156 163 175)', // gray-400
      'light-text': 'rgb(0 0 0)', // black
      warn: 'rgb(250 204 21)' // text-yellow-400
      // 'rgb(36 41 46)', // github-dark
      // 'rgb(255 255 255)', // github-light
      // 'rgb(17 24 39)', // gray-900
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
