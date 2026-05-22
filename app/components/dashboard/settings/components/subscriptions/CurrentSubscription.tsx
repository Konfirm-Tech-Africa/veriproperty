import React, { useState } from 'react';
import { Calendar, RefreshCw, AlertTriangle, ArrowUpCircle, CreditCard } from 'lucide-react';
import { useSubscription } from '@/app/context/SubscriptionContext';

interface CurrentSubscriptionProps {
  onUpgrade?: () => void;
  onManageBilling?: () => void;
}

export default function CurrentSubscription({ 
  onUpgrade, 
  onManageBilling 
}: CurrentSubscriptionProps) {
  const {
    currentSubscription,
    cancelSubscription,
    loading,
    error
  } = useSubscription();

  const [isCanceling, setIsCanceling] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      setIsCanceling(true);
      await cancelSubscription();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setIsCanceling(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      if (onUpgrade) {
        onUpgrade();
      } else {
        // Fallback to navigation
        window.location.href = '/subscription/plans';
      }
    } catch (error) {
      console.error('Failed to initiate upgrade:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleManageBilling = () => {
    if (onManageBilling) {
      onManageBilling();
    } else {
      // Navigate to billing management page
      window.location.href = '/subscription/billing';
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!currentSubscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-800">
            Subscription Not Found
          </h3>
        </div>
        <p className="text-yellow-700 mt-2">
          Unable to load your subscription information. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
    );
  }

  // Handle free/inactive subscriptions
  if (currentSubscription.status === 'inactive' || currentSubscription.status === 'free' || !currentSubscription.planId) {
    const freeEndsAt = currentSubscription.currentPeriodEnd;
    const freeEndDate = freeEndsAt ? new Date(freeEndsAt).toLocaleDateString() : 'soon';
    
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
          <h3 className="text-lg font-semibold text-yellow-800">
            {currentSubscription.status === 'free' ? 'No Active Subscription' : 'Free Plan Active'}
          </h3>
        </div>
        <p className="text-yellow-700 mt-2">
          {currentSubscription.status === 'free' 
            ? `You are currently on a free plan. Upgrade to continue access before ${freeEndDate}.`
            : 'You are currently on the free plan. Upgrade to access premium features.'}
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'trialing':
      case 'trial':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAmount = () => {
    // Handle both amount formats (could be in cents or direct)
    const amount = currentSubscription.amount || 0;
    // Check if amount is in cents (typical for payment processors)
    return amount >= 1000 ? (amount / 100).toFixed(2) : amount.toFixed(2);
  };

  const getPlanDisplayName = (planName: string) => {
    const names: { [key: string]: string } = {
      starter: 'Starter Agent',
      basic: 'Basic Agent', 
      pro: 'Pro Agent',
      elite: 'Elite Agent',
      free: 'Free Plan'
    };
    return names[planName] || planName;
  };

  const formatStatusText = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const isActive = currentSubscription.status === 'active';
  const isCancelled = currentSubscription.status === 'canceled';
  const willCancel = currentSubscription.cancelAtPeriodEnd;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {getPlanDisplayName(currentSubscription.planDetails.displayName)}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentSubscription.status)}`}>
              {formatStatusText(currentSubscription.status)}
            </span>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {formatDate(currentSubscription.currentPeriodStart)} - {formatDate(currentSubscription.currentPeriodEnd)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-left lg:text-right">
          <div className="text-2xl font-bold text-gray-900">
            {currentSubscription.currency === 'USD' ? '$' : '₦'}{getAmount()}
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {currentSubscription.interval} billing
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Subscription Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium capitalize">{formatStatusText(currentSubscription.status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Billing Cycle:</span>
              <span className="font-medium capitalize">
                {currentSubscription.interval === 'yearly' ? 'Yearly' : 
                 currentSubscription.interval === 'monthly' ? 'Monthly' : 
                 currentSubscription.interval}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Currency:</span>
              <span className="font-medium">{currentSubscription.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium capitalize">{currentSubscription.gateway || 'Flutterwave'}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Billing Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Next Payment:</span>
              <span className="font-medium">{formatDate(currentSubscription.currentPeriodEnd)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Auto Renew:</span>
              <span className={`font-medium ${willCancel ? 'text-red-600' : 'text-green-600'}`}>
                {willCancel ? 'No' : 'Yes'}
              </span>
            </div>
            {currentSubscription.currentPeriodEnd && (
              <div className="flex justify-between">
                <span className="text-gray-600">Free Plan Ends:</span>
                <span className="font-medium text-red-600">
                  {formatDate(currentSubscription.currentPeriodEnd)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        {/* Cancel Subscription Button */}
        {isActive && !willCancel && (
          <button
            onClick={handleCancel}
            disabled={isCanceling}
            className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center"
          >
            {isCanceling ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Canceling...
              </>
            ) : (
              'Cancel Subscription'
            )}
          </button>
        )}

        {/* Cancellation Notice */}
        {willCancel && (
          <div className="flex items-center text-yellow-700 bg-yellow-50 px-3 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Subscription will end on {formatDate(currentSubscription.currentPeriodEnd)}
            </span>
          </div>
        )}

        {/* Upgrade/Change Plan Button */}
        <button
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isUpgrading ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <ArrowUpCircle className="w-4 h-4 mr-2" />
          )}
          {currentSubscription.status || !isActive ? 'Upgrade Now' : 'Change Plan'}
        </button>

        {/* Manage Billing Button for active subscriptions */}
        {isActive && !willCancel && (
          <button
            onClick={handleManageBilling}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Manage Billing
          </button>
        )}
      </div>
    </div>
  );
}