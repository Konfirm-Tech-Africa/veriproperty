import React, { useState, useEffect } from 'react';
import SubscriptionCard from './SubscriptionCard';
import { SubscriptionPlan, UserSubscription } from '@/app/components/property/types/subscription';
import { useSubscription } from '@/app/context/SubscriptionContext';

// Currency and billing cycle options
const currencies = [
  { code: 'USD' as const, symbol: '$', name: 'US Dollar' },
  { code: 'NGN' as const, symbol: '₦', name: 'Nigerian Naira' },
];

const billingCycles: Array<{ type: 'monthly' | 'yearly'; label: string; discount?: string }> = [
  { type: 'monthly', label: 'Monthly' },
  { type: 'yearly', label: 'Yearly', discount: '15% Off' },
];

interface SubscriptionPlansProps {
  onPlanSelected?: (plan: UserSubscription) => void;
}

export default function SubscriptionPlans({ onPlanSelected }: SubscriptionPlansProps) {
  const { 
    plans,
    subscribeToPlan, 
    loading: contextLoading,
    currency: contextCurrency,
    setCurrency: setContextCurrency,
    billingCycle: contextBillingCycle,
    setBillingCycle: setContextBillingCycle,
    fetchPlans
  } = useSubscription();
  
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<(typeof currencies)[0]>(contextCurrency || currencies[0]);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<(typeof billingCycles)[0]>(contextBillingCycle || billingCycles[0]);
  const [currentCurrencyPlans, setCurrentCurrencyPlans] = useState<SubscriptionPlan[]>([]);
  const [hasUserSelectedCurrency, setHasUserSelectedCurrency] = useState(false);

  // Update currentCurrencyPlans when plans change and filter by currency
  useEffect(() => {
    const filteredPlans = plans.filter(plan => plan.currency === selectedCurrency.code);
    setCurrentCurrencyPlans(filteredPlans);
  }, [plans, selectedCurrency.code]);

  // Sort plans by tier to ensure consistent display order
  const sortedPlans: SubscriptionPlan[] = [...currentCurrencyPlans].sort((a, b) => (a.tier || 0) - (b.tier || 0));

  const handleCurrencyChange = async (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency);
    setContextCurrency(currency);
    setHasUserSelectedCurrency(true);
    
    // Manually fetch plans for the new currency when user clicks
    await fetchPlans(currency.code);
  };

  const handleBillingCycleChange = (cycle: typeof billingCycles[0]) => {
    setSelectedBillingCycle(cycle);
    setContextBillingCycle(cycle);
  };

  // Helper function to get the correct price based on billing cycle
  const getPlanPrice = (plan: SubscriptionPlan, billingCycle: 'monthly' | 'yearly'): number => {
    if (plan.isFree) {
      return 0;
    }
    return plan.pricing[billingCycle];
  };

  // Helper function to get formatted price for display
  const getFormattedPrice = (plan: SubscriptionPlan, billingCycle: 'monthly' | 'yearly'): string => {
    if (plan.isFree) {
      return 'Free';
    }
    return plan.pricing.formatted[billingCycle];
  };

  const handlePlanAction = async (plan: SubscriptionPlan) => {
    try {
      setProcessingPlan(plan._id);
      
      if (onPlanSelected) {
        // Create a mock UserSubscription object for the callback
        const mockSubscription: UserSubscription = {
          _id: `sub-${plan._id}`,
          userId: 'current-user',
          planId: plan._id,
          // displayName: plan.displayName as "starter" | "basic" | "pro" | "elite",
          planDetails: {
            displayName: plan.displayName,
            description: plan.description,
            limits: {
              listings: plan.limits.listings,
            },
          },
          status: 'active',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          gateway: 'flutterwave',
          gatewaySubscriptionId: `gw-${plan._id}`,
          currency: selectedCurrency.code,
          interval: selectedBillingCycle.type,
          amount: getPlanPrice(plan, selectedBillingCycle.type),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        onPlanSelected(mockSubscription);
      } else {       
        const price = getPlanPrice(plan, selectedBillingCycle.type);       
        await subscribeToPlan(plan.name, selectedBillingCycle.type, selectedCurrency.code);
      }
      
    } catch (error) {
      console.error('Failed to subscribe to plan:', error);
    } finally {
      setProcessingPlan(null);
    }
  };

  // Combine local processing state with context loading state
  const isProcessing = contextLoading || processingPlan !== null;

  // Determine what to show based on state
  const renderContent = () => {
    // Show loading spinner when context is loading
    if (contextLoading && sortedPlans.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription plans...</p>
        </div>
      );
    }

    // Show prompt to select currency on initial load when no plans are loaded
    if (!hasUserSelectedCurrency && sortedPlans.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="text-blue-600 mb-3">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Currency</h3>
              <p className="text-gray-600 mb-4">
                Please select your preferred currency above to view available subscription plans and pricing.
              </p>
              <p className="text-sm text-gray-500">
                Choose between US Dollars (USD) or Nigerian Naira (NGN) to see plans in your local currency.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Show plans when they are available
    if (sortedPlans.length > 0) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {sortedPlans.map((plan) => (
            <SubscriptionCard
              key={plan._id}
              plan={plan}
              currency={selectedCurrency}
              billingCycle={selectedBillingCycle}
              onSubscribe={handlePlanAction}
              isProcessing={isProcessing && processingPlan === plan._id}
              getFormattedPrice={getFormattedPrice}
            />
          ))}
        </div>
      );
    }

    // Show loading state when fetching plans for selected currency
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading {selectedCurrency.code} plans...</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Currency and Billing Cycle Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-6 justify-between items-center">
          {/* Currency Selector */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency)}
                  className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                    selectedCurrency.code === currency.code
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {currency.code}
                </button>
              ))}
            </div>
          </div>

          {/* Billing Cycle Selector */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Cycle
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {billingCycles.map((cycle) => (
                <button
                  key={cycle.type}
                  onClick={() => handleBillingCycleChange(cycle)}
                  className={`flex-1 py-2 px-4 text-sm font-medium transition-colors relative ${
                    selectedBillingCycle.type === cycle.type
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cycle.label}
                  {cycle.discount && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                      {cycle.discount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Plans Grid */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
}