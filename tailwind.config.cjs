/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{html,js,jsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
