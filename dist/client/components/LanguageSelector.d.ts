import React from 'react';
interface LanguageSelectorProps {
    currentLanguage: string;
    onLanguageChange: (language: string) => void;
}
declare const LanguageSelector: React.FC<LanguageSelectorProps>;
export default LanguageSelector;
