import Cart from "./features/cart/Cart";
import ProductList from "./features/products/ProductList";

function App() {
  return (
    <>
      <div>
        <h1 style={{ textAlign: "center" }}>🛍️ Simple Redux Store</h1>
        <ProductList />
        <Cart />
      </div>
    </>
  );
}

export default App;
