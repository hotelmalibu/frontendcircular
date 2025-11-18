const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 👈 muy importante para React
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // PRINCIPAL (Montserrat): Para títulos, subtítulos y cuerpo.
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
        
        // SECUNDARIA (Oswald): Para títulos impactantes, alternativa a Built Titling.
        display: ['Oswald', ...defaultTheme.fontFamily.sans],

        // TERCIARIA (Trebuchet MS): Para textos alternativos (ej. Word, Excel)
        tertiary: ['"Trebuchet MS"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
