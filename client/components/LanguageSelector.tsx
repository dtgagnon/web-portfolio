import React from 'react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  return (
    <div className="fixed bottom-4 right-4 flex bg-dark rounded overflow-hidden">
      <button 
        className={`px-3 py-1 text-xs font-medium ${currentLanguage === 'en' ? 'bg-dark text-cream' : 'bg-cream text-dark'}`}
        onClick={() => onLanguageChange('en')}
      >
        EN
      </button>
      <button 
        className={`px-3 py-1 text-xs font-medium ${currentLanguage === 'fr' ? 'bg-dark text-cream' : 'bg-cream text-dark'}`}
        onClick={() => onLanguageChange('fr')}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageSelector;
