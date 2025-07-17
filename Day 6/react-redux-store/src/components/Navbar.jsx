import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav>
      <div className={styles.navbar}>
        <div>
          <Link to="/" className={styles.logo}>
            🛍️ MyStore
          </Link>
        </div>

        <div>
          <Link to="/cart" className={styles.cartLink}>
            🛒 Cart <span className={styles.count}>{totalQuantity}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
