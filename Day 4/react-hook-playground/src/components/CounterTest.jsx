import React from "react";
import useCounter from "../hooks/useCounter";
import "./counter.css";

const CounterTest = () => {
  const { count, increment, decrement, reset } = useCounter(0);
  const {
    count: cartCount,
    increment: addToCart,
    decrement: removeFromCart,
  } = useCounter(0);
  return (
    <div className="main-container">
      <div className="counter-box">
        <h2>🔢Counter Hook</h2>
        <p className="count">{count}</p>
        <div className="btn-group">
          <button onClick={decrement}>➖</button>
          <button onClick={increment}>➕</button>
          <button onClick={reset}>🔁</button>
        </div>
      </div>

      <div className="counter-box">
        <h2>🛒Shopping Cart</h2>
        <div className="count">{cartCount}</div>
        <div className="btn-group">
          <button onClick={removeFromCart}> Remove ➖</button>
          <button onClick={addToCart}>Add to Cart ➕</button>
        </div>
      </div>
    </div>
  );
};

export default CounterTest;
