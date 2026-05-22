// app/(pages)/dashboard/agent/settings/verification/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import { useVerification } from '@/app/context/VerificationContext';
import DocumentUploadForm from '@/app/(pages)/dashboard/agent/settings/verification/DocumentUploadForm';

// Define proper types based on your backend
export interface VerificationData {
  idType: 'national_id' | 'passport' | 'drivers_license' | 'voters_card';
  fullName: string;
  idNumber: string;
  documents: File[];
}

type VerificationStep = 'documents' | 'complete';

export default function DashboardAgentVerificationPage() {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('documents');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessChecked, setAccessChecked] = useState(false);
  
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const { submitVerification, getVerificationStatus, loading: verificationLoading } = useVerification();
  const router = useRouter();

  // Check authentication and verification status
  useEffect(() => {
    const checkAccess = async () => {
      // Wait for user context to load
      if (userLoading) return;

      // Check authentication
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, redirecting to login');
        router.push('/auth/login');
        return;
      }
      
      // Check if user is an agent
      if (user.role !== 'agent') {
        router.push(`'/dashboard/'${user.role}`);
        return;
      }

      // Check if user is already verified
      if (user.kycVerified) {
        console.log('User KYC already verified, redirecting to agent dashboard');
        router.push('/dashboard/agent');
        return;
      }

      // Check if there's a pending verification
      try {
        const status = await getVerificationStatus();
        
        if (status.hasSubmission && status.verification?.status === 'pending') {
          router.push('/dashboard/agent/settings/verification/status');
          return;
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setAccessChecked(true);
      }
    };

    if (!accessChecked && !userLoading) {
      checkAccess();
    }
  }, [user, router, getVerificationStatus, isAuthenticated, userLoading, accessChecked]);

  // Handle document upload and submission
  const handleDocumentsComplete = async (data: VerificationData) => {
    // Double-check authentication
    if (!isAuthenticated) {
      setError('Your session has expired. Please log in again.');
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting verification submission...');
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append text fields
      formData.append('idType', data.idType);
      formData.append('fullName', data.fullName);
      formData.append('idNumber', data.idNumber);

      // Append files - use 'documents' field name to match multer configuration
      data.documents.forEach((file, index) => {
        formData.append('documents', file); // This should match upload.array('documents')
        console.log(`Appended document ${index + 1}:`, file.name, file.type, file.size);
      });

      // Submit verification to backend
      console.log('Submitting verification form data...');
      const result = await submitVerification(formData);

      if (result.success) {
        console.log('Verification submitted successfully');
        setCurrentStep('complete');

        // Redirect to status page after 2 seconds
        setTimeout(() => {
          router.push('/dashboard/agent/settings/verification/status');
        }, 2000);
      } else {
        throw new Error(result.message || 'Verification submission failed');
      }
    } catch (error) {
      console.error('Verification submission error:', error);
      
      let errorMessage = 'Failed to submit verification. Please try again.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Handle specific error cases
        if (error.message.includes('already have a pending verification')) {
          errorMessage = 'You already have a pending verification request. Please wait for review.';
          setTimeout(() => {
            router.push('/dashboard/agent/settings/verification/status');
          }, 2000);
        } else if (error.message.includes('already verified')) {
          errorMessage = 'Your account is already verified.';
          setTimeout(() => {
            router.push('/dashboard/agent');
          }, 2000);
        } else if (error.message.includes('authentication') || error.message.includes('login')) {
          errorMessage = 'Your session has expired. Please log in again.';
          router.push('/auth/login');
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('file') || error.message.includes('document')) {
          errorMessage = 'Document upload failed. Please check file requirements.';
        } else if (error.message.includes('required')) {
          errorMessage = 'Please fill in all required fields.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (userLoading || verificationLoading || !accessChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification...</p>
        </div>
      </div>
    );
  }

  // Show loading while user context is being established
  if (!user || user.role !== 'agent') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            {error.includes('pending verification') && (
              <p className="mt-2 text-sm text-red-600">
                Redirecting to status page...
              </p>
            )}
            {error.includes('already verified') && (
              <p className="mt-2 text-sm text-red-600">
                Redirecting to dashboard...
              </p>
            )}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentStep === 'documents' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Identity Verification</h2>
              <p className="text-gray-600 mb-6">
                Upload your identification documents for verification. This helps ensure the security and trust of our platform.
              </p>
              
              <DocumentUploadForm
                onComplete={handleDocumentsComplete}
              />
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Submitted!</h2>
              <p className="text-gray-600 mb-4">
                Your agent verification has been submitted for review. You will be notified once it is processed.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Our team will review your documents within 24-48 hours</li>
                  <li>• You will receive an email notification once reviewed</li>
                  <li>• Once approved, you can start listing properties</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Redirecting to status page...
              </p>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Need Help?</h3>
          <p className="text-blue-700 text-sm">
            If you are having trouble with the verification process, please ensure:
          </p>
          <ul className="text-blue-700 text-sm mt-2 space-y-1">
            <li>• Documents are clear and all text is readable</li>
            <li>• Files are in JPG, PNG, or WEBP format</li>
            <li>• Each file is less than 5MB in size</li>
            <li>• Your name matches exactly with your ID document</li>
          </ul>
        </div>
      </div>
    </div>
  );
}