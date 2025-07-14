import { useState } from "react";
import "./App.css";
import CounterTest from "./components/CounterTest.jsx";
import Previous from "./components/Previous.jsx";
import Toggle from "./components/Toggle.jsx";

function App() {
  const [activeHook, setActiveHook] = useState();

  const componentMap = {
    counter: <CounterTest />,
    toggle: <Toggle />,
    // previous: <Previous />,
  };

  const renderComponent = componentMap[activeHook];

  return (
    <>
      <h1>React Hook Playground</h1>
      <h1>Select the custom hook for demonstration ⬇️</h1>
      <div className="navbar">
        <button onClick={() => setActiveHook("counter")}>useCounter</button>
        <button onClick={() => setActiveHook("toggle")}>useToggle</button>
        {/* <button onClick={() => setActiveHook("previous")}>usePrevious</button> */}
      </div>

      <div className="test-area">{renderComponent}</div>
    </>
  );
}

export default App;
