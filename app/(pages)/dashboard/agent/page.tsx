'use client';
import React, { useState, useEffect } from 'react';
import MetricCard from '@/app/components/dashboard/Cards/MetricCard';
import { ChevronRight, DollarSign, Home, Building, Crown, Zap } from 'lucide-react';
import { useProperty } from '@/app/context/PropertyContext';
import { useUser } from '@/app/context/UserContext';
import { useSubscription } from '@/app/context/SubscriptionContext';

interface PaymentHistory {
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

export default function AgentDashboardPage() {
  const { properties, landlordProperties, loadingProperties } = useProperty();
  const { user } = useUser();
  const { 
    currentSubscription, 
    usageData, 
    loading: subscriptionLoading,
    initialize,
    plans 
  } = useSubscription();
  

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionInitialized, setSubscriptionInitialized] = useState(false);

  // Calculate real metrics from properties data
  useEffect(() => {
    if (!loadingProperties) {
      // Use landlordProperties if available, otherwise use all properties
      const agentProperties = landlordProperties.length > 0 ? landlordProperties : properties;
            
      // Generate mock payment history based on properties
      const mockPayments: PaymentHistory[] = agentProperties.slice(0, 3).map((property, index) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const monthIndex = (currentMonth - index - 1 + 12) % 12;
        
        const price = typeof property.price === 'string' 
          ? parseFloat(property.price) 
          : Number(property.price) || 0;
        
        const units = property.features?.bedrooms || 1;
        const commission = price * units * 0.1;
        
        return {
          date: `${months[monthIndex]} ${new Date().getFullYear()}`,
          amount: `$${commission.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`,
          status: 'Paid' as const
        };
      });

      setPaymentHistory(mockPayments);
      setLoading(false);
    }
  }, [properties, landlordProperties, loadingProperties]);

  // Initialize subscription data once on mount
  useEffect(() => {
    if (!subscriptionInitialized) {
      const initSubscriptionData = async () => {
        try {
          await initialize();
          setSubscriptionInitialized(true);
        } catch (error) {
          console.error('Failed to initialize subscription data:', error);
          setSubscriptionInitialized(true);
        }
      };

      initSubscriptionData();
    }
  }, [initialize, subscriptionInitialized]);

  // Get current plan limits from the plans array
  const getCurrentPlanLimits = () => {
    if (!currentSubscription?.planDetails?.displayName || !plans.length) return null;
    
    return currentSubscription?.planDetails?.limits?.listings || null;
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit <= 0) return 0; // Unlimited
    if (limit === 0) return 0; // Avoid division by zero
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  // Get display name for plan
  const getPlanDisplayName = () => {
    if (!currentSubscription?.planDetails?.displayName || !plans.length) return 'Free Tier';
    
    return currentSubscription.planDetails?.displayName;
  };

  const currentPlanLimits = getCurrentPlanLimits();

  if (loading || subscriptionLoading) {
    return (
      <div className="flex-1 p-6 space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-xl- sm:text-4xl font-bold text-gray-800">DASHBOARD</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, <span className='text-lg text-red-600 font-bold'>{user?.name || 'Agent'}</span>! Here is your property overview.
        </p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <MetricCard 
          title="Total Properties" 
          value={`${usageData?.listingsCreated || 0}`}
          icon={<Home className="w-6 h-6" />}
          trend="up"
        />
        <MetricCard 
          title="Current Plan" 
          value={getPlanDisplayName()} 
          icon={<Crown className="w-6 h-6" />}
        />
        <MetricCard 
          title="Listings Used" 
          value={`${usageData?.listingsCreated || 0}/${currentPlanLimits || 0}`}
          icon={<Zap className="w-6 h-6" />}
        />
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6 mt-6 sm:mt-8">
        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Recent Payments</h3>
            <a href="/dashboard/payments" className="text-red-600 text-xs sm:text-sm font-semibold hover:underline flex items-center">
              See All Payments
              <ChevronRight size={16} className="ml-1" />
            </a>
          </div>
          <div className="overflow-x-auto">
            {paymentHistory.length > 0 ? (
              <table className="w-full text-xs sm:text-sm text-left text-gray-500 min-w-[300px]">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 sm:px-4 py-2 sm:py-3">Date</th>
                    <th scope="col" className="px-3 sm:px-4 py-2 sm:py-3">Amount</th>
                    <th scope="col" className="px-3 sm:px-4 py-2 sm:py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{payment.date}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap font-medium text-gray-900">
                        {payment.amount}
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3">
                        <span className={`font-semibold whitespace-nowrap ${
                          payment.status === 'Paid' ? 'text-green-500' : 
                          payment.status === 'Pending' ? 'text-yellow-500' : 
                          'text-red-500'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No payment history available</p>
                <p className="text-sm">Payments will appear here once you start earning commissions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Subscription Overview</h3>
          <a href="/dashboard/subscription" className="text-red-600 text-sm font-semibold hover:underline flex items-center">
            Manage Subscription
            <ChevronRight size={16} className="ml-1" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Current Plan */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">Current Plan</h4>
              <Crown className="w-5 h-5 text-purple-600" />
            </div>
            <div className="mb-2">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full`}>
                {getPlanDisplayName()}
              </span>
            </div>
            {currentSubscription?.status !== 'free' && (
              <p className="text-sm text-gray-600 mb-3">
              {currentSubscription?.status === 'active' ? 'Active' : 'Free Plan'}
            </p>
            )}
            {currentSubscription?.currentPeriodEnd && (
              <p className="text-xs text-gray-500">
                Renews: {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Listings Usage */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">Listings</h4>
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-800">
                {usageData?.listingsCreated || 0}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  / {currentPlanLimits || 0}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${getUsagePercentage(usageData?.listingsCreated || 0, currentPlanLimits || 1)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        {(!currentSubscription || currentSubscription.planDetails.displayName === 'starter') && (
          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Upgrade for More Features</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Get more listings, featured listings, and client requests
                </p>
              </div>
              <a 
                href="/dashboard/subscription"
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}