import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const FaqItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(faq.isActive || false);

  const toggleFaq = () => setIsOpen(!isOpen);

  return (
    <div className="rounded-xl border border-purple-200 mb-4 bg-white shadow transition-all duration-300">
      <button
        type="button"
        className="w-full flex justify-between items-center px-4 sm:px-6 py-4 text-left font-semibold text-black focus:outline-none"
        onClick={toggleFaq}
      >
        <span className="text-base sm:text-lg">{faq.title}</span>
        {isOpen ? (
          <FiChevronUp className="text-purple-700 w-6 h-6 sm:w-8 sm:h-8" />
        ) : (
          <FiChevronDown className="text-purple-700 w-6 h-6 sm:w-8 sm:h-8" />
        )}
      </button>
      <div className={`${isOpen ? "block" : "hidden"} px-4 sm:px-6 pb-4 text-gray-700`}>
        <p className="text-sm sm:text-base">{faq.content}</p>
      </div>
    </div>
  );
};

FaqItem.propTypes = {
  faq: PropTypes.object.isRequired,
};

const Faq8 = ({ items = [] }) => {
  return (
    <section className="py-8 sm:py-10 md:py-16 bg-transparent">
      <div className="max-w-3xl mx-auto px-2 sm:px-0">
        <h2 className="font-bold text-xl sm:text-2xl md:text-4xl text-center mb-6 text-black">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-center mb-8 text-gray-700">
          Find answers to common questions about MysticGifts, our products, and how we support creators and customers.
        </p>
        <div>
          {items.map((faq, i) => (
            <FaqItem faq={faq} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq8;