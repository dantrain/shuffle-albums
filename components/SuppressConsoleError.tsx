"use client";

import { useEffect } from "react";

// Suppress React 18 + SWR suspense compatibility warning
const SuppressConsoleError = () => {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("A component was suspended by an uncached promise")
      ) {
        return;
      }
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
};

export default SuppressConsoleError;
