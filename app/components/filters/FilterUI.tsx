'use client';
import React from 'react';

interface FilterUIProps {
  onClose: () => void;
  activeTab: 'Property Type' | 'Price' | 'Bedroom';
  setActiveTab: (tab: 'Property Type' | 'Price' | 'Bedroom') => void;
  renderTabContent: () => React.ReactNode;
  onClear: () => void;
  onApply: () => void;
}

const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FilterUI: React.FC<FilterUIProps> = ({
  onClose,
  activeTab,
  setActiveTab,
  renderTabContent,
  onClear,
  onApply,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Filters</h2>
            <button 
              onClick={onClose} 
              className="p-1 sm:p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              <CloseIcon />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex mt-4 overflow-x-auto scrollbar-hide -mx-4 px-4">
            {['Property Type', 'Price', 'Bedroom'].map(tab => (
              <button
                key={tab}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 text-base sm:text-lg font-semibold border-b-2 transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab as 'Property Type' | 'Price' | 'Bedroom')}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div className="py-4 sm:py-6 max-h-[50vh] sm:max-h-[40vh] overflow-y-auto">
            {renderTabContent()}
          </div>
          
          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
            <button
              onClick={onClear}
              className="w-full py-3 px-6 text-base sm:text-lg font-semibold rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200"
            >
              Clear
            </button>
            <button
              onClick={onApply}
              className="w-full py-3 px-6 text-base sm:text-lg font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterUI;