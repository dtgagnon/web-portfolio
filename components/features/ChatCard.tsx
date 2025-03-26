// Here's how to have a ChatCard expand or pop up when your pointer is near its edges:
// 1) capture the cursor's position using a custom hook (or a small effect). 
// 2) check if the cursor is within a threshold distance from any edge of the card's bounding box.
// 3) if yes, set state to expand; otherwise collapse.
// This example uses a threshold in px and a scale transform for pop-up effect.
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useCursorPosition } from '@/lib/useCursorPosition';

interface ChatCardProps {
  threshold?: number;
  content: string;
}

export default function ChatCard({ threshold = 20, content }: ChatCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorPos = useCursorPosition();

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
      ref={cardRef}
      style={{
        position: 'fixed',
        bottom: '0',
        left: '50%',
        width: '300px',
        maxHeight: '400px',
        backgroundColor: '#fff3e0',
        color: '#1c1c1c',
        border: '1px solid #3c4e74',
        borderRadius: '8px 8px 0 0',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        transform: isOpen ? 'translate(-50%, 0)' : 'translate(-50%, calc(100% - 2.5rem))',
        transformOrigin: 'center bottom',
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
        zIndex: 1000
      }}
      onMouseEnter={() => !isOpen && setIsOpen(true)}
    >
      <div 
        style={{
          padding: '0.5rem',
          backgroundColor: '#3c4e74',
          color: '#fff3e0',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onClick={() => setIsOpen(false)}
      >
        <span>Chat w/ Derek's Portfolio!</span>
        <span>{isOpen ? '▼' : '▲'}</span>
      </div>
      {isOpen && (
        <div style={{ padding: '1rem' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #3c4e74',
              borderRadius: '4px',
              backgroundColor: '#fff3e0',
              color: '#1c1c1c'
            }}
            placeholder="Ask away!"
          />
          {content}
        </div>
      )}
    </div>
  );
}
