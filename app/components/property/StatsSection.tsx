
import React from 'react';
import StatsCard from './StatsCard';

const StatsSection: React.FC = () => {
  const statsData = [
    {
      value: '10K+',
      title: 'Professionals Buyers/Renters',
      description: 'Active users',
      suffix: '+',
      highlight: false
    },
    {
      value: '95%',
      title: 'Satisfaction Rate',
      description: 'User feedback',
      suffix: '%',
      highlight: false
    },
    {
      value: '10K+',
      title: 'Professionals Agents/Brokers, landlords/owners',
      description: 'Active users',
      suffix: '+',
      highlight: false
    },
    {
      value: '95%',
      title: 'Satisfaction Rate',
      description: 'User feedback',
      suffix: '%',
      highlight: true
    },
    {
      value: '2.1K',
      title: 'Buyer Successes',
      description: 'Success stories',
      suffix: 'K',
      highlight: false
    },
    {
      value: '4.9/5',
      title: 'Platform Rating',
      description: 'Industry average',
      suffix: '/5',
      highlight: false
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Smart Properties
          </h1>
          <p className="text-gray-600 text-lg">
            Locate your dream property with ease using our advanced search and filtering options.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              value={stat.value}
              title={stat.title}
              description={stat.description}
              highlight={stat.highlight}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;