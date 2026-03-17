/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        hud: ["'Orbitron'", "monospace"],
        body: ["'Rajdhani'", "sans-serif"],
        mono: ["'Share Tech Mono'", "monospace"],
      },
      colors: {
        void: "#02020a",
        deep: "#06061a",
        surface: "#0d0d2b",
        card: "#111130",
        accent: "#7c5cff",
        glow: "#9d7fff",
        cyan: "#00e5b0",
        pink: "#ff4daa",
        amber: "#ffb400",
        danger: "#ff4466",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        pulse: "pulse 1.5s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideIn: {
          from: { opacity: 0, transform: "translateX(-20px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};