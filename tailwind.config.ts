import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Botanical Muted Sage Palette
        sage: {
          50: "#f4f6f4",
          100: "#e5eae5",
          200: "#ced7ce",
          300: "#adc0ac",
          400: "#8a9a86",
          500: "#6f826b",
          600: "#576753",
          700: "#445242",
          800: "#384337",
          900: "#273026",
          950: "#141a13",
        },
        // Deep Forest Green Palette
        forest: {
          50: "#f0f5f3",
          100: "#dce8e2",
          200: "#bcd2c7",
          300: "#94b6a6",
          400: "#6a9582",
          500: "#4e7a68",
          600: "#3c6152",
          700: "#324e43",
          800: "#2a4038",
          900: "#1a2e26",
          950: "#0d1c16",
        },
        // Warm Ivory & Soft Cream Palette
        ivory: {
          50: "#fdfbf7",
          100: "#f9f5ed",
          200: "#f3ebda",
          300: "#e9dcbf",
          400: "#dec69e",
          500: "#d3af7e",
          600: "#c49a65",
          700: "#a47c4e",
          800: "#856441",
          900: "#6c5237",
          950: "#3a2a1a",
        },
        cream: {
          50: "#fcfcfb",
          100: "#f7f6f2",
          200: "#efede3",
          300: "#e4e0d0",
          400: "#d3ccb7",
          500: "#bfb69b",
          600: "#a69a7c",
          700: "#867b61",
          800: "#6e6450",
          900: "#5c5343",
          950: "#312b21",
        },
        // Subtle Terracotta Rose Palette
        terracotta: {
          50: "#fbf6f4",
          100: "#f7ece8",
          200: "#f0ded6",
          300: "#e4c6b9",
          400: "#d4a491",
          500: "#c27357",
          600: "#b35d43",
          700: "#954933",
          800: "#7c3e2d",
          900: "#673729",
          950: "#371a13",
        },
        // Champagne & Imperial Gold Palette
        champagne: {
          50: "#faf8f4",
          100: "#f5f0e6",
          200: "#e9dcbf",
          300: "#dbc794",
          400: "#ceb063",
          500: "#be9643",
          600: "#aa8036",
          700: "#86612d",
          800: "#6e4f29",
          900: "#5a4124",
          950: "#322310",
        },
        gold: {
          50: "#fbf8ef",
          100: "#f5edd5",
          200: "#ebdaa7",
          300: "#dec273",
          400: "#d4af37",
          500: "#c5a059",
          600: "#a98242",
          700: "#876433",
          800: "#6f512e",
          900: "#5c4328",
          950: "#352413",
        },
        // Haute Noir Charcoal
        noir: {
          50: "#f6f6f7",
          100: "#e2e3e6",
          200: "#c5c7ce",
          300: "#a0a3af",
          400: "#7b7f8f",
          500: "#606474",
          600: "#4c4f5d",
          700: "#3e404b",
          800: "#23242b",
          900: "#131418",
          950: "#090a0d",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(0, 0, 0, 0.04)",
        medium: "0 10px 30px -10px rgba(0, 0, 0, 0.07)",
        elevated: "0 20px 40px -15px rgba(0, 0, 0, 0.12)",
        luxury: "0 25px 60px -15px rgba(26, 46, 38, 0.15)",
        gold: "0 15px 35px -5px rgba(197, 160, 89, 0.25)",
        forest: "0 15px 35px -5px rgba(26, 46, 38, 0.35)",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        float: "float 4s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
