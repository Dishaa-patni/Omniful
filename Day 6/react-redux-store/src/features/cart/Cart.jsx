import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "./cartSlice";
import styles from "./Cart.module.css";

const Cart = () => {
  const cartItem = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  //using reduce because it will compute a single value
  const totalAmount = cartItem.reduce(
    (total, prd) => total + prd.price * prd.quantity,
    0
  );

  return (
    <div>
      <div className={styles.cart}>
        <h2>🛒 Products in Cart:</h2>
        <ul>
          {cartItem.map((prd) => {
            return(
            <li key={prd.id} className={styles.item}>
              <img src={prd.thumbnail} alt={prd.title} />
              <div>
                <h3>{prd.title}</h3>
                <p>
                  ₹{prd.price} x {prd.quantity}
                </p>
                <button
                  onClick={() => dispatch(removeFromCart(prd.id))}
                  className={styles.clearBtn}
                >
                  Remove
                </button>
              </div>
            </li>
            )
          })}
        </ul>

        <h2>Total Amount: ₹{totalAmount.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default Cart;
