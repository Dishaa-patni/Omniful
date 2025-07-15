import React, { useState } from "react";
import "../style/accordion.css";

const faqs = [
  {
    id: 1,
    question: "What is JSX?",
    answer:
      "JSX Stands for javsscript XML . It is a syntax extension that is used in react that lets you write html like code in javascript",
  },
  {
    id: 2,
    question: "What is React?",
    answer:
      "React is a Javascript Library for building interactive uder interface",
  },
  {
    id: 3,
    question: "Lifecycle Methods of React?",
    answer: "Mounting,Updation,Unmounting",
  },
  {
    id: 4,
    question: "What are props?",
    answer:
      "Props are the properties that helps how component communicates , we can pass data from parent component to the child component.",
  },
];
const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const handleToggleIndex = (id) => {
    setOpenIndex(openIndex == id ? null : id);
  };
  return (
    <div className="accordion">
      {faqs.map((faq, id) => {
        return (
          <div key={id} className="accordion-faq">
            <button
              onClick={() => handleToggleIndex(id)}
              className="accordion-question"
            >
              {faq.question}

              {openIndex === id ? <div>⬆️</div> : <div>⬇️</div>}
            </button>
            {openIndex === id && (
              <div className="accordion-answer">{faq.answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
