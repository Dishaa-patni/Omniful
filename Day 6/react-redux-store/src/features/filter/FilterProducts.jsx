import React from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/FilterProducts.module.css";

const FilterProducts = () => {
  //selecting the category

  const selectedCategory = useSelector((state) => state.filter.category);

  return (
    <>
      <div className={styles.selectedText}>
        <p>
          <strong>SelectedCategory: </strong>
          {selectedCategory === "all" ? "All Products" : selectedCategory}
        </p>
      </div>
    </>
  );
};

export default FilterProducts;
