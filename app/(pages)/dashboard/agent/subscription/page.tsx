'use client';
import React from 'react';
import { SubscriptionProvider, useSubscription } from '@/app/context/SubscriptionContext';
import SubscriptionPlans from '@/app/components/dashboard/settings/components/subscriptions/SubscriptionPlans';
import CurrentSubscription from '@/app/components/dashboard/settings/components/subscriptions/CurrentSubscription';
import { Crown, TrendingUp, Rocket } from 'lucide-react';

function SubscriptionContent() {
  const { currentSubscription, loading, plans } = useSubscription();
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const hasActiveSubscription = currentSubscription && (currentSubscription.status === 'active' || currentSubscription.status === 'free');
  const currentPlanDetails = currentSubscription 
    ? plans.find(plan => plan.name === currentSubscription.planDetails.displayName)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            PropertyGuru Subscription Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan to grow your real estate business. 
            From individual agents to established agencies, we have a plan for every stage of growth.
          </p>
        </div>

        {/* Current Plan Status Banner */}
        {hasActiveSubscription && currentPlanDetails && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Your Current Plan</h2>
                    <p className="text-green-100">
                      You are on the <strong>{currentPlanDetails.displayName}</strong> plan
                    </p>
                    {currentSubscription.status === 'free' && (
                      <p className="text-green-200 text-sm mt-1">
                        🎉 Free trial active - {Math.ceil((new Date(currentSubscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {currentSubscription.currency === 'USD' ? '$' : '₦'}
                    {((currentSubscription.amount || 0) / 100).toFixed(2)}
                  </div>
                  <div className="text-green-200">per {currentSubscription.interval}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Opportunity for Existing Subscribers */}
        {hasActiveSubscription && currentPlanDetails && currentPlanDetails.tier < 4 && (
          <div className="mb-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Ready to Scale Up?</h3>
                  <p className="text-purple-100">
                    Upgrade to unlock more listings, better visibility, and premium features
                  </p>
                </div>
              </div>
              <Rocket className="w-8 h-8 text-white opacity-80" />
            </div>
          </div>
        )}

        {/* No Subscription Message */}
        {!hasActiveSubscription && (
          <div className="mb-8 bg-gradient-to-r from-red-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-full">
                  <Rocket className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Start Your PropertyGuru Journey</h3>
                  <p className="text-red-100">
                    Begin with our free Starter plan or choose a paid plan to accelerate your growth
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {/* Current Subscription Details */}
        {hasActiveSubscription && (
          <div className="mb-8">
            <CurrentSubscription />
          </div>
        )}


        {/* All Available Plans */}
        <div className="mb-8">
          <SubscriptionPlans/>
        </div>

        {/* Billing History
        {hasActiveSubscription && (
          <div className="mb-8">
            <BillingHistory />
          </div>
        )} */}

        {/* Support Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help Choosing?</h3>
          <p className="text-gray-600 text-lg mb-6 max-w-2xl mx-auto">
            Our team is here to help you select the perfect plan for your business needs. 
            Get personalized recommendations based on your goals and market.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg shadow-md">
              Contact Sales Team
            </button>
            <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg">
              Schedule a Demo
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Can I change plans anytime?</h4>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade your plan at any time. Downgrades will take effect at the end of your current billing period.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Is there a contract or long-term commitment?</h4>
              <p className="text-gray-600 text-sm">
                No long-term contracts. All plans are month-to-month or year-to-year. Cancel anytime.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, debit cards, and bank transfers through our secure payment partners.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Do you offer discounts for annual billing?</h4>
              <p className="text-gray-600 text-sm">
                Yes! Save up to 15% when you choose annual billing instead of monthly payments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <SubscriptionProvider autoInitialize={true}>
      <SubscriptionContent />
    </SubscriptionProvider>
  );
}