import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Star, 
  Building2, 
  TrendingUp, 
  Rocket, 
  Crown,
  Zap,
  Shield,
  Users,
  BarChart3,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SubscriptionPlan } from '@/app/components/property/types/subscription';

const planIcons = {
  starter: Star,
  basic: Building2,
  pro: TrendingUp,
  elite: Rocket,
};

const planColors = {
  starter: {
    gradient: 'from-gray-500 to-gray-700',
    border: 'border-gray-300',
    badge: 'bg-gray-100 text-gray-800'
  },
  basic: {
    gradient: 'from-red-500 to-red-700',
    border: 'border-red-300',
    badge: 'bg-red-100 text-red-800'
  },
  pro: {
    gradient: 'from-purple-500 to-purple-700',
    border: 'border-purple-300',
    badge: 'bg-purple-100 text-purple-800'
  },
  elite: {
    gradient: 'from-orange-500 to-orange-700',
    border: 'border-orange-300',
    badge: 'bg-orange-100 text-orange-800'
  },
};
interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

const featureIcons: Record<string, React.ComponentType<IconProps>> = {
  verifiedBadge: Shield,
  whatsappIntegration: MessageCircle,
  socialMediaAds: Users,
  bannerAds: Zap,
  advancedAnalytics: BarChart3,
  priorityListing: Crown,
};

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  currency: { code: 'NGN' | 'USD'; symbol: string; name: string };
  billingCycle: { type: 'monthly' | 'yearly'; label: string; discount?: string };
  onSubscribe: (plan: SubscriptionPlan) => void;
  isProcessing?: boolean;
  getFormattedPrice?: (plan: SubscriptionPlan, billingCycle: 'monthly' | 'yearly') => string;
}

export default function SubscriptionCard({ 
  plan, 
  billingCycle,
  onSubscribe, 
  isProcessing = false,
  getFormattedPrice
}: SubscriptionCardProps) {
  const [expandedSections, setExpandedSections] = useState({
    features: false,
    limits: false,
    support: false
  });

  const IconComponent = planIcons[plan.name] || Star;
  const planColor = planColors[plan.name] || planColors.starter;

  // SIMPLIFIED: Format price display - use the helper function if provided, otherwise use plan's formatted pricing
  const displayPrice = (): string => {
    if (getFormattedPrice) {
      return getFormattedPrice(plan, billingCycle.type);
    }

    // Use the plan's formatted pricing directly (now comes pre-formatted from backend)
    if (plan.isFree) {
      return 'Free';
    }

    // Direct access to pre-formatted pricing
    return plan.pricing.formatted[billingCycle.type];
  };

  // SIMPLIFIED: Calculate yearly savings percentage
  const getYearlySavings = (): number | null => {
    if (billingCycle.type !== 'yearly' || plan.isFree) return null;
    
    const monthlyPrice = plan.pricing.monthly;
    const yearlyPrice = plan.pricing.yearly;
    
    if (monthlyPrice === 0 || yearlyPrice === 0) return null;
    
    const monthlyTotal = monthlyPrice * 12;
    const savings = ((monthlyTotal - yearlyPrice) / monthlyTotal) * 100;
    
    return Math.round(savings);
  };

  const yearlySavings = getYearlySavings();

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getButtonText = (): string => {
    if (plan.isFree) return 'Get Started Free';
    return 'Subscribe Now';
  };

  const getPlanBadge = () => {
    switch (plan.name) {
      case 'starter':
        return { text: 'Perfect for Beginners', color: 'bg-gray-100 text-gray-800' };
      case 'basic':
        return { text: 'Most Popular', color: 'bg-red-100 text-red-800' };
      case 'pro':
        return { text: 'Professional Choice', color: 'bg-purple-100 text-purple-800' };
      case 'elite':
        return { text: 'Agency Grade', color: 'bg-orange-100 text-orange-800' };
      default:
        return { text: plan.displayName, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const planBadge = getPlanBadge();

  return (
    <div className={`bg-white rounded-xl border-2 ${planColor.border} shadow-sm hover:shadow-lg transition-all duration-300`}>
      {/* Plan Header */}
      <div className={`relative p-6 bg-gradient-to-r ${planColor.gradient} rounded-t-xl text-white`}>
        {/* Plan Badge */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${planBadge.color} shadow-sm`}>
            {planBadge.text}
          </span>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <IconComponent className="w-8 h-8 opacity-90" />
              <div>
                <h3 className="text-xl font-bold">{plan.displayName}</h3>
                <p className="text-red-100 text-sm opacity-90">{plan.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold">{displayPrice()}</span>
              {!plan.isFree && (
                <span className="text-red-200 text-sm">
                  /{billingCycle.type === 'monthly' ? 'month' : 'year'}
                </span>
              )}
            </div>
            {yearlySavings && yearlySavings > 0 && (
              <p className="text-green-200 text-sm mt-1">
                Save {yearlySavings}% with yearly billing
              </p>
            )}
            {plan.isFree && (
              <p className="text-red-200 text-sm mt-1">
                List up to 10 properties • No payment required
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Plan Content */}
      <div className="p-6">
        {/* Features Section - Collapsible */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('features')}
            className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 text-sm">Features</h4>
            {expandedSections.features ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <div className={`space-y-2 ${expandedSections.features ? 'block' : 'hidden'}`}>
            {Object.entries(plan.features).map(([key, enabled]) => {
              const FeatureIcon = featureIcons[key];
              const featureName = key.replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .replace('Whatsapp', 'WhatsApp');
              
              return (
                <div key={key} className="flex items-center space-x-3 py-2">
                  {enabled ? (
                    <>
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {FeatureIcon && <FeatureIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />}
                      <span className="text-sm text-gray-700 flex-1">{featureName}</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      {FeatureIcon && <FeatureIcon className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                      <span className="text-sm text-gray-400 line-through flex-1">{featureName}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Limits Section - Collapsible */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('limits')}
            className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 text-sm">Detailed Limits</h4>
            {expandedSections.limits ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <div className={`space-y-2 text-sm ${expandedSections.limits ? 'block' : 'hidden'}`}>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Active Listings</span>
              <span className="font-semibold text-gray-900">
                {plan.limits.listings === -1 ? 'Unlimited' : plan.limits.listings}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Monthly Push-ups</span>
              <span className="font-semibold text-gray-900">
                {plan.limits.manualPushUps === -1 ? 'Unlimited' : plan.limits.manualPushUps}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Featured Listings</span>
              <span className="font-semibold text-gray-900">
                {plan.limits.featuredListings === -1 ? 'Unlimited' : plan.limits.featuredListings}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Client Requests</span>
              <span className="font-semibold text-gray-900">
                {plan.limits.clientRequests === -1 ? 'Unlimited' : plan.limits.clientRequests}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Area Specialists</span>
              <span className="font-semibold text-gray-900">
                {plan.limits.areaSpecialists === -1 ? 'Unlimited' : plan.limits.areaSpecialists}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Social Media Ads</span>
              <span className="font-semibold text-gray-900">
                {plan.limits.socialMediaAds === -1 ? 'Unlimited' : plan.limits.socialMediaAds}
              </span>
            </div>
          </div>
        </div>

        {/* Support Section - Collapsible */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('support')}
            className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 text-sm">Support Level</h4>
            {expandedSections.support ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <div className={`space-y-2 text-sm ${expandedSections.support ? 'block' : 'hidden'}`}>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email Support</span>
              <Check className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Chat Support</span>
              {plan.support?.chat ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-gray-300" />
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Priority Support</span>
              {plan.support?.priority ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-gray-300" />
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Dedicated Manager</span>
              {plan.support?.dedicatedManager ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-gray-300" />
              )}
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={() => onSubscribe(plan)}
          disabled={isProcessing}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            plan.isFree
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            getButtonText()
          )}
        </button>

        {/* Plan Highlights */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 space-y-1">
            {plan.name === 'starter' && (
              <>
                <p>✓ Perfect for new agents</p>
                <p>✓ No commitment required</p>
              </>
            )}
            {plan.name === 'basic' && (
              <>
                <p>✓ Build professional presence</p>
                <p>✓ Verified agent badge</p>
              </>
            )}
            {plan.name === 'pro' && (
              <>
                <p>✓ Accelerate your growth</p>
                <p>✓ Priority listing placement</p>
              </>
            )}
            {plan.name === 'elite' && (
              <>
                <p>✓ Dominate your market</p>
                <p>✓ Dedicated account manager</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}