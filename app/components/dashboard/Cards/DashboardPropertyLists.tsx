"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DashboardProjectCard from '@/app/components/dashboard/Cards/DashboardPropertyCard';
import PropertyDetails from '@/app/components/dashboard/PropertyDetails';
import PropertyEditModal from '@/app/components/dashboard/PropertyEditModal';
import { Search, Trash2, Edit3, Eye } from 'lucide-react';
import { useProperty } from '@/app/context/PropertyContext';
import { Property } from '../../property/types/property';
import { Project } from '@/app/components/common/fallbackProjects';

interface DashboardPropertyListsProps {
  landlordId?: string;
  className?: string;
  listingType?: "sale" | "rent" | "shortlet";
}

export default function DashboardPropertyLists({ 
  landlordId, 
  listingType 
}: DashboardPropertyListsProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  
  const { 
    properties: allProperties, 
    landlordProperties, 
    loadingProperties, 
    fetchProperties, 
    fetchLandlordProperties,
    deleteProperty,
    loadingUpdate,
    loadingDelete
  } = useProperty();

  // Memoize context properties with listingType filter
  const contextProperties = useMemo(() => {
    const sourceProperties = landlordId ? landlordProperties : allProperties;
    
    // Filter by listingType if provided
    if (listingType) {
      return sourceProperties.filter(property => 
        property.listingType === listingType
      );
    }
    
    return sourceProperties;
  }, [landlordId, landlordProperties, allProperties, listingType]);

  const isLoadingProperty = loadingProperties;

  // Memoize fetch functions with useCallback to prevent infinite loops
  const handleFetchProperties = useCallback(async () => {
    if (hasFetched) return;
    
    try {
      setIsLoading(true);
      if (landlordId) {
        await fetchLandlordProperties(landlordId);
      } else {
        await fetchProperties();
      }
    } finally {
      setHasFetched(true);
      setIsLoading(false);
    }
  }, [landlordId, fetchProperties, fetchLandlordProperties, hasFetched]);

  // Fetch data only once on mount or when landlordId changes
  useEffect(() => {
    handleFetchProperties();
  }, [handleFetchProperties]);

  // Reset hasFetched when landlordId changes to allow new fetch
  useEffect(() => {
    setHasFetched(false);
  }, [landlordId]);

  // Update local properties state when context properties change
  useEffect(() => {
    if (contextProperties.length > 0 || !isLoadingProperty) {
      setProperties(contextProperties);
      setIsLoading(false);
    }
  }, [contextProperties, isLoadingProperty]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  const handleViewDetails = useCallback((property: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedProperty(property);
  }, []);

  const handleEditProperty = useCallback((propertyId: string) => {
    const propertyToEdit = properties.find(p => p._id === propertyId);
    if (propertyToEdit) {
      setEditingProperty(propertyToEdit);
    }
  }, [properties]);

  // Handle delete property
  const handleDeleteProperty = useCallback((propertyId: string) => {
    const propertyToDelete = properties.find(p => p._id === propertyId);
    if (propertyToDelete) {
      setDeletingProperty(propertyToDelete);
    }
  }, [properties]);

  // Confirm and execute delete
  const confirmDeleteProperty = useCallback(async () => {
    if (!deletingProperty) return;

    try {
      const result = await deleteProperty(deletingProperty._id);
      if (result.success) {
        // Property deleted successfully, remove from local state
        setProperties(prev => prev.filter(p => p._id !== deletingProperty._id));
        setDeletingProperty(null);
      } else {
        console.error('Failed to delete property:', result.message);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  }, [deletingProperty, deleteProperty]);

  // Handle property update
  const handlePropertyUpdate = useCallback((updatedProperty: Property) => {
    // Update the local state with the updated property
    setProperties(prev => prev.map(p => 
      p._id === updatedProperty._id ? updatedProperty : p
    ));
    setEditingProperty(null);
  }, []);

  // Safe function to handle amenities conversion
  const formatAmenities = (amenities: unknown): string[] => {
    if (typeof amenities === 'string') {
      // Split by comma and trim each item
      return amenities.split(',').map(item => item.trim()).filter(item => item.length > 0);
    }
    
    if (Array.isArray(amenities)) {
      return amenities.map(item => String(item));
    }
    
    // Return empty array for other cases
    return [];
  };

  // Safe location string generator
  const getLocationString = (property: Property): string => {
    // Check if location exists and has the required properties
    if (!property.location) {
      return '';
    }
    
    const { address = '', city = '', state = '', country = '' } = property.location;
    return `${address} ${city} ${state} ${country}`.trim();
  };

  // Adapt Property to DashboardPropertyCard expected format
  const adaptPropertyForCard = (property: Property) => {    
    const { _id, price, currency, media, features, condition, location, ...rest } = property;
    
    // Format price with currency
    const formattedPrice = `${currency} ${price?.toLocaleString() || '0'}`;
    
    // Convert media format - use public_id as alt text if available
    const adaptedMedia = media?.images?.map(img => ({
      url: img.url,
      alt: img.public_id || property.title
    })) || [];
    
    // Ensure features are properly formatted
    const adaptedFeatures = {
      ...features,
      amenities: formatAmenities(features?.amenities).join(', ') // Convert back to string for card
    };
    
    const adaptedLocation = {
      address: location?.address || '',
      city: location?.city || '',
      state: location?.state || '',
      country: location?.country || 'Nigeria'
    };
    
    const result = {
      ...rest,
      id: _id, // Convert _id to id for the card component
      price: formattedPrice,
      isNew: condition === 'new',
      media: adaptedMedia,
      features: adaptedFeatures,
      location: adaptedLocation
    };
    
    return result;
  };

  // Adapt Property to Project type for PropertyDetails component
  const adaptPropertyForDetails = (property: Property): Project => {
  const { 
    _id, 
    price, 
    currency, 
    media, 
    features, 
    condition, 
    location, 
    description, 
    title, 
    agentId,
    propertyType,
    listingType,
  } = property;
    
    // Format price with currency for display
    const formattedPrice = `${currency} ${price.toLocaleString()}`;
    
    // Convert media.images to images array
    const images = media.images.map(img => img.url);
    
    // Ensure features are properly formatted with fallbacks
    const adaptedFeatures = {
      bedrooms: features.bedrooms || 0,
      bathrooms: features.bathrooms || 0,
      parkingSpaces: features.parkingSpaces || 0,
      size: features.size,
      yearBuilt: features.yearBuilt,
      furnishing: features.furnishing || '',
      condition: features.condition || condition || 'good',
      amenities: formatAmenities(features.amenities),
      toilets: features.toilets || 0,
      extras: features.extras || ''
    };
    
    // Create location object for Project type with safe access
    const adaptedLocation = {
      address: location?.address || '',
      city: location?.city || '',
      state: location?.state || '',
      country: location?.country || 'Nigeria',
      coordinates: location?.coordinate || { lat: 0, lng: 0 }
    };
    
    return {
    id: _id,
    title,
    description: description || 'No description available',
    price: formattedPrice,
    priceValue: price || 0,
    listingType: listingType || 'sale',
    location: adaptedLocation,
    features: adaptedFeatures,
    images,
    agentId: agentId || 'default-agent-id',
    isNew: condition === 'new',
    propertyType: propertyType,
  };
};

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Safe property access with optional chaining and fallbacks
      const locationString = getLocationString(prop);
      const searchLower = searchTerm.toLowerCase();
      
      const title = prop.title || '';
      const description = prop.description || '';
      const propertyType = prop.propertyType || '';
      
      return (
        title.toLowerCase().includes(searchLower) ||
        locationString.toLowerCase().includes(searchLower) ||
        description.toLowerCase().includes(searchLower) ||
        propertyType.toLowerCase().includes(searchLower)
      );
    });
  }, [properties, searchTerm]);

  // Add validation to check for properties with missing location
  useEffect(() => {
    if (properties.length > 0) {
      const invalidProperties = properties.filter(prop => !prop.location);
      if (invalidProperties.length > 0) {
        console.warn('Found properties with missing location:', invalidProperties.length);
      }
    }
  }, [properties]);

  if (isLoading || isLoadingProperty) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (selectedProperty) {
    return (
      <PropertyDetails
        project={adaptPropertyForDetails(selectedProperty)}
        onBack={() => setSelectedProperty(null)}
      />
    );
  }

  // Dynamic search placeholder based on listingType
  const searchPlaceholder = listingType 
    ? `Search ${listingType === 'sale' ? 'sale' : 'rent'} properties by title, location, or type...`
    : "Search properties by title, location, or type...";

  // Dynamic header text based on listingType
  const headerText = landlordId 
    ? `Showing your ${listingType === 'sale' ? 'sale' : listingType === 'rent' ? 'rent' : 'listed'} properties (${filteredProperties.length})`
    : `Showing all ${listingType === 'sale' ? 'sale' : listingType === 'rent' ? 'rent' : ''} properties (${filteredProperties.length})`;

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Delete Confirmation Modal */}
      {deletingProperty && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the property <span className='text-red-700 font-bold'>{deletingProperty.title}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeletingProperty(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={loadingDelete}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProperty}
                disabled={loadingDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loadingDelete ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <PropertyEditModal
          property={editingProperty}
          isOpen={!!editingProperty}
          onClose={() => setEditingProperty(null)}
          onUpdate={handlePropertyUpdate}
        />
      )}

      <div className="mb-6 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-red-200"
        />
        <div className="text-sm text-gray-500 ml-auto">
          {headerText}
        </div>
      </div>
      
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProperties.length > 0 ? (
        filteredProperties.map((property) => (
          <div
            key={property._id}
            className="cursor-pointer transform transition-transform hover:scale-105 group relative"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProperty(property);
            }}
          >
            <DashboardProjectCard
              project={adaptPropertyForCard(property)}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
            />
            
            {/* Quick Action Overlay */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => handleViewDetails(property, e)}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                title="View Details"
              >
                <Eye size={16} />
              </button>
              {landlordId && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProperty(property._id);
                    }}
                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    title="Edit Property"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProperty(property._id);
                    }}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Delete Property"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-gray-500">
          {landlordId 
            ? "You haven't listed any properties yet."
            : `No ${listingType === 'sale' ? 'sale' : listingType === 'rent' ? 'rent' : ''} properties found matching your search.`}
        </div>
      )}
    </div>

      {/* Loading overlay for update operations */}
      {(loadingUpdate || loadingDelete) && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span className="text-gray-700">
              {loadingUpdate ? "Updating property..." : "Deleting property..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}