// app/api/auth.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  AgentVerificationData, 
  AuthResponse, 
  LoginData, 
  NINVerificationData, 
  ProfessionalInfoData, 
  RegisterData, 
  User, 
  VerificationResponse 
} from '../types/auth';
import { cookieService } from '@/app/lib/cookies';

// Constants for better maintainability
const AUTH_ENDPOINTS = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  CURRENT_USER: '/me',
  NIN_VERIFICATION: '/verify/nin',
  AGENT_VERIFICATION: '/agent/verification',
  VERIFICATION_STATUS: '/agent/verification/status',
  PROFESSIONAL_INFO: '/agent/professional-info',
  CHANGE_PASSWORD: '/change-password',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  RESEND_OTP: '/resend-otp',
  CHECK_EMAIL: '/check-email',
  REFRESH_TOKEN: '/refresh-token',
  UPDATE_USER_PROFILE: '/update'
} as const;

// Error response type
interface ErrorResponse {
  message?: string;
  success?: boolean;
  error?: string;
  errors?: string[];
  email?: string;
}

// Extend AxiosRequestConfig to support retry flag
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// Custom error classes
export class EmailNotVerifiedError extends Error {
  public email: string;
  
  constructor(message: string, email: string) {
    super(message);
    this.name = 'EmailNotVerifiedError';
    this.email = email;
  }
}

export class AuthError extends Error {
  public statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

// Create axios instance with proper configuration
const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to add auth token from cookies
api.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = cookieService.get('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
    }
    return response;
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config;
    
    // Only attempt refresh for 401 errors and not already retrying
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const refreshUrl = `${baseUrl}/api/auth${AUTH_ENDPOINTS.REFRESH_TOKEN}`;
        const refreshResponse = await axios.post(
          refreshUrl,
          {},
          { withCredentials: true }
        );
        
        if (refreshResponse.data.accessToken) {
          // Store new token
          cookieService.set('accessToken', refreshResponse.data.accessToken, 7);
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.warn('Token refresh failed, logging out:', refreshError);
        // Refresh failed, proceed with logout
        await handleClientSideLogout();
      }
    }

    // Only log non-401 errors to avoid noise
    if (error.response?.status !== 401) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message
      });
    }

    // Handle other error cases (only if not a refresh attempt)
    if (error.code === 'ECONNABORTED') {
      throw new AuthError('Request timeout. Please try again.');
    }
    
    if (error.response) {
      const errorData = error.response.data;
      const status = error.response.status;
      
      // Handle email not verified case
      if (status === 403 && errorData?.message?.toLowerCase().includes('email not verified')) {
        const email = errorData.email || '';
        throw new EmailNotVerifiedError(errorData.message || 'Email not verified', email);
      }
      
      // Handle validation errors
      if (status === 422 && errorData?.errors) {
        const errorMessage = errorData.errors.join(', ') || 'Validation failed';
        throw new AuthError(errorMessage, status);
      }
      
      // Handle other API errors
      const errorMessage = errorData?.message || errorData?.error || `Request failed with status ${status}`;
      throw new AuthError(errorMessage, status);
    } else if (error.request) {
      throw new AuthError('No response received from server. Please check your connection.');
    } else {
      throw new AuthError(error.message || 'An unknown error occurred.');
    }
  }
);

// Helper function for client-side cleanup
async function handleClientSideLogout() {
  cookieService.remove('accessToken');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    sessionStorage.clear();
    
    // Only redirect if we're not already on auth pages
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath.includes('/auth/login') || 
                      currentPath.includes('/auth/register') || 
                      currentPath.includes('/auth/verify-email');
    
    if (!isAuthPage) {
      window.location.href = '/auth/login';
    }
  }
}

class AuthService {
  private extractData<T>(response: { data: T }): T {
    return response.data;
  }

  // --- Authentication Methods ---

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Clean up the payload to match backend expectations
      const payload = { 
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'buy',
        phone: userData.phone || undefined,
      };
      
      // Remove undefined fields
      Object.keys(payload).forEach(key => {
        if (payload[key as keyof typeof payload] === undefined) {
          delete payload[key as keyof typeof payload];
        }
      });

      const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, payload);
      
      // Store token if present in response
      if (response.data.accessToken) {
        cookieService.set('accessToken', response.data.accessToken, 7); // 7 days
      }
      
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);

      // Store token if present in response
      if (response.data.accessToken) {
        cookieService.set('accessToken', response.data.accessToken, 7);
      }

      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error: unknown) {
      console.warn('Logout request failed:', error);
      // Still proceed with client-side cleanup even if server request fails
    } finally {
      // Always clear client-side tokens
      cookieService.remove('accessToken');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        sessionStorage.clear();
      }
    }
  }

async getCurrentUser(): Promise<User | null> {
  try {
    const token = cookieService.get('accessToken');
    if (!token) {
      return null;
    }

    const response = await api.get(AUTH_ENDPOINTS.CURRENT_USER, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });
    // Make sure the response has the expected structure
    if (response.data && response.data.success !== false) {
      return response.data.profile || response.data;
    } else {
      // If response indicates failure, clear token and return null
      cookieService.remove('accessToken');
      return null;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Don't throw for authentication errors, just return null
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Clear invalid token
        cookieService.remove('accessToken');
        return null;
      }
    }
    console.error('Error fetching current user:', error);
    // Return null instead of throwing to prevent breaking the auth flow
    return null;
  }
}

  async submitNINVerification(ninData: NINVerificationData): Promise<VerificationResponse> {
    try {
      const response = await api.post<VerificationResponse>(AUTH_ENDPOINTS.NIN_VERIFICATION, ninData);
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('NIN verification error:', error);
      throw error;
    }
  }

  async submitAgentVerification(verificationData: AgentVerificationData): Promise<VerificationResponse> {
    try {
      const response = await api.post<VerificationResponse>(AUTH_ENDPOINTS.AGENT_VERIFICATION, verificationData);
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Agent verification error:', error);
      throw error;
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await api.put<User>(AUTH_ENDPOINTS.UPDATE_USER_PROFILE, updates);
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async getAgentVerificationStatus(): Promise<{
    status: 'pending' | 'verified' | 'rejected' | 'unverified';
    ninVerified: boolean;
    details?: unknown;
  }> {
    try {
      const response = await api.get<{
        status: 'pending' | 'verified' | 'rejected' | 'unverified';
        ninVerified: boolean;
        details?: unknown;
      }>(AUTH_ENDPOINTS.VERIFICATION_STATUS);
      
      return this.extractData(response);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { status: 'unverified', ninVerified: false };
      }
      console.error('Verification status error:', error);
      throw error;
    }
  }

  async updateProfessionalInfo(professionalData: ProfessionalInfoData): Promise<User> {
    try {
      const response = await api.put<User>(AUTH_ENDPOINTS.PROFESSIONAL_INFO, professionalData);
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Professional info update error:', error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        AUTH_ENDPOINTS.CHANGE_PASSWORD, 
        { currentPassword, newPassword }
      );
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        AUTH_ENDPOINTS.FORGOT_PASSWORD, 
        { email }
      );
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        AUTH_ENDPOINTS.RESET_PASSWORD, 
        { token, newPassword }
      );
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        AUTH_ENDPOINTS.VERIFY_EMAIL, 
        { email, otp }
      );

      // Store token if verification successful
      if (response.data.accessToken) {
        cookieService.set('accessToken', response.data.accessToken, 7);
      }

      return this.extractData(response);
    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        AUTH_ENDPOINTS.RESEND_OTP, 
        { email }
      );
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    try {
      const response = await api.post<{ available: boolean }>(
        AUTH_ENDPOINTS.CHECK_EMAIL, 
        { email }
      );
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Email availability check error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    try {
      const response = await api.post<{ accessToken: string }>(AUTH_ENDPOINTS.REFRESH_TOKEN);
      
      // Update stored token
      if (response.data.accessToken) {
        cookieService.set('accessToken', response.data.accessToken, 7);
      }
      
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!cookieService.get('accessToken');
  }

  // Utility method to get stored token
  getStoredToken(): string | null {
    return cookieService.get('accessToken');
  }
}

export const authService = new AuthService();

// Helper functions
export const isVerifiedAgent = (user: User | null): boolean => {
  return !!(user && user.role === 'agent' && user.isVerified);
};

export const requiresVerification = (user: User | null): boolean => {
  return !!(user && user.role === 'agent' && !user.isVerified);
};

export const hasPermission = (user: User | null, requiredRole: string): boolean => {
  if (!user) return false;
  return user.role === requiredRole || user.role === 'admin';
};

// Export the API instance for direct use if needed
export { api as authApi };