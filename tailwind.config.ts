import type { Config } from "tailwindcss";

/**
 * Bluai design tokens.
 * Brand colors were sampled directly from the delivered artwork so the
 * recreated UI matches the source assets as closely as possible.
 */
const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand palette (official)
        brand: {
          DEFAULT: "#3167ff",
          electric: "#3900ff",
          royal: "#3167ff",
          indigo: "#3900ff",
          cyan: "#2ecaff",
        },
        // Secondary / accent palette (official)
        accent: {
          purple: "#9200ff",
          green: "#00e774",
          orange: "#ff8500",
          yellow: "#ffce00",
          red: "#e24337",
          teal: "#4ed5de",
          cyan: "#2ecaff",
        },
        // Dark surfaces
        navy: {
          DEFAULT: "#0a0e2e",
          950: "#06091f",
          900: "#0a0e2e",
          800: "#0f1640",
          footer: "#002a78",
        },
        // Light surfaces
        mist: "#eef0f2",
      },
      fontFamily: {
        // Body / UI copy
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        // Headings / display titling face (brand: Square721 BdEx BT)
        display: ["var(--font-display)", "var(--font-body)", "system-ui", "sans-serif"],
        // Heavy condensed numerals for the impact stats
        stat: ["var(--font-stat)", "Impact", "sans-serif"],
      },
      maxWidth: {
        shell: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
