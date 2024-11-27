/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.html",          // All HTML files in the pages folder and subfolders
    "./assets/scripts/**/*.js",   // All JS files in the scripts folder and subfolders
  ],
  theme: {
    screens : {
      sm : '480px',
      md : '768px',
      lg : '976px',
      xl : '1440px',
    },
    extend: {
      boxShadow: {  
        'inset-custom': 'inset 0 4px 8px rgba(0, 0, 0, 0.2)', // Custom inset shadow  
    }, 
    },
  },
  plugins: [],
}

