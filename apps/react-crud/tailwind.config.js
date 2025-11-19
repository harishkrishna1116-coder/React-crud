const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// module.exports = {
//   content: [
//     "./apps/**/*.{js,ts,jsx,tsx}",
//     "./libs/**/*.{js,ts,jsx,tsx}"
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }