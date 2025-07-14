import React from "react";
import useCounter from "../hooks/useCounter";
import "./counter.css";

const CounterTest = () => {
  const { count, increment, decrement, reset } = useCounter(0);
  const {
    count: voteCount,
    increment: voteIncrement,
    decrement: voteDecrement,
  } = useCounter(100);
  return (
    <div className="main-container">
      <div className="counter-box">
        <h2>🔢Counter Hook</h2>
        <p className="count">{count}</p>
        <div className="btn-group">
          <button onClick={increment}>➕</button>
          <button onClick={decrement}>➖</button>
          <button onClick={reset}>🔁</button>
        </div>
      </div>

      <div className="counter-box">
        <h2>🗳️ Vote Counter</h2>
        <div className="count">{voteCount}</div>
        <div className="btn-group">
          <button onClick={voteIncrement}>Vote ⬆️</button>
          <button onClick={voteDecrement}>Vote ⬇️</button>
        </div>
      </div>
    </div>
  );
};

export default CounterTest;
