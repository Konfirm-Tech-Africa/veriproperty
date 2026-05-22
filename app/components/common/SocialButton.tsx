import React from 'react';

interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
}

export const SocialButton = ({ icon, text }: SocialButtonProps) => (
  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium transition-colors border rounded-xl border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer">
    {icon}
    <span>{text}</span>
  </button>
);