/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      'dark-base': 'rgb(17 24 39)', // gray-900
      'dark-flat': 'rgb(107 114 128)', // gray-500
      'dark-cmp': 'rgb(51 65 85)', // slate-700
      'dark-input': 'rgb(0 0 0)', // black
      'dark-highlight': 'rgb(75 85 99)', // gray-600
      'dark-text': 'rgb(255 255 255)', // white
      'dark-chat-user': 'rgb(20 83 45)', // green-900
      'dark-chat-assistant': 'rgb(51 65 85)', // slate-700
      'light-base': 'rgb(229 231 235)', // gray-200
      'light-flat': 'rgb(107 114 128)', // gray-500
      'light-cmp': 'rgb(203 213 225)', // slate-300
      'light-input': 'rgb(255 255 255)', // white
      'light-highlight': 'rgb(156 163 175)', // gray-400
      'light-text': 'rgb(0 0 0)', // black
      'light-chat-user': 'rgb(34 197 94)', // green-500
      'light-chat-assistant': 'rgb(203 213 225)', // slate-300
      warn: 'rgb(250 204 21)' // text-yellow-400
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
