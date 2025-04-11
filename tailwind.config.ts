import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";
import forms from "@tailwindcss/forms";
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        tertiary: "var(--tertiary)",
        foreground: "var(--foreground)",
        white: "var(--white)"
      },
      fontSize: {
        default: "20px",
        heading: '120px',
        title: "28px",
        caption: '16px',
        auth: '44px'
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        roboto: ['roboto', 'sans-serif'],
        bricolage: ['Bricolage Grotesque', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      
    },
  },
  darkMode:'media',
  plugins: [
    typography,
    aspectRatio,
    forms,
  ],
} satisfies Config;
