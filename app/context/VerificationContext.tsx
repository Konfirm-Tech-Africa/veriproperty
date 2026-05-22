// app/context/VerificationContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode} from 'react';
import { verificationService } from '@/app/api/verification';

// Types based on your backend
export interface VerificationDocument {
  url: string;
  public_id: string;
  originalName?: string;
}

export interface Verification {
  _id: string;
  agent: string;
  idType: 'national_id' | 'passport' | 'drivers_license' | 'voters_card';
  fullName: string;
  idNumber: string;
  documents: VerificationDocument[];
  status: 'pending' | 'approved' | 'rejected';
  adminComment?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface VerificationStatus {
  hasSubmission: boolean;
  verification?: Verification;
  message?: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  verification?: {
    id: string;
    idType: string;
    fullName: string;
    status: string;
    submittedAt: string;
    documentCount: number;
  };
}

interface VerificationContextType {
  // State
  verification: Verification | null;
  verificationStatus: VerificationStatus | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  submitVerification: (formData: FormData) => Promise<VerificationResponse>;
  getVerificationStatus: () => Promise<VerificationStatus>;
  getVerificationById: (id: string) => Promise<Verification>;
  clearError: () => void;
  refreshVerificationStatus: () => Promise<void>;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [verification, setVerification] = useState<Verification | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const submitVerification = async (formData: FormData): Promise<VerificationResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      
      const response = await verificationService.submitVerification(formData);
      
      if (response.success) {
        await refreshVerificationStatus();
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit verification';
      console.error('Context: Verification submission error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = async (): Promise<VerificationStatus> => {
    setLoading(true);
    setError(null);
    
    try {
      const status = await verificationService.getVerificationStatus();
      setVerificationStatus(status);
      
      if (status.verification) {
        setVerification(status.verification);
      }
      
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch verification status';
      console.error('Context: Verification status error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVerificationById = async (id: string): Promise<Verification> => {
    setLoading(true);
    setError(null);
    
    try {
      const verification = await verificationService.getVerificationById(id);
      setVerification(verification);
      return verification;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch verification details';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshVerificationStatus = async (): Promise<void> => {
    try {
      await getVerificationStatus();
    } catch (err) {
      console.error('Failed to refresh verification status:', err);
      // Don't throw here - this is a background refresh
    }
  };

  const value: VerificationContextType = {
    verification,
    verificationStatus,
    loading,
    error,
    submitVerification,
    getVerificationStatus,
    getVerificationById,
    clearError,
    refreshVerificationStatus,
  };

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}