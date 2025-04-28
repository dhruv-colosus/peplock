import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#0F0F0F",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#8B5CF6",
          hover: "#7C3AED",
        },
        card: {
          DEFAULT: "rgba(23, 23, 28, 0.8)",
          hover: "rgba(28, 28, 35, 0.9)",
        },
      },
      fontFamily: {
        archivo: ["Archivo", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      fontSize: {
        "2xs": "0.625rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
