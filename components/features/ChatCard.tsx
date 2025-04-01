"use client"; // Directive for client component

import React, { useState, useEffect, useRef } from 'react';
import { useCursorPosition } from '@/lib/useCursorPosition';
import { useDarkMode } from '../context/DarkModeContext';

interface ChatCardProps {
  threshold?: number;
  content: string;
}

export default function ChatCard({ threshold = 20, content }: ChatCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorPos = useCursorPosition();
  const { isDarkMode } = useDarkMode();

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

  return (
    <div 
      className={`fixed bottom-0 origin-bottom left-1/2 w-80 max-h-[400px] border-[1px solid ${isDarkMode ? '#3c4e74' : '#3c4e74'}] rounded-[8px] shadow-[0_-2px_10px_rgba(0,0,0,.2)]
      transition-transform duration-300 ease-in-out cursor-pointer z-1000
      ${isOpen ? 'translate-x-[-50%] translate-y-0' : 'translate-x-[-50%] translate-y-[calc(100%-2.5rem)]'}`}
      style={{
        backgroundColor: isDarkMode ? '#1c1c1c' : '#faf8f2',
        color: isDarkMode ? '#faf8f2' : '#1c1c1c',
      }}
      ref={cardRef}
      onMouseEnter={() => !isOpen && setIsOpen(true)}
    >
      <div className={`flex ${isDarkMode ? 'bg-[#3c4e74] text-[#faf8f2]' : 'bg-[#3c4e74] text-[#fff3e0]'} rounded-t-[8px] items-center justify-between p-2`} onClick={() => setIsOpen(false)}>
        <span className="text-sm">Chat with Derek's Portfolio!</span>
        <span className="text-sm">{isOpen ? '▼' : '▲'}</span>
      </div>
      {isOpen && (
        <div className="p-4">
          <input className={`w-full p-2 border border-[${isDarkMode ? '#3c4e74' : '#3c4e74'}] rounded-[4px] bg-[${isDarkMode ? '#1c1c1c' : '#faf8f2'}] text-[${isDarkMode ? '#faf8f2' : '#1c1c1c'}]`}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Coming soon!"
          />
          {content}
        </div>
      )}
    </div>
  );
}
