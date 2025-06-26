/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin') // เพิ่มบรรทัดนี้

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // เพิ่มโค้ดส่วนนี้เข้าไป
    plugin(function({ addUtilities }) {
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
      })
    }),
  ],
}