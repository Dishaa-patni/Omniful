import React from "react";
import useToggle from "../hooks/useToggle";
import "./toggle.css";

const Toggle = () => {
  const [isDark, toggleTheme] = useToggle(false);

  return (
    <>
      <div className={`box ${isDark ? "dark" : "light"} `}>
        <h2>{isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}</h2>
        <button onClick={toggleTheme}>ToggleTheme</button>
      </div>
    </>
  );
};

export default Toggle;
