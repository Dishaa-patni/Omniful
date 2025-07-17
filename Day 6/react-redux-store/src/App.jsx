import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
<ToastContainer position="top-right" autoClose={2000} />;
function App() {
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={1000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route />
      </Routes>
    </>
  );
}

export default App;
