import React, { useEffect, useState } from "react";
import "../style/infiniteScroll.css";

const InfiniteScroll = () => {
  const [product, setProduct] = useState([]);
  // const [page, setPage] = useState(0);

  const fetchProducts = async () => {
    try {
      // console.log("Fetching page", page);
      const res = await fetch(`https://dummyjson.com/products?limit=10&skip=0`);
      const data = await res.json();
      console.log("API respnse is there", data.products);
      setProduct((prev) => {
        const updated = [...prev, ...data.products];
        return updated;
      });
    } catch (err) {
      console.log("Error", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  console.log(product);
  return (
    <div>
      <h1>Products Gallary</h1>
      <div className="product-grid">
        {product.map((image) => (
          <div className="product-card" key={image.id}>
            <img
              className="product-img"
              src={image.thumbnail}
              alt={image.title}
            />
            <h4>{image.title}</h4>
          </div>
        ))}
      </div>
      <div>Loading More.....</div>
    </div>
  );
};

export default InfiniteScroll;
