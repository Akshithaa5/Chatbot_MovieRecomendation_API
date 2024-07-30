import React, { useState } from 'react';
import ContactModal from './ContactModal';

const HelpMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleContactClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="p-4 bg-gray-800 text-white">
      <h2 className="text-xl font-bold mb-4">Help Menu</h2>
      <ul>
        <li className="mb-2">
          <button className="text-blue-400 hover:underline">
            How to use this chat
          </button>
        </li>
        <li className="mb-2">
          <button className="text-blue-400 hover:underline">
            Frequently Asked Questions
          </button>
        </li>
        <li className="mb-2">
          <button
            className="text-blue-400 hover:underline"
            onClick={handleContactClick} // Open the modal on click
          >
            Contact Support
          </button>
        </li>
      </ul>
      <ContactModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default HelpMenu;
