import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { Property } from '@/app/components/property/types/property';
import { AdminsResponse, AdminUser, AnalyticsData, ApiResponse, CreateAdminData, MessageResponse, PaginatedResponse, ReviewVerificationData, UpdateAdminData, User, UsersResponse, Verification, VerificationsResponse } from '../components/property/types/verification';

// Base URL for admin endpoints
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/admin`;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('Admin API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

class AdminService {
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
    if (apiResponse.property !== undefined) {
      const prop = apiResponse.property;
      const propertiesArray = Array.isArray(prop) ? prop : [prop];
      return {
        properties: propertiesArray,
        count: apiResponse.count ?? propertiesArray.length
      } as unknown as T;
    }

    // For users endpoint
    if (apiResponse.users !== undefined) {
      return {
        users: apiResponse.users,
        pagination: apiResponse.pagination
      } as unknown as T;
    }

    // For admins endpoint
    if (apiResponse.admins !== undefined) {
      return {
        admins: apiResponse.admins,
        pagination: apiResponse.pagination
      } as unknown as T;
    }

    // For verifications endpoint
    if (apiResponse.verifications !== undefined) {
      return {
        verifications: apiResponse.verifications,
        pagination: apiResponse.pagination
      } as unknown as T;
    }

    // For listings endpoint
    if (apiResponse.listings !== undefined) {
      return { 
        properties: apiResponse.listings, 
        count: apiResponse.count || apiResponse.listings.length 
      } as unknown as T;
    }

    // For single property endpoint
    if (apiResponse.property !== undefined) {
      return { property: apiResponse.property } as unknown as T;
    }

    // For single admin endpoint
    if (apiResponse.admin !== undefined) {
      return { admin: apiResponse.admin } as unknown as T;
    }

    // For analytics endpoint
    if (apiResponse.analytics !== undefined) {
      return apiResponse.analytics as unknown as T;
    }

    // For paginated responses
    if (apiResponse.pagination !== undefined) {
      return {
        properties: apiResponse.properties || apiResponse.listings || [],
        pagination: apiResponse.pagination
      } as unknown as T;
    }

    throw new Error('Unexpected API response format');
  }

  // ==================== ANALYTICS & DASHBOARD ====================

  /**
   * Get dashboard analytics and statistics
   */
  async getDashboardAnalytics(): Promise<AnalyticsData> {
    const response = await api.get<ApiResponse<AnalyticsData>>('/analytics');
    console.log("Analytics", response)
    return this.handleResponse<AnalyticsData>(response);
  }

  /**
   * Get system reports
   */
  async getReports(): Promise<unknown> {
    const response = await api.get<ApiResponse>('/reports');
    return this.handleResponse(response);
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Get all users with pagination
   */
  async getAllUsers(page: number = 1, limit: number = 10): Promise<UsersResponse> {
    const response = await api.get<ApiResponse<UsersResponse>>('/users', {
      params: { page, limit }
    });
    return this.handleResponse<UsersResponse>(response);
  }

  /**
   * Suspend a user
   */
  async suspendUser(userId: string): Promise<{ user: User }> {
    const response = await api.put<ApiResponse<{ user: User }>>(`/users/${userId}/suspend`);
    return this.handleResponse<{ user: User }>(response);
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<MessageResponse> {
    const response = await api.delete<ApiResponse<MessageResponse>>(`/users/${userId}`);
    return this.handleResponse<MessageResponse>(response);
  }

  // ==================== ADMIN MANAGEMENT ====================

  /**
   * Get all admins with pagination
   */
  async getAllAdmins(page: number = 1, limit: number = 10): Promise<AdminsResponse> {
    const response = await api.get<ApiResponse<AdminsResponse>>('/admins', {
      params: { page, limit }
    });
    return this.handleResponse<AdminsResponse>(response);
  }

  /**
   * Create a new admin
   */
  async createAdmin(adminData: CreateAdminData): Promise<{ admin: AdminUser }> {
    const response = await api.post<ApiResponse<{ admin: AdminUser }>>('/register', adminData);
    return this.handleResponse<{ admin: AdminUser }>(response);
  }

  /**
   * Update admin details
   */
  async updateAdmin(adminId: string, updates: UpdateAdminData): Promise<{ admin: AdminUser }> {
    const response = await api.put<ApiResponse<{ admin: AdminUser }>>(`/admins/${adminId}`, updates);
    return this.handleResponse<{ admin: AdminUser }>(response);
  }

  /**
   * Delete an admin
   */
  async deleteAdmin(adminId: string): Promise<MessageResponse> {
    const response = await api.delete<ApiResponse<MessageResponse>>(`/admins/${adminId}`);
    return this.handleResponse<MessageResponse>(response);
  }

  /**
   * Suspend an admin account
   */
  async suspendAdmin(adminId: string): Promise<{ admin: AdminUser }> {
    const response = await api.put<ApiResponse<{ admin: AdminUser }>>(`/admins/${adminId}/suspend`);
    return this.handleResponse<{ admin: AdminUser }>(response);
  }

  /**
   * Activate an admin account
   */
  async activateAdmin(adminId: string): Promise<{ admin: AdminUser }> {
    const response = await api.put<ApiResponse<{ admin: AdminUser }>>(`/admins/${adminId}/activate`);
    return this.handleResponse<{ admin: AdminUser }>(response);
  }

  // ==================== PROPERTY MANAGEMENT ====================

  /**
   * Get all properties (admin view)
   */
  async getAllProperties(page: number = 1, limit: number = 10): Promise<PaginatedResponse> {
    const response = await api.get<ApiResponse<PaginatedResponse>>('/listings', {
      params: { page, limit }
    });
    return this.handleResponse<PaginatedResponse>(response);
  }

  /**
   * Get pending listings
   */
  async getPendingListings(page: number = 1, limit: number = 10): Promise<PaginatedResponse> {
    const response = await api.get<ApiResponse<PaginatedResponse>>('/listings/pending', {
      params: { page, limit }
    });
    return this.handleResponse<PaginatedResponse>(response);
  }

  /**
   * Approve a listing
   */
  async approveListing(propertyId: string): Promise<{ property: Property }> {
    const response = await api.put<ApiResponse<{ property: Property }>>(`/listings/${propertyId}/approve`);
    return this.handleResponse<{ property: Property }>(response);
  }

  /**
   * Reject a listing
   */
  async rejectListing(propertyId: string): Promise<{ property: Property }> {
    const response = await api.put<ApiResponse<{ property: Property }>>(`/listings/${propertyId}/reject`);
    return this.handleResponse<{ property: Property }>(response);
  }

  /**
   * Delete a property
   */
  async deleteProperty(propertyId: string): Promise<MessageResponse> {
    const response = await api.delete<ApiResponse<MessageResponse>>(`/listings/${propertyId}`);
    return this.handleResponse<MessageResponse>(response);
  }

  /**
   * Update property (for featured status, etc.)
   */
  async updateProperty(propertyId: string, updates: Partial<Property>): Promise<{ property: Property }> {
    const response = await api.put<ApiResponse<{ property: Property }>>(`/listings/${propertyId}`, updates);
    return this.handleResponse<{ property: Property }>(response);
  }

  /**
   * Get property by ID
   */
  async getPropertyById(propertyId: string): Promise<{ property: Property }> {
    const response = await api.get<ApiResponse<{ property: Property }>>(`/listings/detail/${propertyId}`);
    return this.handleResponse<{ property: Property }>(response);
  }

  // ==================== VERIFICATION MANAGEMENT ====================

  /**
   * Get all verifications with pagination
   */
  async getAllVerifications(page: number = 1, limit: number = 10): Promise<VerificationsResponse> {
    const response = await api.get<ApiResponse<VerificationsResponse>>('/verification', {
      params: { page, limit }
    });
    return this.handleResponse<VerificationsResponse>(response);
  }

  /**
   * Review a verification
   */
  async reviewVerification(verificationId: string, reviewData: ReviewVerificationData): Promise<{ verification: Verification }> {
    const response = await api.post<ApiResponse<{ verification: Verification }>>(
      `/verification/${verificationId}/review`,
      reviewData
    );
    return this.handleResponse<{ verification: Verification }>(response);
  }
}

export const adminService = new AdminService();