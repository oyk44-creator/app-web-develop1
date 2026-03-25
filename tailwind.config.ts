import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      // bg-fmai-primary, bg-fmai-primary-light, bg-fmai-primary-dark, with optional /opacity suffix
      pattern:
        /bg-fmai-(primary|secondary|accent|info|purple|pink|indigo|amber|orange|red)(-light|-dark)?\/(10|20|30|40|50|60|70|80|90|100)/,
    },
    {
      // base background colors without opacity
      pattern:
        /bg-fmai-(primary|secondary|accent|info|purple|pink|indigo|amber|orange|red)(-light|-dark)?/,
    },
    {
      // text colors
      pattern:
        /text-fmai-(primary|secondary|accent|info|purple|pink|indigo|amber|orange|red)(-light|-dark)?/,
    },
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        fmai: {
          primary: {
            DEFAULT: "#2596BE",
            light: "#51ABCB",
            dark: "#1F6C86",
          },
          secondary: {
            DEFAULT: "#06b6d4",
            light: "#22d3ee",
            dark: "#0891b2",
          },
          accent: {
            DEFAULT: "#14b8a6",
            light: "#2dd4bf",
            dark: "#0d9488",
          },
          info: {
            DEFAULT: "#3b82f6",
            light: "#60a5fa",
            dark: "#2563eb",
          },
          purple: {
            DEFAULT: "#a855f7",
            light: "#c084fc",
            dark: "#9333ea",
          },
          pink: {
            DEFAULT: "#ec4899",
            light: "#f472b6",
            dark: "#db2777",
          },
          indigo: {
            DEFAULT: "#818cf8",
            light: "#a5b4fc",
            dark: "#6366f1",
          },
          amber: {
            DEFAULT: "#f59e0b",
            light: "#fbbf24",
            dark: "#d97706",
          },
          orange: {
            DEFAULT: "#f97316",
            light: "#fb923c",
            dark: "#ea580c",
          },
          red: {
            DEFAULT: "#ef4444",
            light: "#f87171",
            dark: "#dc2626",
          },
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
