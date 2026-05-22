// Enhanced version with helper types and default values
export interface SubscriptionFeatures {
  verifiedBadge: boolean;
  whatsappIntegration: boolean;
  socialMediaAds: boolean;
  bannerAds: boolean;
  areaSpecialist: boolean;
  advancedAnalytics: boolean;
  priorityListing: boolean;
}

// Base subscription plan structure
export interface BaseSubscriptionPlan {
  name: SubscriptionPlanName;
  displayName: string;
  description: string;
  tier: number;
  isActive: boolean;
  isFree: boolean;
  badgeColor: string;
}

// Full subscription plan with all properties
export interface SubscriptionPlan extends BaseSubscriptionPlan {
  pricing: Record<CurrencyCode, Record<BillingInterval, number>>;
  formattedPricing: Record<CurrencyCode, Record<BillingInterval, string>>;
  limits: {
    listings: number;
    manualPushUps: number;
    featuredListings: number;
    areaSpecialists: number;
    socialMediaAds: number;
    bannerAds: boolean;
    sponsoredListings: number;
    clientRequests: number;
    autoPushUpFrequency: number;
  };
  features: SubscriptionFeatures;
  support: {
    email: boolean;
    chat: boolean;
    priority: boolean;
    dedicatedManager: boolean;
  };
  flutterwavePlanId: Record<CurrencyCode, Record<BillingInterval, string | null>>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Agent base information
export interface AgentBase {
  agentId: string;
  name: string;
  agency: string;
  cea?: string;
  whatsapp: string;
  phone: string;
  email: string;
  avatar: string;
}

// Agent with full profile including subscription
export interface Agent extends AgentBase {
  rating?: number;
  reviewCount?: number;
  joinDate?: Date;
  description?: string;
  specialties?: string[];
  languages?: string[];
  officeAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: 'active' | 'inactive' | 'suspended' | 'trial' | 'free';
  currentPeriodEnd?: Date;
  propertiesListed?: number;
  responseRate?: number;
  responseTime?: string;
  isOnline?: boolean;
  lastActive?: Date;
}

// Type definitions for better type safety
export type SubscriptionPlanName = 'starter' | 'basic' | 'pro' | 'elite';
export type CurrencyCode = 'USD' | 'NGN';
export type BillingInterval = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'inactive' | 'suspended' | 'trial' | 'free';

// Helper function to create default subscription plan
export const createDefaultSubscriptionPlan = (): SubscriptionPlan => ({
  name: 'starter',
  displayName: 'Starter Agent',
  description: 'Free plan for new agents',
  tier: 1,
  isActive: true,
  isFree: true,
  badgeColor: '#6B7280',
  pricing: {
    USD: { monthly: 0, yearly: 0 },
    NGN: { monthly: 0, yearly: 0 }
  },
  formattedPricing: {
    USD: { monthly: 'Free', yearly: 'Free' },
    NGN: { monthly: 'Free', yearly: 'Free' }
  },
  limits: {
    listings: 3,
    manualPushUps: 3,
    featuredListings: 0,
    areaSpecialists: 0,
    socialMediaAds: 0,
    bannerAds: false,
    sponsoredListings: 0,
    clientRequests: 5,
    autoPushUpFrequency: 0
  },
  features: {
    verifiedBadge: false,
    whatsappIntegration: true,
    socialMediaAds: false,
    bannerAds: false,
    areaSpecialist: false,
    advancedAnalytics: false,
    priorityListing: false
  },
  support: {
    email: true,
    chat: false,
    priority: false,
    dedicatedManager: false
  },
  flutterwavePlanId: {
    NGN: { monthly: null, yearly: null },
    USD: { monthly: null, yearly: null }
  }
});

// Helper function to check if agent has a specific feature
export const agentHasFeature = (agent: Agent, feature: keyof SubscriptionFeatures): boolean => {
  return agent.subscriptionPlan.features[feature];
};

// Helper function to get agent's active features
export const getAgentActiveFeatures = (agent: Agent): (keyof SubscriptionFeatures)[] => {
  return Object.entries(agent.subscriptionPlan.features)
    .filter(([_, value]) => value)
    .map(([key]) => key as keyof SubscriptionFeatures);
};

export const isAgent = (obj: unknown): obj is Agent => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  const candidate = obj as Record<string, unknown>;
  
  return (
    typeof candidate.agentId === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.agency === 'string' &&
    typeof candidate.whatsapp === 'string' &&
    typeof candidate.phone === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.avatar === 'string' &&
    candidate.subscriptionPlan !== undefined
  );
};