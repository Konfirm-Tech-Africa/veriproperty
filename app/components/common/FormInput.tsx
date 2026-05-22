import React from 'react';

interface FormInputProps {
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; // Add this line
}

export const FormInput = ({ 
  type, 
  placeholder, 
  icon, 
  value, 
  onChange, 
  required = false // Add with default value
}: FormInputProps) => (
  <div className="relative flex items-center mb-4">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 pl-10 text-gray-900 placeholder-gray-500 bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);