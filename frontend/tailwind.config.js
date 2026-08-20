/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C9A227',
        secondary: '#B5533C',
        ink: {
          950: '#08070A',
          900: '#0B0A0E',
          850: '#111015',
          800: '#16141B',
          700: '#1E1B24',
          600: '#2A2732',
        },
        // Repurposed as the app's neutral text/surface scale — inverted
        // for a dark, warm-gray editorial theme instead of default cool gray.
        slate: {
          50: '#0B0A0E',
          100: '#16141B',
          200: '#2A2732',
          300: '#3A3640',
          400: '#6B655A',
          500: '#8E8879',
          600: '#B0AA9C',
          700: '#C9C3B8',
          800: '#DDD8CC',
          900: '#F4EFE6',
        },
        // Repurposed as the app's accent scale — antique gold instead of
        // generic SaaS blue.
        blue: {
          50: '#241D10',
          100: '#332913',
          200: '#4A3A16',
          300: '#6B5518',
          400: '#D9B84A',
          500: '#C9A227',
          600: '#B8901E',
          700: '#96741A',
          800: '#7A5E15',
          900: '#5C4710',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Manrope"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
