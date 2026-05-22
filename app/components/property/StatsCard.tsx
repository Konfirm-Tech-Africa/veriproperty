// components/stats/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
  value: string;
  title: string;
  description: string;
  highlight?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  value,
  title,
  description,
  highlight = false
}) => {
  return (
    <div className={`
      relative p-6 rounded-2xl transition-all duration-300
      ${highlight 
        ? 'bg-gradient-to-r from-green-700 to-green-800 text-white shadow-lg transform hover:-translate-y-1' 
        : 'bg-white text-gray-900 shadow-md hover:shadow-xl'
      }
    `}>
      {/* Corner accent for highlight card */}
      {highlight && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-gray-900">★</span>
        </div>
      )}
      
      <div className="text-center">
        {/* Value */}
        <div className={`
          text-4xl md:text-5xl font-bold mb-2
          ${highlight ? 'text-white' : 'text-gray-900'}
        `}>
          {value}
        </div>
        
        {/* Title */}
        <h3 className={`
          text-lg md:text-xl font-semibold mb-2
          ${highlight ? 'text-blue-100' : 'text-gray-800'}
        `}>
          {title}
        </h3>
        
        {/* Separator */}
        <div className={`
          w-12 h-0.5 mx-auto mb-3
          ${highlight ? 'bg-blue-300' : 'bg-gray-300'}
        `} />
        
        {/* Description */}
        <p className={`
          text-sm md:text-base
          ${highlight ? 'text-blue-100' : 'text-gray-600'}
        `}>
          {description}
        </p>
      </div>
      
      {/* Decorative dots */}
      <div className="absolute bottom-4 left-4 flex space-x-1">
        {[1, 2, 3].map((dot) => (
          <div 
            key={dot}
            className={`
              w-1 h-1 rounded-full
              ${highlight ? 'bg-blue-300' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsCard;