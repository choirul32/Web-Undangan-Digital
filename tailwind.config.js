/** @type {import('tailwindcss').Config} */
import flowbiteReact from "flowbite-react/plugin/tailwindcss";

export default {
  content: [
    "./src/**/*.{js,jsx}",
    "./node_modules/flowbite-react/dist/components/**/*.{js,mjs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbiteReact],
};
