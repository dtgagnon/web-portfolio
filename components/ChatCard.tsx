'use client'

import { useState } from 'react';

export default function ChatCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '0',
        left: '50%',
        width: '300px',
        maxHeight: '400px',
        backgroundColor: '#f0f7f0',
        color: '#1c1c1c',
        border: '1px solid #2c5e2e',
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
          backgroundColor: '#2c5e2e',
          color: '#ffffff',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onClick={() => setIsOpen(false)}
      >
        <span>Chat</span>
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
              border: '1px solid #2c5e2e',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              color: '#1c1c1c'
            }}
            placeholder="Type your message..."
          />
        </div>
      )}
    </div>
  );
}