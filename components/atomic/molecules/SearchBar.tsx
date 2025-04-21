import React, { useState } from 'react';
import { Input, Button } from '@/components/atomic/atoms';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  buttonText?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search...',
  className = '',
  buttonText = 'Search'
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <Input
        type="search"
        id="search"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" variant="primary" size="md">
        {buttonText}
      </Button>
    </form>
  );
}