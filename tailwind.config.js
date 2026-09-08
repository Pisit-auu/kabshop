/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        "canvas-2": "rgb(var(--c-canvas-2) / <alpha-value>)",
        "canvas-3": "rgb(var(--c-canvas-3) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        subtle: "rgb(var(--c-subtle) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        "line-strong": "rgb(var(--c-line-strong) / <alpha-value>)",
        brand: "rgb(var(--c-brand) / <alpha-value>)",
        "brand-on": "rgb(var(--c-brand-on) / <alpha-value>)",
        sale: "rgb(var(--c-sale) / <alpha-value>)",
        "sale-text": "rgb(var(--c-sale-text) / <alpha-value>)",
        "sale-soft": "rgb(var(--c-sale-soft) / <alpha-value>)",
        go: "rgb(var(--c-go) / <alpha-value>)",
        "go-text": "rgb(var(--c-go-text) / <alpha-value>)",
        "go-soft": "rgb(var(--c-go-soft) / <alpha-value>)",
        focus: "rgb(var(--c-focus) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        text: ["var(--font-text)", "system-ui", "sans-serif"],
      },
      fontSize: {
        micro: ["11px", { lineHeight: "15px", letterSpacing: "0.03em" }],
        caption: ["13px", { lineHeight: "19px" }],
        small: ["14px", { lineHeight: "22px" }],
        base: ["16px", { lineHeight: "26px" }],
        lead: ["18px", { lineHeight: "29px" }],
        h4: ["20px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        h3: ["24px", { lineHeight: "32px", letterSpacing: "-0.015em" }],
        h2: ["32px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        h1: ["40px", { lineHeight: "48px", letterSpacing: "-0.025em" }],
        hero: ["clamp(2rem, 5vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        md: "var(--radius)",
        lg: "var(--radius-lg)",
        full: "9999px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
        pop: "var(--shadow-pop)",
      },
      maxWidth: {
        measure: "68ch",
        shell: "1360px",
      },
      transitionTimingFunction: {
        ease: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "fade-up": "fade-up 420ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-down": "slide-down 240ms cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
