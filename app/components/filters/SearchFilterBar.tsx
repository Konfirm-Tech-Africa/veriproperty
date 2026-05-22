"use client";
import { BedDouble, Home, CircleDollarSign, Search} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { fallbackProjects, Project } from '../common/fallbackProjects';

interface PropertySearchFilterBarProps {
  onFilterClick: (e: React.MouseEvent) => void;
  agentId?: string;
  onMenuClick?: () => void; // For mobile menu
}

export default function PropertySearchFilterBar({ 
  onFilterClick, 
  agentId,  
}: PropertySearchFilterBarProps) {
  const [isBuying, setIsBuying] = useState(true);
  const [allProperties, setAllProperties] = useState<Project[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const agentProperties = fallbackProjects.filter(prop => 
        agentId ? prop.agentId === agentId : true
      );
      setAllProperties(agentProperties);
      setFilteredProperties(agentProperties);
    }, 1000);
  }, [agentId]);

  // Real-time search filtering
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProperties(allProperties);
    } else {
      const filtered = allProperties.filter(prop =>
        prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof prop.location === 'object' && prop.location.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (prop.description && prop.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProperties(filtered);
    }
  }, [searchTerm, allProperties]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('Search submitted for:', searchTerm);
    setIsSearchExpanded(false);
  };

  const handleFilterClick = (e: React.MouseEvent) => {
    onFilterClick(e);
  };

  return (
    <div className='w-full lg:max-w-[610px] h-auto z-10 bg-white shadow-lg lg:absolute rounded-2xl lg:-bottom-24 lg:left-1/2 lg:-translate-x-1/2 px-4 lg:px-6'>

      {/* Buy/Rent Toggle */}
      <div className='flex gap-3 py-4 lg:py-6'>
        <button 
          onClick={() => setIsBuying(true)} 
          className={`font-medium text-lg lg:text-xl border-b-2 pb-2 transition-colors duration-200 flex-1 lg:flex-none ${
            isBuying ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Buy
        </button>
        <button 
          onClick={() => setIsBuying(false)} 
          className={`font-medium text-lg lg:text-xl border-b-2 pb-2 transition-colors duration-200 flex-1 lg:flex-none ${
            !isBuying ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Rent
        </button>
      </div>
      
      {/* Search Bar */}
      <div className={`flex gap-3 transition-all duration-300 ${
        isSearchExpanded ? 'flex-col' : 'flex-row'
      }`}>
        <div className='flex gap-2 w-full border border-gray-300 rounded-full p-3 lg:p-4'>
          <Search className='text-gray-400 w-5 h-5' />
          <input 
            type="text" 
            className='border-none outline-0 w-full text-sm lg:text-base' 
            placeholder='Search Properties' 
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => window.innerWidth < 1024 && setIsSearchExpanded(true)}
          />
          {isSearchExpanded && (
            <button 
              onClick={() => setIsSearchExpanded(false)}
              className='lg:hidden text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
          )}
        </div>
        <button 
          onClick={handleSearchSubmit}
          className="font-medium flex items-center justify-center gap-2 px-4 lg:px-6 py-3 lg:py-4 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors min-w-[80px] lg:min-w-auto"
        >
          <Search className='w-4 h-4 lg:w-5 lg:h-5' />
          <span className='hidden sm:inline'>Search</span>
        </button>
      </div>

      {/* Search Results Summary */}
      <div className="mt-3 text-sm text-gray-600 px-1">
        Found {filteredProperties.length} of {allProperties.length} properties
      </div>

      {/* Filter Chips */}
      <div className='flex my-4 lg:my-5 gap-2 lg:gap-3 mb-4 lg:mb-5 justify-start overflow-x-auto scrollbar-hide py-2'>
        <div 
          onClick={handleFilterClick} 
          className='flex-shrink-0 flex gap-2 items-center border border-gray-300 rounded-full pl-3 pr-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors'
        >
          <Home className='w-4 h-4 lg:w-5 lg:h-5 text-gray-400' />
          <span className='text-sm lg:text-base whitespace-nowrap'>Property Type</span>
        </div>

        <div 
          onClick={handleFilterClick} 
          className='flex-shrink-0 flex gap-2 items-center border border-gray-300 rounded-full pl-3 pr-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors'
        >
          <CircleDollarSign className='w-4 h-4 lg:w-5 lg:h-5 text-gray-400' />
          <span className='text-sm lg:text-base whitespace-nowrap'>Price</span>
        </div>
        
        <div 
          onClick={handleFilterClick} 
          className='flex-shrink-0 flex gap-2 items-center border border-gray-300 rounded-full pl-3 pr-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors'
        >
          <BedDouble className='w-4 h-4 lg:w-5 lg:h-5 text-gray-400' />
          <span className='text-sm lg:text-base whitespace-nowrap'>Bedroom</span>
        </div>
      </div>
    </div>
  );
}