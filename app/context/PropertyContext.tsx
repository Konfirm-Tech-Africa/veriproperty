"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { propertyService } from '@/app/api/propertyService';
import { useUser } from '@/app/context/UserContext';
import { Property, PropertyReportPayload, PropertyListingPayload } from '@/app/components/property/types/property';
import { AxiosError } from 'axios';

// --- Context Types ---
interface UsageData {
  listingsCreated: number;
  limit: number;
  manualPushUpsUsed: number;
  manualPushUpsLimit: number;
  featuredListingsUsed: number;
  featuredListingsLimit: number;
  socialMediaAdsUsed: number;
  socialMediaAdsLimit: number;
}

interface PropertyContextType {
  properties: Property[];
  favorites: Property[];
  landlordProperties: Property[];
  loadingProperties: boolean;
  loadingFavorites: boolean;
  loadingListNew: boolean;
  loadingUpdate: boolean;
  error: string | null;
  usageData: UsageData | null;
  fetchProperties: () => Promise<void>;
  fetchLandlordProperties: (landlordId: string) => Promise<void>;
  addRemoveFavorite: (propertyId: string, isFavorite: boolean) => Promise<boolean>;
  reportProperty: (propertyId: string, reason: string) => Promise<boolean>;
  listNewProperty: (
    payload: PropertyListingPayload, 
    imageFiles: File[], 
    videoFiles: File[]
  ) => Promise<{ success: boolean; property?: Property; usage?: UsageData }>;
  updateProperty: (
    propertyId: string, 
    updates: Partial<PropertyListingPayload>, 
    newImages?: File[], 
    newVideos?: File[]
  ) => Promise<{ success: boolean; updatedProperty?: Property; message?: string }>;
  clearError: () => void;
  deleteProperty: (propertyId: string) => Promise<{ success: boolean; message?: string }>;
  loadingDelete: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

// --- Context Provider ---
export function PropertyProvider({ children }: { children: ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [landlordProperties, setLandlordProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingListNew, setLoadingListNew] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);


  // Clear error when state changes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // --- Fetching Logic ---
  const fetchProperties = useCallback(async () => {
    setLoadingProperties(true);
    setError(null);
    try {
      const response = await propertyService.getAllProperties();
      
      const propertiesData = response.properties || [];
      setProperties(propertiesData);
      
    } catch (err: unknown) {
      console.error('Failed to fetch properties:', err);
      let errorMessage = 'Failed to load properties. Please try again.';
      
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) {
          errorMessage = 'Properties endpoint not found.';
        } else if ((err.response?.status ?? 0) >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  const fetchLandlordProperties = useCallback(async (landlordId: string) => {
    if (!landlordId) {
      console.error('No landlord ID provided');
      setLandlordProperties([]);
      return;
    }

    setLoadingProperties(true);
    setError(null);
    try {
      const response = await propertyService.getLandlordProperties(landlordId);
      
      const landlordPropertiesData = response.properties || [];
      setLandlordProperties(landlordPropertiesData);
      
    } catch (err: unknown) {
      console.error('Failed to fetch landlord properties:', err);
      let errorMessage = 'Failed to load landlord properties.';
      
      if (err instanceof AxiosError) {
        // Handle 401 errors specifically for authenticated endpoints
        if (err.response?.status === 401) {
          errorMessage = 'Please log in to view landlord properties.';
        } else {
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLandlordProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (userLoading || !user) {
      setFavorites([]);
      return;
    }

    setLoadingFavorites(true);
    try {
      const response = await propertyService.getFavorites();
      
      const favoritesData = response.favourites || [];
      setFavorites(favoritesData);
    } catch (err: unknown) {
      console.error('Failed to fetch favorites:', err);
      
      // Clear favorites on auth error
      if (err instanceof AxiosError && err.response?.status === 401) {
      }
      setFavorites([]);
    } finally {
      setLoadingFavorites(false);
    }
  }, [user, userLoading]);

  // Fetch favorites whenever the user changes
  useEffect(() => {
    if (!userLoading) {
      fetchFavorites();
    }
  }, [user, userLoading, fetchFavorites]);

  // --- Action Logic ---
  const addRemoveFavorite = useCallback(async (propertyId: string, isFavorite: boolean): Promise<boolean> => {
    if (!user) {
      setError("You must be logged in to manage favorites.");
      return false;
    }

    try {
      if (isFavorite) {
        await propertyService.removeFavorite(propertyId);
        setFavorites(prev => prev.filter(p => p._id !== propertyId));
      } else {
        await propertyService.addFavorite(propertyId);
        // Refresh favorites to ensure we have the latest data
        await fetchFavorites();
      }
      return true;
    } catch (err: unknown) {
      let errorMessage = 'Failed to update favorites.';
      
      if (err instanceof AxiosError) {
        // Handle 401 errors specifically
        if (err.response?.status === 401) {
          errorMessage = 'Please log in to manage favorites.';
        } else {
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    }
  }, [user, fetchFavorites]);
  
  const reportProperty = useCallback(async (propertyId: string, reason: string): Promise<boolean> => {
    if (!user) {
      setError("You must be logged in to report a property.");
      return false;
    }

    try {
      const payload: PropertyReportPayload = { reason };
      await propertyService.reportProperty(propertyId, payload);
      return true;
    } catch (err: unknown) {
      let errorMessage = 'Failed to report property.';
      
      if (err instanceof AxiosError) {
        // Handle 401 errors specifically
        if (err.response?.status === 401) {
          errorMessage = 'Please log in to report properties.';
        } else {
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    }
  }, [user]);

  // New property listing with usage tracking
  const listNewProperty = useCallback(async (
    payload: PropertyListingPayload, 
    imageFiles: File[], 
    videoFiles: File[]
  ): Promise<{ success: boolean; property?: Property; usage?: UsageData }> => {
    if (!user) {
      setError("You must be logged in to list a new property.");
      return { success: false };
    }

    setLoadingListNew(true);
    setError(null);

    try {
      const response = await propertyService.listNewProperty(payload, imageFiles, videoFiles);
            
      // Update usage data if provided
      if (response.usage) {
        setUsageData(response.usage);
      }
      
      // Refresh properties list
      await fetchProperties();
      
      return {
        success: true,
        property: response.property,
        usage: response.usage
      };
      
    } catch (err: unknown) {
      console.error('Failed to list new property:', err);
      let errorMessage = 'Failed to create property listing. Please try again.';
      
      if (err instanceof AxiosError) {
        // Handle specific error cases from backend
        if (err.response?.status === 401) {
          errorMessage = 'Please log in to list properties.';
        } else if (err.response?.status === 403) {
          // Handle subscription/plan limit errors
          errorMessage = err.response?.data?.message || 'Your plan does not allow this action.';
        } else {
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoadingListNew(false);
    }
  }, [user, fetchProperties]);

  // Update property function
const updateProperty = useCallback(async (
  propertyId: string,
  updates: Partial<PropertyListingPayload>,
  newImages: File[] = [],
  newVideos: File[] = []
): Promise<{ success: boolean; updatedProperty?: Property; message?: string }> => {
  if (!user) {
    setError("You must be logged in to update a property.");
    return { success: false, message: "You must be logged in to update a property." };
  }

  setLoadingUpdate(true);
  setError(null);

  try {

    // Create FormData for the update
    const formData = new FormData();

    // Append all update fields
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      
      if (['location', 'features', 'contact'].includes(key)) {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    // Append new images and videos
    newImages.forEach(file => {
      formData.append('newImages', file, file.name);
    });

    newVideos.forEach(file => {
      formData.append('newVideos', file, file.name);
    });

    // Append media to remove if any - use proper typing
    const updatesWithMedia = updates as PropertyListingPayload & { imagesToRemove?: string[]; videosToRemove?: string[] };
    
    if (updatesWithMedia.imagesToRemove) {
      updatesWithMedia.imagesToRemove.forEach((publicId: string) => {
        formData.append('imagesToRemove', publicId);
      });
    }

    if (updatesWithMedia.videosToRemove) {
      updatesWithMedia.videosToRemove.forEach((publicId: string) => {
        formData.append('videosToRemove', publicId);
      });
    }

    const response = await propertyService.updateProperty(propertyId, formData);
    
    // Update the local state only if we have an updated property
    if (response.updatedProperty) {
      setProperties(prev => prev.map(prop => 
        prop._id === propertyId ? response.updatedProperty! : prop
      ));
      
      setLandlordProperties(prev => prev.map(prop => 
        prop._id === propertyId ? response.updatedProperty! : prop
      ));

      return {
        success: true,
        updatedProperty: response.updatedProperty
      };
    } else {
      return {
        success: false,
        message: "No updated property returned from server"
      };
    }

  } catch (err: unknown) {
    console.error('Failed to update property:', err);
    let errorMessage = 'Failed to update property. Please try again.';
    
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        errorMessage = 'Please log in to update properties.';
      } else if (err.response?.status === 403) {
        errorMessage = err.response?.data?.message || 'You do not have permission to update this property.';
      } else {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    return { success: false, message: errorMessage };
  } finally {
    setLoadingUpdate(false);
  }
}, [user]);
  

// Delete a Property
const deleteProperty = useCallback(async (propertyId: string): Promise<{ success: boolean; message?: string }> => {
  if (!user) {
    setError("You must be logged in to delete a property.");
    return { success: false, message: "You must be logged in to delete a property." };
  }

  setLoadingDelete(true);
  setError(null);

  try {
    
    // You'll need to add this method to your propertyService
    await propertyService.deleteProperty(propertyId);
    
    // Update the local state
    setProperties(prev => prev.filter(p => p._id !== propertyId));
    setLandlordProperties(prev => prev.filter(p => p._id !== propertyId));
    setFavorites(prev => prev.filter(p => p._id !== propertyId));

    return { success: true };

  } catch (err: unknown) {
    console.error('Failed to delete property:', err);
    let errorMessage = 'Failed to delete property. Please try again.';
    
    if (err instanceof AxiosError) {
      if (err.response?.status === 401) {
        errorMessage = 'Please log in to delete properties.';
      } else if (err.response?.status === 403) {
        errorMessage = err.response?.data?.message || 'You do not have permission to delete this property.';
      } else {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    return { success: false, message: errorMessage };
  } finally {
    setLoadingDelete(false);
  }
}, [user]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const value: PropertyContextType = {
    properties,
    favorites,
    landlordProperties,
    loadingProperties,
    loadingFavorites,
    loadingListNew,
    loadingUpdate,
    loadingDelete,
    error,
    usageData,
    fetchProperties,
    fetchLandlordProperties,
    addRemoveFavorite,
    reportProperty,
    listNewProperty,
    updateProperty,
    deleteProperty,
    clearError,
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

// --- Hook for Components ---
export function useProperty() {
  const context = useContext(PropertyContext);
  
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  
  return context;
}