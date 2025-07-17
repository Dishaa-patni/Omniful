import CategoryDropdown from "../components/CategoryDropdown";
import Navbar from "../components/Navbar";
import FilterProducts from "../features/filter/FilterProducts";
import ProductList from "../features/products/ProductList";


const Home = () => {
  return (
    <>
      <Navbar />
      <CategoryDropdown />

      <ProductList />
    </>
  );
};

export default Home;
