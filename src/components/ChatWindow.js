// components/ChatWindow.js
import React from 'react';

const ChatWindow = ({ chatLog, isLoading }) => {
  return (
    <div className="flex flex-col space-y-4">
      {chatLog.map((entry, index) => (
        <div key={index} className={`p-2 rounded ${entry.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
          {entry.message}
        </div>
      ))}
      {isLoading && (
        <div className="p-2 bg-gray-700 text-white rounded">...</div>
      )}
    </div>
  );
};

export default ChatWindow;
