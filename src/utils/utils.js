// utils/utils.js
export const truncateMessage = (message, maxLength = 100) => {
    if (message.length <= maxLength) return message;
    return `${message.substring(0, maxLength)}...`;
  };
  