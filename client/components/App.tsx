import React, { useState } from 'react';
import HomePage from '../pages/HomePage.tsx';
import ChatCard from './ChatCard.tsx';
import LanguageSelector from './LanguageSelector.tsx';

const App: React.FC = () => {
  const [language, setLanguage] = useState('en');
  
  return (
    <div className="min-h-screen bg-cream text-text">
      <header className="container mx-auto px-6 pt-8 max-w-5xl">
        <div className="flex justify-between items-center">
          {/* Top left: Name/home link combo */}
          <a href="#" className="flex items-center no-underline text-dark">
            <div className="font-medium uppercase text-xs tracking-wider">
              <div>Derek</div>
              <div>Gagnon</div>
            </div>
          </a>
          
          {/* Top center: empty space */}
          <div className="flex-1"></div>
          
          {/* Top right: blog link */}
          <a href="#" className="text-xs font-medium tracking-wider uppercase hover:text-pink transition-colors flex items-center">
            <span className="mr-1">→</span> BLOG
          </a>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-6 max-w-5xl">
        <HomePage />
      </main>
      
      {/* Bottom center: small peeking chat card */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center">
        <ChatCard />
      </div>
      
      {/* Language selector - moved to a less prominent position */}
      <div className="fixed bottom-8 right-8 z-40">
        <LanguageSelector 
          currentLanguage={language} 
          onLanguageChange={setLanguage} 
        />
      </div>
      
      {/* Pink bottom border */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-pink"></div>
    </div>
  );
};

export default App;