/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/layouts/*.handlebars",
              "./views/*.handlebars",
              "./views/*.html",
              "./public/css/*.css",],
    theme: {
      extend: {},
    },
    plugins: [
      require('tailwindcss'),
    ],
  }