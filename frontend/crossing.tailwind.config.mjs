/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        hand: ['Caveat', 'cursive'],
        body: ['Lora', 'Georgia', 'serif'],
        display: ['Caveat', 'cursive'],
        label: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        logbook: {
          paper: '#faf6ee',
          ink: '#0c2340',
          teal: '#0f766e',
          sea: '#0d9488',
          dusk: '#be123c',
          amber: '#fbbf24',
          mist: '#faf6ee',
        },
        coast: {
          sky: '#bae6fd',
          sea: '#14b8a6',
          cliff: '#0f766e',
          sand: '#fef3c7',
          wood: '#92400e',
        },
      },
    },
  },
  plugins: [],
};
