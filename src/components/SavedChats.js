// components/SavedChats.js
import React from 'react';

const SavedChats = ({ savedChats, menuIndex, handleMenuClick, handleDeleteChat }) => {
  return (
    <div className="relative flex flex-col w-1/6 bg-gray-800 p-4 text-white h-full">
      <h2 className="text-xl font-bold mb-4">Saved Chats</h2>
      <div className="overflow-y-auto flex-grow max-h-[calc(100vh-4rem)]">
        {savedChats.length === 0 ? (
          <p className="text-gray-400 text-center">No saved chats</p>
        ) : (
          savedChats.map((chat, index) => (
            <div key={chat.timestamp || index} className="relative mb-2 p-2 bg-gray-700 rounded">
              <button
                className="absolute top-2 right-2 p-1"
                onClick={() => handleMenuClick(index)}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 3C6.477 3 2 6.477 2 10s4.477 7 10 7c2.023 0 3.99-.462 5.704-1.285L22 21l-2.72-5.272C21.235 14.908 22 13.485 22 12c0-3.523-4.477-7-10-7zm-2 10h4v2h-4zm0-4h4v2h-4z" />
                </svg>
              </button>
              {menuIndex === index && (
                <div className="absolute top-8 right-2 bg-gray-900 text-white rounded shadow-lg">
                  <ul>
                    <li className="p-2 hover:bg-gray-700 cursor-pointer" onClick={() => handleDeleteChat(index)}>
                      Delete
                    </li>
                    <li className="p-2 hover:bg-gray-700 cursor-pointer">Share</li>
                    <li className="p-2 hover:bg-gray-700 cursor-pointer">Rename</li>
                    <li className="p-2 hover:bg-gray-700 cursor-pointer">Archive</li>
                  </ul>
                </div>
              )}
              <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                {chat.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedChats;
