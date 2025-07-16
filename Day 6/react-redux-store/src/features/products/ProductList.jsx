import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./productSlice";
import { addToCart } from "../cart/cartSlice";
import { useEffect } from "react";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "empty") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <p className={styles.center}> Loading products...</p>;
  }

  if (status === "failed") {
    return <p className={styles.error}> {error}</p>;
  }

  return (
    <>
      <div className={styles.productGrid}>
        {products.map((prd) => {
          return (
            <div className={styles.card} key={prd.id}>
              <img src={prd.thumbnail} alt={prd.title} />
              <h3>{prd.title}</h3>
              <p>₹{prd.price}</p>

              <button onClick={() => dispatch(addToCart(prd))}>
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductList;
