'use client'

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TypingAnimation from '../components/TypingAnimation';
import Link from 'next/link';
import ContactModal from '../components/ContactModal'; // Import the ContactModal component
import HelpMenu from '../components/HelpMenu';
const truncateMessage = (message) => {
  return message.length > MAX_MESSAGE_LENGTH ? `${message.substring(0, MAX_MESSAGE_LENGTH)}...` : message;
};
const ScrollToBottomButton = ({ isVisible, onClick }) => {
  return (
    isVisible && (
      <button
        onClick={onClick}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none transition-colors duration-300"
        aria-label="Scroll to bottom"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>
    )
  );
};

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedChats, setSavedChats] = useState([]);
  const [menuIndex, setMenuIndex] = useState(null);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef(null); // Reference for chat container

  useEffect(() => {
    // Load saved chats from local storage
    const savedChatsFromStorage = localStorage.getItem('savedChats');
    if (savedChatsFromStorage) {
      setSavedChats(JSON.parse(savedChatsFromStorage));
    }
  }, []);

  useEffect(() => {
    // Automatically scroll to the bottom when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatLog]); // Run this effect whenever chatLog changes

  const toggleHelpMenu = () => {
    setIsHelpMenuOpen(!isHelpMenuOpen);
  };


  const predefinedPromptsLeft = [
    "Recommend a good action movie.",
    "What are some popular comedies to watch?",
    "Suggest a movie for a family movie night.",
    "What are the latest releases in science fiction?"
  ];
  const predefinedPromptsRight = [
    "Can you recommend a romantic movie?",
    "Give me a list of top-rated horror movies.",
    "Suggest a classic movie from the 90s.",
    "What are some must-watch animated films?"
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    setChatLog((prevChatLog) => [...prevChatLog, { type: 'user', message: inputValue, timestamp: new Date().toISOString() }]);
    sendMessage(inputValue);
    setInputValue('');
  };

  const sendMessage = async (message) => {
    const lowerCaseMessage = message.toLowerCase();

    const showTypingAnimation = () => {
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: '...', timestamp: new Date().toISOString() }]);
    };

    const removeTypingAnimation = () => {
      setChatLog((prevChatLog) => prevChatLog.filter(msg => msg.message !== '...'));
    };
    const predefinedResponses = {
      'recommend a good action movie.': "For a great action movie, you might enjoy *Mad Max: Fury Road* or *John Wick*. Both are packed with thrilling action scenes!",
      'what are some popular comedies to watch?': "Popular comedies include *Superbad*, *The Hangover*, and *Crazy, Stupid, Love*. They're sure to make you laugh!",
      'suggest a movie for a family movie night.': "For a family movie night, consider *The Incredibles*, *Finding Nemo*, or *Paddington*. These are enjoyable for all ages!",
      'what are the latest releases in science fiction?': "Recent sci-fi releases include *Dune*, *The Matrix Resurrections*, and *The Midnight Sky*. They're packed with futuristic adventures!",
      'can you recommend a romantic movie?': "For a romantic movie, *The Notebook*, *Pride and Prejudice*, and *La La Land* are great choices.",
      'give me a list of top-rated horror movies.': "Top-rated horror movies include *Get Out*, *The Conjuring*, and *Hereditary*. They offer plenty of scares!",
      'suggest a classic movie from the 90s.': "Classics from the 90s include *Pulp Fiction*, *Forrest Gump*, and *The Shawshank Redemption*. Each is a must-see!",
      'what are some must-watch animated films?': "Must-watch animated films include *Spirited Away*, *Toy Story*, and *The Lion King*. They’re beloved by audiences of all ages.",
      'hi': "Hi there! How can I assist you today?",
      'hello': "Hello! Looking for movie recommendations?",
      'goodbye': "Goodbye! Have a great day!",
      'bye': "Goodbye! Have a great day!",
      'thank you': "You're welcome! If you have any more questions, feel free to ask.",
      'thanx': "You're welcome! If you have any more questions, feel free to ask.",
      'what is your name?': "I'm your friendly movie recommendation bot!",
      'who are you?': "I'm your friendly movie recommendation bot!",
    };

    const defaultResponse = "I'm a movie recommendation assistant and I'm here to help you with anything related to movies. Feel free to ask me any questions about that!";

    if (predefinedResponses[lowerCaseMessage]) {
      const predefinedResponse = predefinedResponses[lowerCaseMessage];

      showTypingAnimation();

      setTimeout(() => {
        removeTypingAnimation();
        setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: predefinedResponse }]);
        setSavedChats((prevSavedChats) => {
          const newSavedChats = [...prevSavedChats, { type: 'bot', message: predefinedResponse }];
          localStorage.setItem('savedChats', JSON.stringify(newSavedChats));
          return newSavedChats;
        });
      }, 1000);

      return;
    }

    showTypingAnimation();

    setTimeout(() => {
      removeTypingAnimation();
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: defaultResponse }]);
      setSavedChats((prevSavedChats) => {
        const newSavedChats = [...prevSavedChats, { type: 'bot', message: defaultResponse }];
        localStorage.setItem('savedChats', JSON.stringify(newSavedChats));
        return newSavedChats;
      });
    }, 1000);

    const url = '/api/chat';
    const data = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    };
    setIsLoading(true);

    try {
      const response = await axios.post(url, data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      removeTypingAnimation();

      const newMessage = response.data.message;
      setChatLog((prevChatLog) => [...prevChatLog, { type: 'bot', message: newMessage }]);
      setSavedChats((prevSavedChats) => {
        const newSavedChats = [
          ...prevSavedChats,
          { type: 'bot', message: newMessage, timestamp: new Date().toISOString() }
        ];
        localStorage.setItem('savedChats', JSON.stringify(newSavedChats));
        return newSavedChats;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      removeTypingAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setChatLog([]);
    setInputValue('');
  };

  const handleMenuClick = (index) => {
    setMenuIndex(index === menuIndex ? null : index);
  };

  const handleDeleteChat = (index) => {
    const updatedSavedChats = savedChats.filter((_, i) => i !== index);
    setSavedChats(updatedSavedChats);
    localStorage.setItem('savedChats', JSON.stringify(updatedSavedChats));
  };

  const handleScroll = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const atBottom = chatContainer.scrollHeight - chatContainer.scrollTop === chatContainer.clientHeight;
      setShowScrollButton(!atBottom);
    }
  };
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);


  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setShowScrollButton(false);
    }
  };
 

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, [chatContainerRef]);


  return (
    
    <div className="flex flex-col h-screen">
    <div className="flex flex-grow">
      <div className="relative flex flex-col w-1/6 bg-gray-800 p-4 text-white h-full">
        <h2 className="text-xl font-bold mb-4">Saved Chats</h2>
        <div
          className="overflow-y-auto flex-grow max-h-[calc(100vh-4rem)]"
          ref={chatContainerRef} // Attach the reference here
        >
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
                  {chat.message}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-gray-900">
          <div className="flex justify-between items-center p-4 bg-gray-800">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNewChat}
                className="bg-white text-black p-2 rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 3C6.477 3 2 6.477 2 10s4.477 7 10 7c2.023 0 3.99-.462 5.704-1.285L22 21l-2.72-5.272C21.235 14.908 22 13.485 22 12c0-3.523-4.477-7-10-7zm-2 10h4v2h-4zm0-4h4v2h-4z" />
                </svg>
                <span className="sr-only">New Chat</span>
              </button>
              <li>
                <Link href="/login" className="text-white font-semibold">/ Login</Link>
              </li>
              {/* Add other links as needed */}
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="https://github.com/Akshithaa5?tab=repositories" legacyBehavior>
                <a className="bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-gray-600 transition duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.838 9.485.5.092.682-.217.682-.482v-1.7c-2.774.604-3.357-1.334-3.357-1.334-.453-1.15-1.106-1.459-1.106-1.459-.906-.621.069-.609.069-.609 1.003.071 1.527 1.033 1.527 1.033.891 1.526 2.335 1.085 2.903.83.092-.646.349-1.085.636-1.335-2.223-.253-4.556-1.114-4.556-4.947 0-1.093.39-1.986 1.03-2.684-.103-.253-.447-1.274.096-2.658 0 0 .842-.27 2.753 1.027.797-.222 1.652-.333 2.5-.337.847.004 1.703.115 2.501.337 1.91-1.297 2.751-1.027 2.751-1.027.542 1.384.199 2.405.097 2.658.64.698 1.03 1.591 1.03 2.684 0 3.843-2.338 4.694-4.567 4.944.361.312.683.923.683 1.853v2.743c0 .266.184.577.691.478C19.135 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  <span className="hidden md:inline">GitHub</span>
                </a>
              </Link>
              <Link href="https://vercel.com/new" legacyBehavior>
                <a className="bg-white text-black px-4 py-2 rounded flex items-center space-x-2 hover:bg-white-900 transition duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 12l9 9 9-9-9-9-9 9z" />
                  </svg>
                  <span className="hidden md:inline">Deploy to Vercel</span>
                </a>
              </Link>
            </div>
          </div>
          
          {/* Welcome Text */}
          {chatLog.length === 0 && !isLoading && (
            <div className="flex-grow flex items-center justify-center">
              <div className="bg-gray-700 p-4 rounded-lg text-center text-white max-w-md">
                <h1 className="text-lg font-bold mb-2">Welcome to Next.js AI Chatbot!</h1>
                <p className="text-sm mb-2">
                  This is an open source AI chatbot app template built with <strong>Next.js</strong>, the <strong>Vercel AI SDK</strong>, and <strong>Vercel KV</strong>.
                </p>
                <p className="text-sm">
                  It uses <strong>React Server Components</strong> to combine text with generative UI as output of the LLM. The UI state is synced through the SDK so the model is aware of your interactions as they happen.
                </p>
              </div>
            </div>
          )}
          
          {/* Chat Messages */}
            {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Log */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-4 overflow-y-auto"
          style={{ scrollBehavior: 'smooth' }}
        >
          {chatLog.map((entry, index) => (
            <div
              key={index}
              className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'
                } mb-2`}
            >
              <div
                className={`p-2 rounded-lg ${entry.type === 'user' ? 'bg-blue-500 text-white' : 'bg-purple-400 text-black-800'
                  } max-w-xs`}
              >
                {entry.message}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-2">
              <div className="p-2 rounded-lg bg-gray-300 text-gray-800 max-w-xs">
                Loading...
              </div>
            </div>
          )}
        </div>
          
          {/* Input Form and Prompts */}
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

            <form onSubmit={handleSubmit} className="p-3 fixed bottom-0 w-full flex justify-center" style={{ marginLeft: '-1in' }}>
              <div className="flex items-center space-x-1 bg-gray-600 rounded-full p-1 w-full max-w-lg">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 p-2 bg-transparent text-white focus:outline-none rounded-full"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()} // Disable button if inputValue is empty or just whitespace
                  className={`bg-purple-500 rounded-full px-4 py-2 text-white font-semibold focus:outline-none transition-colors duration-300 ${
                    !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'
                  }`}
                >
                  Send
                </button>
              </div>
            
            </form>
            <ScrollToBottomButton
        isVisible={showScrollButton}
        onClick={() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        }}
      />

            {/* Help & FAQ Menu */}
            <div className="relative">
              <button
                className="fixed bottom-8 right-8 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none transition-colors duration-300"
                onClick={toggleHelpMenu}
              >
                ?
              </button>

              {isHelpMenuOpen && (
                <div className="fixed bottom-16 right-8 bg-gray-800 text-white rounded-lg shadow-lg p-4">
                  <ul>
                    <li className="p-2 hover:bg-gray-700 cursor-pointer">Help & FAQ</li>
                    <li className="p-2 hover:bg-gray-700 cursor-pointer">Contact Us</li>
                    <li className="p-2 hover:bg-gray-700 cursor-pointer">Terms & Policies</li>
                    <li className="p-2 hover:bg-gray-700 cursor-pointer">Settings</li>
                  </ul>
                </div>
              )}
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
