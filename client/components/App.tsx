import React from 'react';
import HomePage from '../pages/HomePage.tsx';
import ChatBubble from './ChatBubble.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy-700 text-white p-6">
        <h1 className="text-3xl font-bold">Medical Device Portfolio</h1>
      </header>
      <main className="container mx-auto p-4">
        <HomePage />
      </main>
      <ChatBubble />
    </div>
  );
};

export default App;