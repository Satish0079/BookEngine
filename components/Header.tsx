import React from 'react';
import { ChevronLeftIcon } from './icons';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <header className="sticky top-0 bg-white z-10 p-4 border-b border-border-light flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {onBack && (
          <button onClick={onBack} className="text-text-primary hover:text-primary transition-colors">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
      </div>
      {/* Could add more elements here if needed */}
    </header>
  );
};
