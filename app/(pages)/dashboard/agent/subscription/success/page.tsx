"use client";
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';

// Separate component that uses useSearchParams
function AgentSubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const status = searchParams.get('status');
  const txRef = searchParams.get('tx_ref');
  
  const isSuccess = status === 'success';
  const isCancelled = status === 'cancelled';

  const handleGoToDashboard = () => {
    router.push('/dashboard/agent');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Status Card */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
          isSuccess ? 'border-t-8 border-green-500' : 'border-t-8 border-red-500'
        }`}>
          <div className="p-8 text-center">
            {isSuccess ? (
              <>
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Subscription Successful! 🎉
                </h1>
                <p className="text-gray-600 mb-4">
                  Your subscription has been activated successfully.
                </p>
              </>
            ) : isCancelled ? (
              <>
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                  <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Subscription Cancelled
                </h1>
                <p className="text-gray-600 mb-4">
                  Your subscription was cancelled. No charges were made.
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-6">
                  <svg className="h-12 w-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Payment Pending
                </h1>
                <p className="text-gray-600 mb-4">
                  Your payment is being processed. You&apos;ll receive a confirmation shortly.
                </p>
              </>
            )}

            {/* Transaction Reference */}
            {txRef && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Transaction Reference</p>
                <p className="text-sm font-mono text-gray-600 break-all">{txRef}</p>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleGoToDashboard}
              className="mt-6 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Back to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@propertyguru.com.ng" className="text-red-600 hover:underline">
              support@propertyguru.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AgentSubscriptionSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AgentSubscriptionSuccessContent />
    </Suspense>
  );
}