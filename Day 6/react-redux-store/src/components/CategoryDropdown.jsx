import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/CategoryDropdown.module.css";
import { setCategory } from "../features/filter/filterSlice";

const CategoryDropdown = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const selectedCategory = useSelector((state) => state.filter.category);

  const allCategories = products.map((p) => p.category);
  const uniqueCategories = [];

  allCategories.forEach((category) => {
    if (!uniqueCategories.includes(category)) {
      uniqueCategories.push(category);
    }
  });

  const handleChange = (e) => {
    dispatch(setCategory(e.target.value));
  };

  const categories = ["all", ...uniqueCategories];

  return (
    <div className={styles.dropdownCategory}>
      <label htmlFor="category" className={styles.label}>
        Select Category
      </label>
      <select
        id="category"
        value={selectedCategory}
        onChange={handleChange}
        className={styles.dropdown}
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;
