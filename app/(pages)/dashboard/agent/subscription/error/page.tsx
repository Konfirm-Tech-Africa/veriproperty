"use client";
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, Home, ArrowRight, RefreshCw, HelpCircle, Mail, XCircle } from 'lucide-react';

// Separate component that uses useSearchParams
function AgentSubscriptionErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');
  const txRef = searchParams.get('tx_ref');

  // Get error details based on error code
  const getErrorDetails = () => {
    switch (errorCode) {
      case 'insufficient_funds':
        return {
          title: 'Insufficient Funds',
          description: 'Your account balance is insufficient to complete this transaction.',
          suggestion: 'Please fund your account and try again.',
          icon: AlertTriangle
        };
      case 'payment_failed':
        return {
          title: 'Payment Failed',
          description: 'Your payment could not be processed at this time.',
          suggestion: 'Please try again with a different payment method or contact your bank.',
          icon: XCircle
        };
      case 'card_declined':
        return {
          title: 'Card Declined',
          description: 'Your card was declined by the bank.',
          suggestion: 'Please verify your card details or use a different card.',
          icon: XCircle
        };
      case 'network_error':
        return {
          title: 'Network Error',
          description: 'A network error occurred while processing your payment.',
          suggestion: 'Please check your internet connection and try again.',
          icon: AlertTriangle
        };
      case 'timeout':
        return {
          title: 'Transaction Timeout',
          description: 'The transaction timed out before completion.',
          suggestion: 'Please try again and ensure you complete the payment promptly.',
          icon: AlertTriangle
        };
      case 'invalid_details':
        return {
          title: 'Invalid Payment Details',
          description: 'The payment details provided are invalid.',
          suggestion: 'Please verify your payment information and try again.',
          icon: XCircle
        };
      case 'server_error':
        return {
          title: 'Server Error',
          description: 'An error occurred on our server while processing your payment.',
          suggestion: 'Our team has been notified. Please try again in a few minutes.',
          icon: AlertTriangle
        };
      default:
        return {
          title: 'Subscription Error',
          description: errorMessage || 'An error occurred while processing your subscription.',
          suggestion: 'Please try again or contact support if the problem persists.',
          icon: AlertTriangle
        };
    }
  };

  const errorDetails = getErrorDetails();
  const ErrorIcon = errorDetails.icon;

  const handleGoToDashboard = () => {
    router.push('/dashboard/agent');
  };

  const handleTryAgain = () => {
    router.push('/dashboard/agent/subscription');
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@propertyguru.com.ng?subject=Subscription Error&body=' + 
      encodeURIComponent(`Error Code: ${errorCode || 'N/A'}\nTransaction Ref: ${txRef || 'N/A'}\nMessage: ${errorMessage || 'N/A'}\n\nPlease help me resolve this issue.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-red-500">
          <div className="p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
              <ErrorIcon className="h-12 w-12 text-red-600" />
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {errorDetails.title}
            </h1>
            
            {/* Error Description */}
            <p className="text-gray-600 mb-2">
              {errorDetails.description}
            </p>
            
            {/* Suggestion */}
            <p className="text-sm text-gray-500 mb-6">
              {errorDetails.suggestion}
            </p>

            {/* Transaction Reference */}
            {txRef && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg text-left">
                <p className="text-xs text-gray-500 mb-1">Transaction Reference</p>
                <p className="text-sm font-mono text-gray-600 break-all">{txRef}</p>
              </div>
            )}

            {/* Error Code (if available) */}
            {errorCode && (
              <div className="mb-6">
                <p className="text-xs text-gray-400">Error Code: {errorCode}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleTryAgain}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleGoToDashboard}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start space-x-3">
            <HelpCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Still having issues?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Our support team is here to help. Contact us and we&apos;ll resolve your issue promptly.
              </p>
              <button
                onClick={handleContactSupport}
                className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="mt-6">
          <details className="bg-white rounded-lg shadow-md p-4">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
              Common issues and solutions
            </summary>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800">Insufficient Funds</p>
                <p>Ensure your account has enough balance to complete the transaction.</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Card Declined</p>
                <p>Check that your card details are correct and your card is enabled for online transactions.</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Network Issues</p>
                <p>Ensure you have a stable internet connection and try again.</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Payment Timeout</p>
                <p>Complete the payment process within the time limit (usually 5-10 minutes).</p>
              </div>
            </div>
          </details>
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
export default function AgentSubscriptionErrorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AgentSubscriptionErrorContent />
    </Suspense>
  );
}