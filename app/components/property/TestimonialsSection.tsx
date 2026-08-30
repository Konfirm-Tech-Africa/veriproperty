
import React from 'react';
import TestimonialCard from './TestimonialCard';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah O.',
      role: 'Buyer',
      rating: 5,
      comment: 'Finding my dream home was effortless with this platform. The advanced search filters made all the difference!',
      platformTag: 'platform'
    },
    {
      name: 'James T.',
      role: 'Renter',
      rating: 5,
      comment: 'The variety of rental properties available exceeded my expectations. Highly recommend to anyone looking for a new place!',
      platformTag: 'platform'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12">
          <div className="text-center mb-12 md:mb-0 md:text-left flex items-center space-x-4 flex-col md:flex-row">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 items-center">
              What Our Users Say
            </h1>
            <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              platform
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl text-yellow-400">★</span>
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">5.0</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
