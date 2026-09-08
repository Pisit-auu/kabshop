/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    // Zero radius is the world's rule, so the rounded scale is deliberately
    // empty apart from `full` (the cart badge). Spacing stays on Tailwind's
    // own 4px scale — the grid discipline is in the usage, not in a pruned
    // scale that silently voids classes like h-11.
    borderRadius: {
      none: "0px",
      full: "9999px",
    },
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-deep": "var(--paper-deep)",
        stock: "var(--stock)",
        ink: "var(--ink)",
        "ink-mid": "var(--ink-mid)",
        "ink-soft": "var(--ink-soft)",
        rule: "var(--rule)",
        "rule-mid": "var(--rule-mid)",
        section: "var(--section-fill)",
        "section-text": "var(--section-text)",
        scarlet: "var(--scarlet)",
        "scarlet-text": "var(--scarlet-text)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        text: ["var(--font-text)", "system-ui", "sans-serif"],
      },
      fontSize: {
        micro: ["11px", { lineHeight: "14px", letterSpacing: "0.08em" }],
        caption: ["12px", { lineHeight: "17px" }],
        small: ["14px", { lineHeight: "22px" }],
        base: ["16px", { lineHeight: "27px" }],
        lead: ["18px", { lineHeight: "30px" }],
        h4: ["21px", { lineHeight: "27px", letterSpacing: "-0.01em" }],
        h3: ["27px", { lineHeight: "32px", letterSpacing: "-0.015em" }],
        h2: ["36px", { lineHeight: "40px", letterSpacing: "-0.02em" }],
        h1: ["48px", { lineHeight: "50px", letterSpacing: "-0.03em" }],
        masthead: ["clamp(2.25rem, 8vw, 5.5rem)", { lineHeight: "0.86", letterSpacing: "-0.035em" }],
      },
      maxWidth: {
        measure: "68ch",
        sheet: "1240px",
      },
      transitionTimingFunction: {
        press: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "rule-draw": { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
        "ink-settle": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
        "flash-in": { from: { opacity: "0", transform: "translateY(-8px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "rule-draw": "rule-draw 520ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "ink-settle": "ink-settle 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "flash-in": "flash-in 260ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
