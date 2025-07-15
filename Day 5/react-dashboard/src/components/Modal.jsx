import React, { useState } from "react";
import "../style/modal.css";

const Modal = () => {
  const MyModal = () => {
    return (
      <>
        <div className="modal-wrap"></div>
        <div className="modal-container">
          <h2>Product Inform action</h2>
          <p>
            This product is made from premium materials and comes with a 1-year
            warranty. Limited stock available, so order soon!
          </p>
          <button onClick={() => setShowModal(false)}>OK</button>
        </div>
      </>
    );
  };
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button className="modal-btn" onClick={() => setShowModal(true)}>
        Open Modal
      </button>
      {showModal && <MyModal />}
    </>
  );
};

export default Modal;
