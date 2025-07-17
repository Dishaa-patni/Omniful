import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./productSlice";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../cart/cartSlice";
import { useEffect } from "react";
import styles from "../../styles/ProductList.module.css";
import { toast } from "react-toastify";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const selectedCategory = useSelector((state) => state.filter.category);
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (product) =>
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  useEffect(() => {
    if (status === "empty") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const isInCart = (id) => cartItems.find((item) => item.id === id);

  if (status === "loading") {
    return <p className={styles.center}> Loading products...</p>;
  }

  if (status === "failed") {
    return <p className={styles.error}> {error}</p>;
  }

  return (
    <>
      <div className={styles.productGrid}>
        {filteredProducts.map((prd) => {
          const cartItem = isInCart(prd.id);
          return (
            <div className={styles.card} key={prd.id}>
              <img src={prd.thumbnail} alt={prd.title} />
              <h3>{prd.title}</h3>
              <h4>{prd.category}</h4>
              <p>₹{prd.price}</p>

              {cartItem ? (
                <div className={styles.buttonGroup}>
                  <button
                    onClick={() => {
                      dispatch(decrementQuantity(prd.id));
                      toast.info(`Decreased quantity of "${prd.title}"`);
                    }}
                    className={styles.iconButton}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{cartItem.quantity}</span>
                  <button
                    onClick={() => {
                      dispatch(incrementQuantity(prd.id));
                      toast.success(`Increased quantity of "${prd.title}"`);
                    }}
                    className={styles.iconButton}
                  >
                    +
                  </button>

                  <button
                    onClick={() => {
                      dispatch(removeFromCart(prd.id));
                      toast.error(`Removed "${prd.title}" from cart`);
                    }}
                    className={styles.iconButton}
                  >
                    🗑️
                  </button>
                </div>
              ) : (
                <button
                  className={styles.addButton}
                  onClick={() => {
                    dispatch(addToCart(prd));
                    toast.success(`${prd.title} added to cart`);
                  }}
                >
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductList;
