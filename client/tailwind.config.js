 /** @type {import('tailwindcss').Config} */
 export default {
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {},
      screens: {
        'sm': '576px',
        // => @media (min-width: 576px) { ... }
  
        'md': '960px',
        // => @media (min-width: 960px) { ... }
  
        'lg': '1440px',
        // => @media (min-width: 1440px) { ... }
      },
      colors:{
        lightBg:"#E2E8F0",
        lightBgPrimary:"#F8FAFC",
        lightBgSecondary:"0F172A",
      } 
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio')
    ],
  }