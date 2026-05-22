import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function ToggleSwitch({ enabled, onToggle, size = 'md' }: ToggleSwitchProps) {
  const sizes = {
    sm: 'h-4 w-8',
    md: 'h-6 w-11',
    lg: 'h-7 w-14'
  };

  const dotSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const dotPositions = {
    sm: enabled ? 'translate-x-4' : 'translate-x-1',
    md: enabled ? 'translate-x-6' : 'translate-x-1',
    lg: enabled ? 'translate-x-7' : 'translate-x-1'
  };

  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center rounded-full transition-colors ${
        sizes[size]
      } ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block transform rounded-full bg-white transition-transform ${
          dotSizes[size]
        } ${
          dotPositions[size]
        }`}
      />
    </button>
  );
}