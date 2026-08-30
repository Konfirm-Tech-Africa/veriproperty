"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertySearchFilterBar from '@/app/components/property/PropertySearchFilterBar'
import ProjectCard from '@/app/components/property/PropertyCard';
import { Project } from '@/app/components/common/fallbackProjects';
import { useRouter } from 'next/navigation';
import Footer from '@/app/components/footer';
import { Navbar } from '@/app/components/navbar';
import { useProperty } from '@/app/context/PropertyContext';
import { ContextProperty } from '@/app/components/property/types/property';

// Define the filter state interface
interface SearchFilters {
  searchTerm: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  isForRent: boolean;
}

// Updated interface to match your actual API response
interface ApiProperty {
  _id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  condition: string;
  listingType?: 'sale' | 'rent' | 'shortlet';
  location?: {
    address?: string;
    city?: string;
    state?: string;
  };
  features?: {
    bedrooms?: number;
    bathrooms?: number;
    toilets?: number;
    parkingSpaces?: number;
    size?: number;
    yearBuilt?: number;
    furnishing?: string;
    amenities?: string[];
    extras?: string;
  };
  media?: {
    images?: Array<{ url: string }>;
  };
}

const convertPropertyToProject = (property: ContextProperty): Project => {
  return {
    id: property._id,
    agentId: property.agentId,
    title: property.title,
    description: property.description,
    price: `₦ ${property.price?.toLocaleString() || '0'}`,
    priceValue: property.price || 0,
    listingType: property.listingType || 'sale',
    createdAt: property.createdAt ? new Date(property.createdAt).toISOString() : undefined,
    isNew: property.condition === 'new',
    propertyType: property.propertyType,
    location: {
      address: property.location?.address || '',
      city: property.location?.city || '',
      state: property.location?.state || '',
      country: 'Nigeria'
    },
    features: {
      bedrooms: property.features?.bedrooms,
      bathrooms: property.features?.bathrooms,
      toilets: property.features?.toilets,
      parkingSpaces: property.features?.parkingSpaces,
      size: property.features?.size,
      yearBuilt: property.features?.yearBuilt,
      furnishing: property.features?.furnishing,
      amenities: property.features?.amenities,
      extras: property.features?.extras,
      condition: property.condition
    },
    media: property.media?.images?.map((img) => ({
      url: img.url,
      alt: property.title
    })) || [],
    images: property.media?.images?.map((img) => img.url) || [],
    condition: property.condition
  };
};

export default function PropertyPage() {
  const { 
    properties: contextProperties, 
    loadingProperties, 
    fetchProperties,
    error 
  } = useProperty();
  
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    propertyType: '',
    minPrice: 0,
    maxPrice: 1000000000, // Increased to accommodate higher property prices
    bedrooms: 0,
    isForRent: false
  });
  const searchParams = useSearchParams();

useEffect(() => {
  const propertyTypeParam = searchParams.get('propertyType');
  const listingTypeParam = searchParams.get('listingType');
  const searchParam = searchParams.get('search');

  if (propertyTypeParam || listingTypeParam || searchParam) {
    setFilters(prev => ({
      ...prev,
      propertyType: propertyTypeParam || prev.propertyType,
      isForRent: listingTypeParam === 'rent',
      searchTerm: searchParam || prev.searchTerm,
    }));
  }
}, [searchParams]);

  const [displayCount, setDisplayCount] = useState(8); // Show 8 properties initially
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  
  const router = useRouter();

  // Fetch all properties on component mount using context
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Convert context properties to Project format
const allProperties = useMemo(() => {
  if (!contextProperties || contextProperties.length === 0) {
    return [];
  }

  try {
    return contextProperties.map((property: unknown) => {
      const contextProperty = property as ContextProperty;
      return convertPropertyToProject(contextProperty);
    });
  } catch (error) {
    console.error('Error converting properties:', error);
    return [];
  }
}, [contextProperties]);

   const filteredProperties = useMemo(() => {
    if (allProperties.length === 0) return [];

    return allProperties.filter(property => {
      const matchesSearch = filters.searchTerm === '' || 
        property.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (property.location && typeof property.location === 'object' && 
         property.location.address.toLowerCase().includes(filters.searchTerm.toLowerCase())) ||
        (property.description && property.description.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      const matchesType = filters.propertyType === '' || 
        property.propertyType === filters.propertyType;

      const matchesBedrooms = filters.bedrooms === 0 || 
        (property.features?.bedrooms ?? 0) >= filters.bedrooms;

      const matchesPrice = property.priceValue >= filters.minPrice && 
        property.priceValue <= filters.maxPrice;

      const matchesListingType = filters.isForRent 
        ? property.listingType === 'rent' 
        : property.listingType !== 'rent';

      return matchesSearch && matchesType && matchesBedrooms && matchesPrice && matchesListingType;
    });
  }, [allProperties, filters]);

  // Properties to display (with show more functionality)
  const sortedProperties = useMemo(() => {
  const sorted = [...filteredProperties];

  if (sortBy === 'price-asc') {
    sorted.sort((a, b) => a.priceValue - b.priceValue);
  } else if (sortBy === 'price-desc') {
    sorted.sort((a, b) => b.priceValue - a.priceValue);
  } else {
    sorted.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // newest first
    });
  }

  return sorted;
}, [filteredProperties, sortBy]);

const displayedProperties = useMemo(() => {
  return sortedProperties.slice(0, displayCount);
}, [sortedProperties, displayCount]);
  // Handle filter changes from PropertySearchFilterBar
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset display count when filters change
    setDisplayCount(8);
  };

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  const hasMoreProperties = displayedProperties.length < filteredProperties.length;

  // Show loading state
  if (loadingProperties) {
    return (
      <>
        <Navbar/>
        <div className="min-h-screen flex bg-gray-50 text-gray-800 p-8">
          <main className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
                <p className="text-gray-600">Loading properties...</p>
              </div>
            </div>
          </main>
        </div>
        <Footer/>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Navbar/>
        <div className="min-h-screen flex bg-gray-50 text-gray-800 p-8">
          <main className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchProperties}
                  className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-600 px-4 py-2 rounded"
                >
                  Try Again
                </button>
              </div>
            </div>
          </main>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Navbar/>
      <div className="min-h-screen flex bg-gray-50 text-gray-800 p-8">
        <main className="container mx-auto px-4 py-8">
          {/* Pass filter state and handler to search bar */}
          <PropertySearchFilterBar 
            onFilterChange={handleFilterChange}
            currentFilters={filters}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4 border-b border-gray-300">
                  <span className="pb-2 cursor-pointer border-b-2 border-red-600 font-semibold text-red-600 transition-colors duration-200">All</span>
                  <span className="pb-2 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors duration-200">New Projects</span>
                  <span className="pb-2 cursor-pointer text-gray-500 hover:text-gray-800 transition-colors duration-200">Eligible Properties</span>
                </div>
                <div className="flex items-center gap-4">
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-asc' | 'price-desc')}
    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
  >
    <option value="newest">Sort by: Newest</option>
    <option value="price-asc">Price: Low to High</option>
    <option value="price-desc">Price: High to Low</option>
  </select>

  <div className="flex items-center space-x-2">
    <span className="text-sm text-gray-500">Map View</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
</div>
              </div>
              
              {/* Display properties */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6`}>
                {displayedProperties.map(property => (
                  <div
                    key={property.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/properties/all-properties/${property.id}`)}
                  >
                    <ProjectCard project={property} />
                  </div>
                ))}
              </div>

              {/* Show More button */}
              {hasMoreProperties && (
                <div className="text-center py-8">
                  <button
                    onClick={handleShowMore}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200"
                  >
                    Show More Properties ({filteredProperties.length - displayedProperties.length} remaining)
                  </button>
                </div>
              )}

              {/* Show message when no results match search */}
              {filteredProperties.length === 0 && allProperties.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No properties match your search criteria.</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your search terms.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({
                        searchTerm: '',
                        propertyType: '',
                        minPrice: 0,
                        maxPrice: 1000000000,
                        bedrooms: 0,
                        isForRent: false
                      });
                      setDisplayCount(8);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* Show empty state when no properties at all */}
              {allProperties.length === 0 && !loadingProperties && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No properties available at the moment.</p>
                  <button
                    onClick={fetchProperties}
                    className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>

            <aside className="md:col-span-1 space-y-8 ml-20">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                <p className="text-gray-500 text-sm">
                  Showing {displayedProperties.length} of {filteredProperties.length} properties
                  {filters.searchTerm && ` for "${filters.searchTerm}"`}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Featured Listings</h3>
                <p className="text-gray-500 text-sm">
                  {allProperties.length > 0 
                    ? `Browse through ${allProperties.length} available properties.`
                    : 'No featured listings available at the moment.'
                  }
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  );
}