import React from 'react';

export interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const AuthSocialButton: React.FC<SocialButtonProps> = ({
  icon,
  text,
  onClick,
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full px-4 py-3 text-sm font-semibold text-gray-700 transition-colors bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {loading ? (
        <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      ) : (
        <span className="mr-2">{icon}</span>
      )}
      {loading ? 'Loading...' : text}
    </button>
  );
};

export default AuthSocialButton;