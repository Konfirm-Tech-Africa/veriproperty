// app/api/verification.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  Verification, 
  VerificationStatus, 
  VerificationResponse 
} from '../context/VerificationContext';
import { cookieService } from '@/app/lib/cookies';

// Constants
const VERIFICATION_ENDPOINTS = {
  SUBMIT_VERIFICATION: '/verifications/submit',
  VERIFICATION_STATUS: '/verifications/status',
  VERIFICATION_BY_ID: '/verifications',
  PENDING_VERIFICATIONS: '/verifications/pending',
  ALL_VERIFICATIONS: '/verifications/all_verifications',
  REVIEW_VERIFICATION: '/review',
} as const;

// Error response type
interface ErrorResponse {
  message?: string;
  success?: boolean;
}

// Custom error types
class VerificationError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'VerificationError';
  }
}

class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}


const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = cookieService.get('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // For FormData, let browser set the content-type automatically
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(new NetworkError(error.message));
  }
);

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    console.error('Verification API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });

    
    // Handle response errors
    if (error.response) {
      const errorData = error.response.data;
      const status = error.response.status;
      
      // Handle authentication errors specifically
      if (status === 401) {
        cookieService.remove('accessToken');
        return Promise.reject(new VerificationError('Authentication required. Please log in again.', status));
      }
      
      if (status === 403) {
        return Promise.reject(new VerificationError('Access denied. You do not have permission to perform this action.', status));
      }

      if (status === 413) {
        return Promise.reject(new VerificationError('File size too large. Please reduce file sizes and try again.', status));
      }

      if (status === 422) {
        return Promise.reject(new VerificationError(errorData?.message || 'Validation failed. Please check your input.', status));
      }

      // Handle specific verification errors
      if (errorData?.message?.includes('already have a pending verification')) {
        return Promise.reject(new VerificationError('You already have a pending verification request. Please wait for review.', status));
      }

      if (errorData?.message?.includes('already verified')) {
        return Promise.reject(new VerificationError('Your account is already verified.', status));
      }
      
      return Promise.reject(new VerificationError(
        errorData?.message || `Request failed with status ${status}`,
        status
      ));
    } 
    
    // Handle request errors (no response)
    if (error.request) {
      return Promise.reject(new NetworkError('No response received from server. Please check your connection.'));
    }
    
    // Handle other errors
    return Promise.reject(new VerificationError(error.message || 'An unknown error occurred.'));
  }
);

class VerificationService {
  private extractData<T>(response: { data: T }): T {
    return response.data;
  }

  // Submit verification documents
  async submitVerification(formData: FormData): Promise<VerificationResponse> {
    try {
      const response = await api.post<VerificationResponse>(
        VERIFICATION_ENDPOINTS.SUBMIT_VERIFICATION,
        formData
      );
      
      return this.extractData(response);
    } catch (error: unknown) {
      console.error('Verification submission failed:', error);
      throw error;
    }
  }

  // Get current user's verification status
  async getVerificationStatus(): Promise<VerificationStatus> {
    try {
      const response = await api.get<VerificationStatus>(
        VERIFICATION_ENDPOINTS.VERIFICATION_STATUS
      );
      return this.extractData(response);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return { hasSubmission: false, message: 'No verification submission found' };
      }
      throw error;
    }
  }

  async getVerificationById(id: string): Promise<Verification> {
    try {
      const response = await api.get<Verification>(
        `${VERIFICATION_ENDPOINTS.VERIFICATION_BY_ID}/${id}`
      );
      return this.extractData(response);
    } catch (error: unknown) {
      throw error;
    }
  }

  async getPendingVerifications(
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    verifications: Verification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalVerifications: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const response = await api.get<{
        verifications: Verification[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalVerifications: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }>(VERIFICATION_ENDPOINTS.PENDING_VERIFICATIONS, {
        params: { page, limit }
      });
      return this.extractData(response);
    } catch (error: unknown) {
      throw error;
    }
  }

  async getAllVerifications(
    page: number = 1, 
    limit: number = 10, 
    status?: string
  ): Promise<{
    verifications: Verification[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalVerifications: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      const response = await api.get<{
        verifications: Verification[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalVerifications: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }>(VERIFICATION_ENDPOINTS.ALL_VERIFICATIONS, {
        params: { page, limit, status }
      });
      return this.extractData(response);
    } catch (error: unknown) {
      throw error;
    }
  }

  async reviewVerification(
    id: string, 
    status: 'approved' | 'rejected', 
    adminComment: string
  ): Promise<VerificationResponse> {
    try {
      const response = await api.put<VerificationResponse>(
        `/verifications/${id}${VERIFICATION_ENDPOINTS.REVIEW_VERIFICATION}`,
        { status, adminComment }
      );
      return this.extractData(response);
    } catch (error: unknown) {
      throw error;
    }
  }
}

export const verificationService = new VerificationService();

// Type guard functions
export const isVerificationError = (error: unknown): error is VerificationError => {
  return error instanceof VerificationError;
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};



// Utility functions
export const isVerificationPending = (status: VerificationStatus | null): boolean => {
  return !!(status?.hasSubmission && status.verification?.status === 'pending');
};

export const isVerificationApproved = (status: VerificationStatus | null): boolean => {
  return !!(status?.hasSubmission && status.verification?.status === 'approved');
};

export const isVerificationRejected = (status: VerificationStatus | null): boolean => {
  return !!(status?.hasSubmission && status.verification?.status === 'rejected');
};

export const canSubmitVerification = (status: VerificationStatus | null): boolean => {
  return !status?.hasSubmission || status.verification?.status === 'rejected';
};