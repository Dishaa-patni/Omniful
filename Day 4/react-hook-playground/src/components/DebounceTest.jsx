import React, { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import "./debounce.css";

//since this is static and if we will keep this inside Debounce Test on every input change it is rendered and this array will be re created agaiin
const fruitItems = [
  "Apple",
  "Apricot",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Grape",
  "Mango",
  "Orange",
  "Pineapple",
  "Strawberry",
  "Watermelon",
];
const DebounceTest = () => {
  const [input, setInput] = useState("");

  const debounceInput = useDebounce(input, 500);

  const filterFruits = fruitItems.filter((item) =>
    item.toLowerCase().includes(debounceInput.toLowerCase())
  );

  return (
    <div>
      <div className="debounce-container">
        <h1>Debounce Search</h1>
        <p>
          It prevents from calling API on every keystrokes,avoids to many
          renders
        </p>

        <input
          type="text"
          placeholder="Search for fruits..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="output">
          {filterFruits.length > 0 ? (
            filterFruits.map((fruit, index) => {
              return <p key={index}>{fruit}</p>;
            })
          ) : (
            <p>No Fruits Matched !</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebounceTest;
