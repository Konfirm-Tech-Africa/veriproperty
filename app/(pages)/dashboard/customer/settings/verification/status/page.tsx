// app/(pages)/dashboard/agent/settings/verification/status/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import { useVerification } from '@/app/context/VerificationContext';
import Link from 'next/link';

// Define proper types based on your Verification context
interface VerificationDocument {
  url: string;
  public_id: string;
  originalName?: string;
}

interface VerificationDetails {
  _id: string;
  idType: 'national_id' | 'passport' | 'drivers_license' | 'voters_card';
  fullName: string;
  idNumber: string;
  documents: VerificationDocument[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  adminComment?: string;
  documentCount?: number;
}

interface VerificationStatusProps {
  status: 'pending' | 'approved' | 'rejected' | 'unverified';
  verification?: VerificationDetails;
  message?: string;
}

export default function VerificationStatusPage() {
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<VerificationStatusProps | null>(null);
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const { getVerificationStatus, loading: verificationLoading } = useVerification();
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      // Check authentication and role
      if (!isAuthenticated || !user) {
        router.push('/auth/login');
        return;
      }

      if (user.role !== 'agent') {
        router.push(`/${user.role}`);
        return;
      }

      try {
        const status = await getVerificationStatus();
        setStatusData({
          status: status.verification?.status || 'unverified',
          verification: status.verification,
          message: status.message
        });
      } catch (error) {
        console.error('Error fetching verification status:', error);
        setStatusData({
          status: 'unverified',
          message: 'Failed to load verification status'
        });
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && loading) {
      fetchStatus();
    }
  }, []);

  // Handle redirects separately
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
    
    if (!userLoading && user && user.role !== 'agent') {
      router.push(`/${user.role}`);
    }
  }, [user, isAuthenticated, userLoading, router]);

  if (userLoading || verificationLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification status...</p>
        </div>
      </div>
    );
  }

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

  const renderStatusContent = () => {
    switch (statusData?.status) {
      case 'pending':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Under Review</h2>
            <p className="text-gray-600 mb-6">
              Your verification documents are being reviewed by our team. This process usually takes 24-48 hours.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-yellow-800 mb-3">Submission Details</h3>
              {statusData.verification && (
                <div className="text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Submitted:</span>
                    <span className="text-yellow-900 font-medium">
                      {new Date(statusData.verification.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">ID Type:</span>
                    <span className="text-yellow-900 font-medium capitalize">
                      {statusData.verification.idType?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Documents:</span>
                    <span className="text-yellow-900 font-medium">
                      {statusData.verification.documentCount || statusData.verification.documents?.length} files
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">What to Expect Next</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• You will receive an email notification when your verification is processed</li>
                  <li>• Once approved, you can start listing properties immediately</li>
                  <li>• If additional information is needed, we will contact you</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'approved':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Approved!</h2>
            <p className="text-gray-600 mb-6">
              Congratulations! Your agent verification has been approved. You can now access all agent features.
            </p>

            {statusData.verification && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-green-800 mb-3">Verification Details</h3>
                <div className="text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">Approved On:</span>
                    <span className="text-green-900 font-medium">
                      {statusData.verification.reviewedAt 
                        ? new Date(statusData.verification.reviewedAt).toLocaleDateString()
                        : 'Recently'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">ID Type:</span>
                    <span className="text-green-900 font-medium capitalize">
                      {statusData.verification.idType?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Status:</span>
                    <span className="text-green-900 font-medium">Verified Agent</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">What You Can Do Now</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• List properties for sale or rent</li>
                  <li>• Access advanced agent tools</li>
                  <li>• Feature your listings</li>
                  <li>• Use promotional features</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4 pt-4">
                <Link
                  href="/dashboard/agent/properties/create"
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  List Your First Property
                </Link>
                <Link
                  href="/dashboard/agent"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        );

      case 'rejected':
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Not Approved</h2>
            <p className="text-gray-600 mb-6">
              We were unable to verify your documents. Please review the comments below and submit a new verification request.
            </p>

            {statusData.verification && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-red-800 mb-3">Review Comments</h3>
                <p className="text-red-700 text-left">
                  {statusData.verification.adminComment || 'No specific comments provided. Please ensure your documents are clear and match the information provided.'}
                </p>
                <div className="mt-4 text-left space-y-2 text-sm text-red-600">
                  <div className="flex justify-between">
                    <span>Submitted:</span>
                    <span className="font-medium">
                      {new Date(statusData.verification.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reviewed:</span>
                    <span className="font-medium">
                      {statusData.verification.reviewedAt 
                        ? new Date(statusData.verification.reviewedAt).toLocaleDateString()
                        : 'Recently'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Common Issues</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Documents are blurry or unreadable</li>
                  <li>• Information does not match your profile</li>
                  <li>• Expired identification documents</li>
                  <li>• Missing required documents</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4 pt-4">
                <Link
                  href="/dashboard/agent/settings/verification"
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit New Verification
                </Link>
                <Link
                  href="/dashboard/agent/support"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        );

      default: // unverified
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Required</h2>
            <p className="text-gray-600 mb-6">
              To access agent features and list properties, you need to complete the verification process.
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Why Verify?</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Build trust with potential clients</li>
                  <li>• Access property listing features</li>
                  <li>• Use advanced agent tools</li>
                  <li>• Increase your property visibility</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4 pt-4">
                <Link
                  href="/dashboard/agent/settings/verification"
                  className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Start Verification
                </Link>
                <Link
                  href="/dashboard/agent"
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderStatusContent()}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Need Help?</h3>
          <p className="text-blue-700 text-sm mb-3">
            If you have questions about the verification process or need assistance:
          </p>
          <div className="text-blue-700 text-sm space-y-1">
            <p>• Email: support@propertyguru.com</p>
            <p>• Phone: +1 (555) 123-4567</p>
            <p>• Response time: Within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}