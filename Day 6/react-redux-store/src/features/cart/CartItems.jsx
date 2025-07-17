import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "./cartSlice";
import styles from "../../styles/CartItems.module.css";

const CartItems = () => {
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
        <h2>🛒 Your Cart</h2>

        {cartItem.map((item) => (
          <div key={item.id} className={styles.item}>
            <img src={item.thumbnail} alt={item.title} />
            <div className={styles.details}>
              <h3>{item.title}</h3>
              <p>
                ₹{item.price} × {item.quantity} = ₹
                {(item.price * item.quantity).toFixed(2)}
              </p>

              <div className={styles.buttonGroup}>
                <button
                  onClick={() => dispatch(decrementQuantity(item.id))}
                  className={styles.iconButton}
                >
                  -
                </button>
                <span className={styles.quantity}>{item.quantity}</span>
                <button
                  onClick={() => dispatch(incrementQuantity(item.id))}
                  className={styles.iconButton}
                >
                  +
                </button>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className={styles.clearBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className={styles.total}></div>
        <h2>Total Amount: </h2>
        <p>₹{totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartItems;
