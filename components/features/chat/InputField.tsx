import React from 'react';

interface InputFieldProps {
  message: string;
  setMessage: (message: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const InputField: React.FC<InputFieldProps> = ({ message, setMessage, isLoading, onSubmit }) => {
    return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
        aria-label="Message input"
      />
      <button
        className="px-4 py-2 bg-[skyblue] text-black rounded hover:bg-sky-600 disabled:opacity-50 transition-colors"
        type="submit"
        disabled={isLoading || !message.trim()}
        aria-label="Send message"
      >
        {isLoading ? (
          <span className="inline-block animate-spin">⟳</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 2L11 13"></path>
            <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
          </svg>
        )}
      </button>
    </form>
  );
};

export default InputField;