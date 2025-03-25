const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },

    extend: {
      colors: {
        secondary: {
          DEFAULT: "#F2F2F2",
          hover: "#F2F2F2",
        },
        white: {
          DEFAULT: "#FFFFFF",
        },
        blue: {
          DEFAULT: "#4489F7",
          100: "#5084DE",
        },
        gray: {
          DEFAULT: "#8898AA",
          50: "#C8CFD6",
          100: "#F7F9FA",
          200: "#F0F0F5",
          300: "#EBF1F7",
          350: "#ECF3FA",
          400: "#596066",
          500: "#676A7D",
          700: "#606468",
          800: "#EDF1F5",
        },
        dark: {
          DEFAULT: "#121C25",
          100: "#080A15",
          200: "#121C25",
          900: "#000",
        },
        red: {
          DEFAULT: "#E52E30",
          100: "#FEF5F5",
        },
        green: {
          DEFAULT: "#16CC53",
          100: "#E8FAEE",
          200: "#08D572",
          400: "#30DF14",
          500: "#3DD641",
          600: "#08D573",
        },
        yellow: {
          DEFAULT: "#F9A82F",
          100: "#FEF4E6",
        },
      },
      gridTemplateColumns: {
        "1-max": "1fr max-content",
        "max-1": "max-content 1fr",
        "max-1-max": "max-content 1fr max-content",
      },
      lineHeight: {
        14: "14px",
        20: "20px",
        23: "23px",
        110: "110%",
        130: "130%",
        140: "140%",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      zIndex: {
        90: "90",
        100: "100",
      },
      fontSize: {
        "2xs": "0.8125rem", // 13px
        "4.5xl": "2.5rem", // 40px
        "3.5xl": "2rem", // 32px
      },
      boxShadow: {
        card: "0px 4px 20px 0px rgba(8, 213, 115, 0.20)",
        // review: "inset 0px -1px 0px rgba(102, 117, 137, 0.3)",
        // header: "0px 3px 6px rgba(125, 132, 141, 0.06)",
        // blog: "0px 3px 20px rgba(18, 28, 37, 0.06), 0px 4px 30px rgba(18, 28, 37, 0.07), inset 0px -1px 0px rgba(102, 117, 137, 0.3)",
        // chat: "0px 28px 28px rgba(0, 0, 0, 0.08)",
        // "inner-xs": "inset 0px -1px 0px rgba(255, 255, 255, 0.1)",
        select: "0px 0px 50px 0px rgba(82, 63, 105, 0.15)",
        dropdown: "0px 8px 30px 0px rgba(25, 30, 54, 0.12)",
        tab: "0px 4px 8px 0px rgba(18, 28, 37, 0.10);",
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
};
