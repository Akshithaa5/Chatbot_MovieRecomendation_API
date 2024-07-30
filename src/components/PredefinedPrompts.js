import { useState } from 'react';
import axios from 'axios'; // Ensure axios is imported

export default function PredefinedPrompts({ predefinedPrompts, handlePromptClick }) {
  return (
    <div className="flex flex-col space-y-2">
      {predefinedPrompts.map((prompt, index) => (
        <button
          key={index}
          type="button"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
          onClick={() => handlePromptClick(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
