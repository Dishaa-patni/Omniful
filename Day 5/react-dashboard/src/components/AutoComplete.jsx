import React, { useEffect, useState } from "react";
import "../style/search.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const AutoComplete = () => {
  const [input, setInput] = useState("");
  const [result, setresult] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const fetchData = async () => {
    const data = await fetch("https://dummyjson.com/recipes/search?q=" + input);
    const res = await data.json();
    setresult(res?.recipes); // if this res is null or undefined it will give undefined instead of error saving from code break
  };

  //Just for more clarity-To reduce mutiple API call , we can use concept of debouncing , we can set a timer and can later clear out which is an unmounting phase

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <div>
      <h1>Autocomplete Search Bar</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for Recipes"
          className="search-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setShowResult(true)}
          onBlur={() => setShowResult(false)}
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
      </div>
      {showResult && (
        <div className="result-container">
          {result.map((text) => {
            return (
              <span className="result" key={text.id}>
                {text.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
