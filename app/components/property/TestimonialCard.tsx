import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  rating: number;
  comment: string;
  platformTag?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  comment,
  platformTag
}) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 md:p-8">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-green-100 transform rotate-45 translate-x-16 -translate-y-16 group-hover:from-green-100 group-hover:to-green-200 transition-colors duration-300" />
      </div>
      
      {/* Rating */}
      <div className="flex items-center mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-xl text-yellow-400">★</span>
          ))}
        </div>
        <span className="ml-2 text-lg font-bold text-gray-900">5.0</span>
      </div>
      
      {/* Comment */}
      <blockquote className="mb-6">
        <p className="text-gray-700 text-lg leading-relaxed italic">
          {comment}
        </p>
      </blockquote>
      
      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6" />
      
      {/* User info */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
        
        {platformTag && (
          <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-medium">
            {platformTag}
          </div>
        )}
      </div>
      
      {/* Decorative dots */}
      <div className="absolute bottom-4 right-4 flex space-x-1 opacity-50">
        {[1, 2, 3].map((dot) => (
          <div 
            key={dot}
            className="w-2 h-2 rounded-full bg-green-300"
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;