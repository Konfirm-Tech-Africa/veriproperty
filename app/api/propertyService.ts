// services/propertyService.ts
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { 
  Property, 
  PropertyListingPayload, 
  PropertyReportPayload,
  Report
} from '../components/property/types/property';
import { User } from '../types/auth';
import { cookieService } from '@/app/lib/cookies';

// Base URL for property endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/properties`;

// Create Axios instance for public endpoints (no auth required)
const publicApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Don't send credentials for public endpoints
  withCredentials: false,
});

// Create Axios instance for authenticated endpoints
const authApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth interceptor only to authenticated API
authApi.interceptors.request.use(
  (config) => {
    const token = cookieService.getAuthToken?.() || cookieService.get?.('accessToken');
    
    // Add Authorization header - this ensures the token is sent
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No token found for Authorization header');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling (for both APIs)
const responseErrorHandler = (error: AxiosError) => {
  console.error('🚨 API Response Error:', {
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    url: error.config?.url
  });

  // Handle 401 Unauthorized errors
  if (error.response?.status === 401) {
    console.error('🔐 Authentication failed - 401 Unauthorized');
    // Clear invalid tokens
    cookieService.clearAuthToken?.();
    cookieService.remove?.('accessToken');
    
    // Redirect to login or trigger auth refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-required'));
    }
  }

  return Promise.reject(error);
};

publicApi.interceptors.response.use(
  (response) => response,
  responseErrorHandler
);

authApi.interceptors.response.use(
  (response) => response,
  responseErrorHandler
);

// Define specific response interfaces for each endpoint
interface PropertiesResponse {
  properties: Property[];
  count: number;
}

interface PropertyResponse {
  property: Property & { userId: User };
}

interface FavoriteResponse {
  favourites: Property[];
  count: number;
}

interface MessageResponse {
  message: string;
}

interface ReportResponse {
  newReport: Report;
}

interface ReportsResponse {
  reports: Report[];
}

interface PropertyUsageResponse {
  property: Property;
  usage: {
    listingsCreated: number;
    limit: number;
    manualPushUpsUsed: number;
    manualPushUpsLimit: number;
    featuredListingsUsed: number;
    featuredListingsLimit: number;
    socialMediaAdsUsed: number;
    socialMediaAdsLimit: number;
  };
}

// Updated interface to match your actual API response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  properties?: Property[];
  count?: number;
  favourites?: Property[];
  property?: Property;
  reports?: Report[];
  updatedProperty?: Property;
  newReport?: Report;
}

class PropertyService {
  /**
   * Safely extract data from API response
   */
  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    if (!response || !response.data) {
      throw new Error('No response received from server');
    }

    const apiResponse: ApiResponse<T> = response.data;
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.message || 'Request failed');
    }

    // Handle different response structures from your API
    if (apiResponse.data !== undefined) {
      return apiResponse.data;
    }

    // For endpoints that return properties directly
    if (apiResponse.properties !== undefined) {
      return { 
        properties: apiResponse.properties, 
        count: apiResponse.count || apiResponse.properties.length 
      } as unknown as T;
    }

    // For favorites endpoint
    if (apiResponse.favourites !== undefined) {
      return { 
        favourites: apiResponse.favourites, 
        count: apiResponse.count || apiResponse.favourites.length 
      } as unknown as T;
    }

    // For single property endpoint
    if (apiResponse.property !== undefined) {
      return { property: apiResponse.property } as unknown as T;
    }

    // For reports endpoint
    if (apiResponse.reports !== undefined) {
      return { reports: apiResponse.reports } as unknown as T;
    }

    // For updated property endpoint
    if (apiResponse.updatedProperty !== undefined) {
      return { updatedProperty: apiResponse.updatedProperty } as unknown as T;
    }

    // For new report endpoint
    if (apiResponse.newReport !== undefined) {
      return { newReport: apiResponse.newReport } as unknown as T;
    }

    // If we have success but no data, return empty object
    return {} as T;
  }


  // Fetches all properties in the database (public view) - NO TOKEN REQUIRED
  async getAllProperties(): Promise<PropertiesResponse> {
    try {
      const response = await publicApi.get<ApiResponse<PropertiesResponse>>(`/`);
      return this.handleResponse<PropertiesResponse>(response);
    } catch (error) {
      console.error('Error fetching all properties:', error);
      throw error;
    }
  }

  // Fetches a single property by ID - NO TOKEN REQUIRED
  async getPropertyById(id: string): Promise<PropertyResponse> {
    try {
      if (!id) {
        throw new Error('Property ID is required');
      }
      const response = await publicApi.get<ApiResponse<PropertyResponse>>(`/listings/detail/${id}`);
      return this.handleResponse<PropertyResponse>(response);
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  }

  // --- Authenticated Property Methods (Token Required) ---

  // Lists a new property - REQUIRES TOKEN
  async listNewProperty(
    payload: PropertyListingPayload, 
    imageFiles: File[], 
    videoFiles: File[]
  ): Promise<PropertyUsageResponse> {
    try {
      
      const formData = new FormData();

      // Append all non-file payload fields with detailed logging
      Object.entries(payload).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return; 
        }
        
        // Serialize complex objects (location, features, contact) to JSON strings
        if (['location', 'features', 'contact'].includes(key)) {
          const stringValue = JSON.stringify(value);
          formData.append(key, stringValue);
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof File)) {
          const stringValue = JSON.stringify(value);
          formData.append(key, stringValue);
        } else {
          formData.append(key, String(value));
        }
      });

      // Manually append lat/lon if they are part of the payload structure
      if (payload.location?.coordinate) {
        formData.append('lat', String(payload.location.coordinate.lat));
        formData.append('lon', String(payload.location.coordinate.lon));
      }
      
      // Append multiple image files
      imageFiles.forEach(file => {
        formData.append('images', file, file.name);
      });

      // Append multiple video files
      videoFiles.forEach(file => {
        formData.append('videos', file, file.name);
      });   

      const response = await authApi.post<ApiResponse<PropertyUsageResponse>>(`/listings`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return this.handleResponse<PropertyUsageResponse>(response);
      
    } catch (error) {
      console.error('❌ Error listing new property:', error);
      
      if (error instanceof AxiosError) {
        console.error('🔍 AxiosError details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        // Log the specific error message from backend
        if (error.response?.data) {
          console.error('📋 Backend error response:', error.response.data);
        }
      }
      
      throw error;
    }
  }

  // Fetches all properties listed by a specific agent/landlord - REQUIRES TOKEN
  async getLandlordProperties(landlordId: string): Promise<PropertiesResponse> {
    try {
      if (!landlordId) {
        throw new Error('Landlord ID is required');
      }
      const response = await authApi.get<ApiResponse<PropertiesResponse>>(`/listings/${landlordId}/properties`);
      return this.handleResponse<PropertiesResponse>(response);
    } catch (error) {
      console.error(`Error fetching landlord properties for ${landlordId}:`, error);
      throw error;
    }
  }
  
  // Updates an existing property - REQUIRES TOKEN
  async updateProperty(
    id: string, 
    formData: FormData
  ): Promise<{ updatedProperty: Property }> {
    try {
      if (!id) {
        throw new Error('Property ID is required');
      }
            
      const response = await authApi.put<ApiResponse<{ updatedProperty: Property }>>(
        `/listings/update/${id}`, 
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
        }
      );
            
      // Ensure we always return an updatedProperty
      const result = this.handleResponse<{ updatedProperty: Property }>(response);
      if (!result.updatedProperty) {
        throw new Error('No updated property returned from server');
      }
      
      return result;
      
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      
      if (error instanceof AxiosError) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }
      
      throw error;
    }
  }

  // Deletes a property - REQUIRES TOKEN
  async deleteProperty(id: string): Promise<{ message: string }> {
    try {
      if (!id) {
        throw new Error('Property ID is required');
      }
            
      const response = await authApi.delete<ApiResponse<{ message: string }>>(`/listings/delete/${id}`);
      
      return this.handleResponse<{ message: string }>(response);
      
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      
      if (error instanceof AxiosError) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }
      
      throw error;
    }
  }

  // --- Favourites Methods (REQUIRE TOKEN) ---

  async addFavorite(propertyId: string): Promise<MessageResponse> {
    try {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      const response = await authApi.post<ApiResponse<MessageResponse>>(`/listings/${propertyId}/favorite`);
      return this.handleResponse<MessageResponse>(response);
    } catch (error) {
      console.error(`Error adding favorite ${propertyId}:`, error);
      throw error;
    }
  }

  async removeFavorite(propertyId: string): Promise<MessageResponse> {
    try {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      const response = await authApi.delete<ApiResponse<MessageResponse>>(`/listings/${propertyId}/favorite`);
      return this.handleResponse<MessageResponse>(response);
    } catch (error) {
      console.error(`Error removing favorite ${propertyId}:`, error);
      throw error;
    }
  }

  async getFavorites(): Promise<FavoriteResponse> {
    try {
      const response = await authApi.get<ApiResponse<FavoriteResponse>>(`/listings/favourite`);
      return this.handleResponse<FavoriteResponse>(response);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  // --- Reporting Methods (REQUIRE TOKEN) ---
  async reportProperty(propertyId: string, payload: PropertyReportPayload): Promise<ReportResponse> {
    try {
      if (!propertyId) {
        throw new Error('Property ID is required');
      }
      const response = await authApi.post<ApiResponse<ReportResponse>>(`/report/${propertyId}`, payload);
      return this.handleResponse<ReportResponse>(response);
    } catch (error) {
      console.error(`Error reporting property ${propertyId}:`, error);
      throw error;
    }
  }

  async getMyReports(userId: string): Promise<ReportsResponse> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      const response = await authApi.get<ApiResponse<ReportsResponse>>(`/reports/${userId}`);
      return this.handleResponse<ReportsResponse>(response);
    } catch (error) {
      console.error(`Error fetching reports for user ${userId}:`, error);
      throw error;
    }
  }
}

export const propertyService = new PropertyService();