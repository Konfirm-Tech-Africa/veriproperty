"use client";
import React, { useState, useCallback } from 'react';
import { Search, SlidersHorizontal, Home, DollarSign, BedDouble, Bookmark, X } from 'lucide-react';
import FilterModal from '../filters/FilterModal';

interface SearchFilterBarProps {
  onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  currentFilters: SearchFilters;
  agentId?: string;
}

interface SearchFilters {
  searchTerm: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  isForRent: boolean;
}

const SearchFilterBar = ({ onFilterChange, currentFilters }: SearchFilterBarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const filters = currentFilters;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    onFilterChange({ searchTerm: newSearchTerm });
  };

  const handleSaveSearch = () => {
    alert('Search saved!');
  };

  const updateFilter = useCallback(<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    onFilterChange({ [key]: value });
  }, [onFilterChange]);

  const handleApplyFilters = useCallback((modalFilters: {
    propertyTypes: string[];
    prices: string[];
    bedrooms: string[];
  }) => {
    if (modalFilters.propertyTypes.length > 0) {
      updateFilter('propertyType', modalFilters.propertyTypes[0]);
    } else {
      updateFilter('propertyType', '');
    }

    if (modalFilters.bedrooms.length > 0) {
      updateFilter('bedrooms', parseInt(modalFilters.bedrooms[0]) || 0);
    } else {
      updateFilter('bedrooms', 0);
    }

    // Handle price ranges from modal
    if (modalFilters.prices.length > 0) {
      const priceRange = modalFilters.prices[0];
      let minPrice = 0;
      let maxPrice = 10000000;

      if (priceRange === 'under-50m') {
        maxPrice = 50000000;
      } else if (priceRange === '50m-100m') {
        minPrice = 50000000;
        maxPrice = 100000000;
      } else if (priceRange === '100m-500m') {
        minPrice = 100000000;
        maxPrice = 500000000;
      } else if (priceRange === 'over-500m') {
        minPrice = 500000000;
        maxPrice = 1000000000;
      }

      updateFilter('minPrice', minPrice);
      updateFilter('maxPrice', maxPrice);
    } else {
      updateFilter('minPrice', 0);
      updateFilter('maxPrice', 10000000);
    }

    setIsModalOpen(false);
  }, [updateFilter]);

  const clearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      searchTerm: '',
      propertyType: '',
      minPrice: 0,
      maxPrice: 10000000,
      bedrooms: 0,
      isForRent: false
    };
    onFilterChange(clearedFilters);
  }, [onFilterChange]);

  const formatPriceDisplay = () => {
    if (filters.minPrice === 0 && filters.maxPrice === 10000000) {
      return 'Price';
    }
    
    if (filters.maxPrice === 10000000) {
      return `Under ₦${filters.minPrice/1000000}M`;
    }
    
    return `₦${filters.minPrice/1000000}M-₦${filters.maxPrice/1000000}M`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
      {/* Search Bar - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Districts like D18, Properties, Locations..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchExpanded(true)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 text-sm sm:text-base rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSearchExpanded && (
            <button 
              onClick={() => setIsSearchExpanded(false)}
              className="sm:hidden absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button 
          onClick={handleSaveSearch}
          className="flex-shrink-0 w-full sm:w-auto px-4 sm:px-6 py-3 bg-white text-gray-800 font-semibold rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200 shadow-sm flex items-center justify-center text-sm sm:text-base"
        >
          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Save Search
        </button>
      </div>

      {/* Quick Filter Buttons - Mobile Optimized */}
      <div className="flex flex-wrap justify-start gap-2 sm:gap-3 mt-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-3 sm:px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Filters
          {(filters.propertyType !== '' || filters.bedrooms > 0 || filters.minPrice > 0 || filters.maxPrice < 10000000) && (
            <span className="ml-1 sm:ml-2 bg-green-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center">
              !
            </span>
          )}
        </button>
        
        <button 
          onClick={() => updateFilter('isForRent', !filters.isForRent)}
          className={`flex items-center px-3 sm:px-4 py-2 rounded-full border transition-colors duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
            filters.isForRent 
              ? 'bg-green-500 text-white border-green-500' 
              : 'border-gray-300 hover:bg-gray-100'
          }`}
        >
          {filters.isForRent ? 'For Rent' : 'For Sale'}
        </button>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-3 sm:px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          {filters.propertyType || 'Type'}
        </button>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-3 sm:px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
        >
          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          {formatPriceDisplay()}
        </button>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-3 sm:px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
        >
          <BedDouble className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          {filters.bedrooms > 0 ? `${filters.bedrooms}+ Beds` : 'Beds'}
        </button>

        {(filters.propertyType !== '' || filters.bedrooms > 0 || filters.minPrice > 0 || filters.maxPrice < 10000000) && (
          <button 
            onClick={clearFilters}
            className="flex items-center px-3 sm:px-4 py-2 rounded-full border border-green-300 text-green-600 hover:bg-green-50 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default SearchFilterBar;