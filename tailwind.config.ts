import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
        terracotta: {
          50: "#fdf8f6",
          100: "#f7ebe6",
          200: "#f0d8cf",
          300: "#e4bcae",
          400: "#d49784",
          500: "#c4755f",
          600: "#b35b45",
          700: "#954936",
          800: "#7c3e2f",
          900: "#67372b",
          950: "#381a13",
        },
        gold: {
          50: "#fbf9f1",
          100: "#f6f1de",
          200: "#ece1bb",
          300: "#decb8f",
          400: "#ceb063",
          500: "#be9643",
          600: "#a57a35",
          700: "#845c2b",
          800: "#6d4a27",
          900: "#5a3d23",
          950: "#342010",
        },
        noir: {
          900: "#0b0b0f",
          800: "#121218",
          700: "#1a1a24",
          600: "#242432",
        },
        champagne: {
          50: "#fcfbfa",
          100: "#f8f5f0",
          200: "#f2ece2",
          300: "#e6dcce",
          400: "#d4c5b1",
          500: "#bfad96",
        },
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.5s infinite linear",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        luxury: "0 20px 40px -15px rgba(179, 91, 69, 0.12)",
        "luxury-lg": "0 30px 60px -20px rgba(179, 91, 69, 0.18)",
        glow: "0 0 25px -5px rgba(190, 150, 67, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
