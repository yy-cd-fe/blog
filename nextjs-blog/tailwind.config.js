/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0070f3',
        secondary: '#666',
        border: '#e0e0e0',
        background: '#f9f9f9',
        text: '#333',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: ['"Courier New"', 'monospace'],
      },
      spacing: {
        gutter: '20px',
      },
      borderRadius: {
        card: '8px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 112, 243, 0.1)',
      },
    },
  },
  plugins: [],
}
