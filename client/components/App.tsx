import React from 'react';
import HomePage from '../pages/HomePage.tsx';
import EnhancedChatCard from './EnhancedChatCard.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream text-text">
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-18">
          <div className="logo">
            DG
          </div>
          <a 
            href="#" 
            className="text-sm font-medium tracking-wide hover:text-pink transition-colors"
          >
            → BLOG
          </a>
        </div>
        <HomePage />
      </main>
      
      {/* Add the enhanced chat card */}
      <EnhancedChatCard />
    </div>
  );
};

export default App;