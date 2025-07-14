import { useState } from "react";

const useToggle = (initial = false) => {
  const [value, setValue] = useState(false);
  const toggle = () => setValue((prev) => !prev);
  return [value, toggle];
};

export default useToggle;
