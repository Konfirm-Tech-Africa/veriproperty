// Select Field Component
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SelectField({ 
  label, 
  value, 
  options, 
  onChange, 
  disabled = false, 
  placeholder = "Select an option",
  size = 'md'
}: SelectFieldProps) {
  // Size classes for responsive design
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-2',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-3 px-4'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="space-y-1 sm:space-y-2">
      <label className={`block font-medium text-gray-700 ${labelSizes[size]}`}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
            appearance-none bg-white transition-colors
            ${sizeClasses[size]}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-gray-400'}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg 
            className={`text-gray-400 ${iconSizes[size]}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}