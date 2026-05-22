
export interface PendingSubscription {
  tx_ref: string;
  planId: string;
  interval: 'monthly' | 'yearly';
  amount: number;
  currency: 'USD' | 'NGN';
  gateway: 'flutterwave';
}

export interface SubscriptionContextType {
  // State
  plans: SubscriptionPlan[];
  currentSubscription: UserSubscription | null;
  usage: UsageData | null;
  loading: boolean;
  error: string | null;
  billingCycle: BillingCycle;
  currency: Currency;
  
  // Actions
  setBillingCycle: (cycle: BillingCycle) => void;
  setCurrency: (currency: Currency) => void;
  subscribeToPlan: (planName: string, interval: 'monthly' | 'yearly', currency: 'USD' | 'NGN') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  upgradeSubscription: (newPlanName: string) => Promise<void>;
  fetchUsage: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

export interface FlutterwavePaymentResponse {
  success: boolean;
  message: string;
  payment_url: string;
  tx_ref: string;
  plan: string;
  amount: number;
  currency: string;
  interval: string;
}



export interface UsageItem {
  used: number;
  limit: number | string;
  remaining: number | string;
  canUse?: boolean;
  canCreate?: boolean;
}

export interface UsageApiResponse {
  plan: {
    name: string;
    status: string;
    currency: string;
    currentPeriodEnd: string;
  };
  
    listings: UsageItem;
    manualPushUps: UsageItem;
    featuredListings: UsageItem;
    clientRequests: UsageItem;
    socialMediaAds?: UsageItem;

  features: {
    verifiedBadge: boolean;
    whatsappIntegration: boolean;
    socialMediaAds: boolean;
    bannerAds: boolean;
    areaSpecialist: boolean;
    [key: string]: boolean;
  };
  support: {
    email: boolean;
    chat: boolean;
    priority: boolean;
    dedicatedManager: boolean;
    [key: string]: boolean;
  };
}

// Define usage data interface for context
export interface UsageData {
  listingsCreated: number;
  limit: number;
  used: number;
  manualPushUps: number;
  manualPushUpsLimit: number;
  featuredListingsUsed: number;
  featuredListingsLimit: number;
  socialMediaAdsUsed: number;
  socialMediaAdsLimit: number;
  clientRequestsUsed: number;
  clientRequestsLimit: number;
  canCreateListing: boolean;
}

// Import or define other interfaces
export interface SubscriptionPlan {
  _id: string;
  name: 'starter' | 'basic' | 'pro' | 'elite';
  displayName: string;
  status?: 'active' | 'canceled' | 'past_due' | 'inactive' | 'free';
  description: string;
  currentPeriodEnd: string;
  // Flat pricing structure for the plan's specific currency
  pricing: {
    monthly: number;
    yearly: number;
    formatted: {
      monthly: string;
      yearly: string;
    };
  };
  // The currency this plan's pricing is in
  currency: 'USD' | 'NGN';
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
  features: {
    verifiedBadge: boolean;
    whatsappIntegration: boolean;
    socialMediaAds: boolean;
    bannerAds: boolean;
    areaSpecialist: boolean;
    priorityListing: boolean;
  };
  support: {
    email: boolean;
    chat: boolean;
    priority: boolean;
    dedicatedManager: boolean;
  };
  flutterwavePlanId: {
    NGN: {
      monthly?: string | null;
      yearly?: string | null;
    };
    USD: {
      monthly?: string | null;
      yearly?: string | null;
    };
  };
  isActive: boolean;
  isFree: boolean;
  tier: number;
  badgeColor: string;
  createdAt: string;
  updatedAt: string;
  availableGateways: Array<{
    name: string;
    displayName: string;
  }>;
}

export interface UserSubscription {
  _id: string;
  userId: string;
  planId: string;
  // displayName: 'starter' | 'basic' | 'pro' | 'elite';
  status: 'active' | 'canceled' | 'past_due' | 'inactive' | 'free';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  planDetails: {
    displayName: string;
    description: string;
    limits: {
      listings: number;
    };
  };
  canceledAt?: string;
  gateway: 'flutterwave';
  gatewaySubscriptionId?: string;
  currency: 'USD' | 'NGN';
  interval: 'monthly' | 'yearly';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BillingCycle {
  type: 'monthly' | 'yearly';
  label: string;
  discount?: string;
}

export interface Currency {
  code: 'USD' | 'NGN';
  symbol: string;
  name: string;
}

export interface ApiResponse<T> {
  subscription: UserSubscription;
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  usage?: T;
  payment_url?: string;
}

export interface SubscriptionResponse {
  payment_url?: string;
  usage?: {
    listingsCreated: number;
    limit: number;
    manualPushUpsUsed: number;
    manualPushUpsLimit: number;
    featuredListingsUsed: number;
    featuredListingsLimit: number;
    socialMediaAdsUsed: number;
    socialMediaAdsLimit: number;
  };
}

export interface CreateSubscriptionRequest {
  planName: string;
  interval: 'monthly' | 'yearly';
  currency: 'USD' | 'NGN';
  paymentGateway?: 'flutterwave';
}