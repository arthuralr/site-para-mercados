import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            50: "rgb(var(--brand-primary-50) / <alpha-value>)",
            100: "rgb(var(--brand-primary-100) / <alpha-value>)",
            500: "rgb(var(--brand-primary-500) / <alpha-value>)",
            600: "rgb(var(--brand-primary-600) / <alpha-value>)",
            700: "rgb(var(--brand-primary-700) / <alpha-value>)",
            800: "rgb(var(--brand-primary-800) / <alpha-value>)",
            900: "rgb(var(--brand-primary-900) / <alpha-value>)",
          },
          orange: {
            50: "rgb(var(--brand-secondary-50) / <alpha-value>)",
            100: "rgb(var(--brand-secondary-100) / <alpha-value>)",
            400: "rgb(var(--brand-secondary-400) / <alpha-value>)",
            500: "rgb(var(--brand-secondary-500) / <alpha-value>)",
            600: "rgb(var(--brand-secondary-600) / <alpha-value>)",
            700: "rgb(var(--brand-secondary-700) / <alpha-value>)",
          },
        },
      },
      boxShadow: {
        soft: "0 2px 16px -2px rgba(15, 23, 42, 0.06)",
        card: "0 1px 8px -1px rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
