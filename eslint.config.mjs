import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "public/sw.js", "public/workbox-*.js"]),
  {
    rules: {
      // Disable overly strict rule that flags legitimate initialization patterns
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
