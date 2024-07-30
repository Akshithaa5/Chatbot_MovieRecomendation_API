// components/ChatInput.js
import React from 'react';

const ChatInput = ({ inputValue, setInputValue, handleSubmit, predefinedPromptsLeft, predefinedPromptsRight }) => {
  return (
    <div className="flex-none mb-8 p-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col space-y-2">
          {predefinedPromptsLeft.map((prompt, index) => (
            <button
              key={index}
              type="button"
              className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-600 transition duration-300"
              onClick={() => setInputValue(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex flex-col space-y-2">
          {predefinedPromptsRight.map((prompt, index) => (
            <button
              key={index}
              type="button"
              className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-600 transition duration-300"
              onClick={() => setInputValue(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        if (inputValue.trim()) {
          handleSubmit(inputValue);
          setInputValue('');
        }
      }} className="flex space-x-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 p-2 rounded border border-gray-600 bg-gray-800 text-white"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
