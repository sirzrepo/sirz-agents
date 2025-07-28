/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      
      colors: {
        // blue
        colorBlueDeep: '#3752E9',
        colorBlueLight: '#CED7FE',

        // green
        colorGreen: "#3ACBCC",
        colorGreenLight: "#71D9DA",
        colorGreenDeeper: "#001F3E",

        colorNeutra: "#EBE6E6",

        // light mode
        colorLight: '#FAFAFA',
        colorDefaultLight: '#FFFFFF',

        // dark mode
        colorDark: '#FAFAFA',
        colorDefaultDark: '#FFFFFF',
      },
      backgroundImage: {
        salesFunnelBackgroundGradient: "linear-gradient(to right, #001F3E, #203DA3, #3752E9)",
        'dashboard-form-gradient': 'linear-gradient(90deg, #001F3E, #203DA3, #3752E9)',
        'text-gradient': 'linear-gradient(90deg, #001F3E, #203DA3, #3752E9)',
      },
    },
  },
  plugins: [],
}

