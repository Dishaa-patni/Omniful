import { useState } from "react";
import Modal from "./components/Modal.jsx";
import Accordion from "./components/Accordion.jsx";
import InfiniteScroll from "./components/InfiniteScroll.jsx";
import AutoComplete from "./components/AutoComplete.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("modal");

  const renderingComponentMap = {
    modal: <Modal />,
    accordion: <Accordion />,
    scroll: <InfiniteScroll />,
    autoComplete: <AutoComplete />,
  };

  const renderedComponentTab = renderingComponentMap[activeTab];

  return (
    <>
      <div>
        <h1>React Dashboard</h1>
        <div className="tabBar">
          <button onClick={() => setActiveTab("modal")}>Modal Tab</button>
          <button onClick={() => setActiveTab("accordion")}>
            Accordian Tab
          </button>
          <button onClick={() => setActiveTab("scroll")}>
            InfiniteScroll Tab
          </button>
          <button onClick={() => setActiveTab("autoComplete")}>
            AutoComplete Tab
          </button>
        </div>
        <div className="result-area">{renderedComponentTab}</div>
      </div>
    </>
  );
}

export default App;
