"use client"; // Directive for client component

import React, { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import InputField from './InputField';
import { useChatCooldown } from '@/lib/helpers/chatCooldown';
import { useCursorPosition } from '@/lib/helpers/useCursorPosition';

import useChatHistory from '@/lib/api/llm/useChatHistory';

interface ChatCardProps {
  threshold?: number;
  content?: string;
}

export default function ChatCard({ threshold = 20, content = '' }: ChatCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorPos = useCursorPosition();
    const { 
    startCooldown, 
    resetCooldown, 
    incrementErrorCount, 
    isCooldownActive, 
    getRemainingCooldown, 
    getCooldownMessage 
  } = useChatCooldown();
  
  const {
    messages,
    setMessages,
    sessionId,
    isLoading,
    setIsLoading,
    fetchChatHistory,
    sendMessage: sendChatMessage
  } = useChatHistory();

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Chat card open/close behavior based on cursor position
  useEffect(() => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    const isInside = cursorPos.x > rect.left && cursorPos.x < rect.right &&
      cursorPos.y > rect.top && cursorPos.y < rect.bottom;
    if (isInside) return;

    const isNearTop = cursorPos.y >= rect.top - threshold && cursorPos.y <= rect.top &&
      cursorPos.x >= rect.left && cursorPos.x <= rect.right;
    const isNearBottom = cursorPos.y >= rect.bottom && cursorPos.y <= rect.bottom + threshold &&
      cursorPos.x >= rect.left && cursorPos.x <= rect.right;
    const isNearLeft = cursorPos.x >= rect.left - threshold && cursorPos.x <= rect.left &&
      cursorPos.y >= rect.top && cursorPos.y <= rect.bottom;
    const isNearRight = cursorPos.x >= rect.right && cursorPos.x <= rect.right + threshold &&
      cursorPos.y >= rect.top && cursorPos.y <= rect.bottom;

    const shouldOpen = isNearTop || isNearBottom || isNearLeft || isNearRight;
    setIsOpen(shouldOpen);
  }, [cursorPos, threshold]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for active cooldown before sending
    if (isCooldownActive()) {
      const remainingSeconds = getRemainingCooldown();
      console.warn(`Cooldown active. Please wait ${remainingSeconds}s`);
      return;
    }
    
    const messageText = message;
    setMessage(''); // Clear input field
    
    sendChatMessage(messageText)
      .then(success => {
        if (!success) {
          incrementErrorCount();
          startCooldown();
        } else {
          resetCooldown();
        }
      });
  };

  return (
    <div 
      ref={cardRef}
      className={`fixed bottom-0 origin-bottom left-1/2 w-80 h-[500px] max-h-[90vh] flex flex-col rounded-t-md shadow-[0_-2px_10px_rgba(0,0,0,.2)] transition-transform duration-300 ease-in-out translate-x-[-50%] ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-2.5rem)]'} bg-white dark:bg-black z-[1000]`}
    >
      {/* Chat header */}
      <div 
        className="p-2 cursor-pointer rounded-t-lg flex justify-between items-center bg-[#7cbddb] dark:bg-pink text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold">Chat with Me</h3>
        <span className="text-xs">{isOpen ? '▼' : '▲'}</span>
      </div>
      
      {/* Chat messages */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 p-3 overflow-y-auto text-black bg-white dark:bg-black dark:text-white">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <p>Ask me anything about my work!</p>
              <p className="mt-2 text-xs">Ask my AI rep about what I've been up to.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-amber-50 dark:bg-gray-900">
        {isCooldownActive() ? (
          <div className="mb-2 text-sm text-center text-red-500">
            {getCooldownMessage()}
          </div>
        ) : null}
        
        <InputField
          message={message}
          setMessage={setMessage}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
