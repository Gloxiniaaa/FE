/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./styles/**/*.css",
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'fore-background': '#E8E8E8',
        'main-background': '#FFFFFF',
        'gray-light': '#EAECF0',
        'light-gray': '#F8F8F8',

        'pure-white': '#FCFCFD',
        'deep-blue': '#0070FF',
        'dark-blue': '#030391',
        'blue-black': '#101828',
        'green-dark': '#037847',
        'red-deep': '#C00000',
        'mint-green': '#ECFDF3',
        'smoke-gray': '#EDEFF1',
        'whitish-blue': '#F7FAFF',
        'pale-cream': '#FCFDEC',
        'pale-pink': '#FFECEC',

        'status-green-background': '#ECFDF3',
        'status-green-dot': '#14BA6D',
        'status-green-text': '#037847',

        'status-gray-background': '#F2F4F7',
        'status-gray-dot': '#6C778B',
        'status-gray-text': '#364254',

        'status-red-text': '#C00000',
        'status-red-background': '#FFECEC',

        'status-yellow-text': '#D0C703',
        'status-yellow-background': '#FCFDEC',
        'status-yellow-dot': '#D0C703',

        'status-orange-background': '#F32222',

        'table-text-color': '#667085',

        'background-paging-disable': '#C4CDD5',

        'button-blue': '#1488D8',
        'button-green': '#13C296',
        'button-red': '#FF2C2C',

        'button-blue-hover': '#0F6AB4',
        'button-green-hover': '#0F9A7C',
        'button-red-hover': '#D32F2F',

      },
      fontSize: {
        'custom-size': '0.875rem',
      }
    },
  },
  plugins: [],
}
