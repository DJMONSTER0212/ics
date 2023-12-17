/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    require('@tailwindcss/line-clamp'),
    require(`@tailwindcss/typography`),
  ],
  theme: {
    extend: {
      screens: {
        'xxxs': '150px',
        'xxs': '370px',
        'xs': '440px',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'secondary': ['Sriracha', 'sans-serif']
      },
      fontSize: {
        sm: '0.9rem',
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      },
      colors: {
        primary: {
          100: process.env.P_100,
          200: process.env.P_200,
          300: process.env.P_300,
          400: process.env.P_400,
          500: process.env.P_500,
          600: process.env.P_600,
          700: process.env.P_700,
          800: process.env.P_800,
          900: process.env.P_900
        },
        secondary: {
          100: process.env.S_100,
          200: process.env.S_200,
          300: process.env.S_300,
          400: process.env.S_400,
          500: process.env.S_500,
          600: process.env.S_600,
          700: process.env.S_700,
          800: process.env.S_800,
          900: process.env.S_900
        },
        black: {
          100: "#d1d1d1",
          200: "#a3a3a3",
          300: "#757575",
          400: "#474747",
          500: "#191919",
          600: "#141414",
          700: "#0f0f0f",
          800: "#0a0a0a",
          900: "#050505"
        },
        dimBlack: '#171717',
        white: '#FFFFFF',
        background: '#F9FAFB'
      },
    },
  },
  darkMode: 'class',
}
