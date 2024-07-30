const ScrollToBottomButton = ({ isVisible }) => {
  const scrollToBottom = () => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  return (
    isVisible && (
      <button
        onClick={scrollToBottom}
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
