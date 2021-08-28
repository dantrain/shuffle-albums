module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1eb854",
        background: "#181818",
      },
      boxShadow: {
        inset:
          "inset 1px 2px rgba(255, 255, 255, 0.1), inset -1px -1px rgba(0, 0, 0, 0.5)",
        "3xl": "0 4px 60px rgba(0, 0, 0, 0.5)",
      },
      letterSpacing: {
        widest: "2px",
      },
      ringOffsetWidth: {
        3: "3px",
      },
      scale: {
        104: "1.04",
      },
      transitionTimingFunction: {
        "in-quad": "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
        "in-cubic": "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
