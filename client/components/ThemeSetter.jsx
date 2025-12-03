"use client";
import React, { useEffect, useState } from "react";

const ThemeSetter = () => {
  const [theme, setTheme] = useState("dark"); // safe default

  // Load theme from localStorage (client only)
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme || "dark");
  }, []);

  // Apply the theme when it changes
  useEffect(() => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
    }

    // Save newest theme
    localStorage.setItem("theme", theme);
  }, [theme]); // IMPORTANT: depend on theme!

  return null;
};

export default ThemeSetter;
