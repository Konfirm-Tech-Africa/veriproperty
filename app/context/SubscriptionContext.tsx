'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { cookieService } from '../lib/cookies';
import { 
  UsageApiResponse, 
  UsageData, 
  SubscriptionPlan, 
  UserSubscription, 
  BillingCycle, 
  Currency, 
  ApiResponse, 
  SubscriptionResponse, 
  CreateSubscriptionRequest 
} from '../components/property/types/subscription';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  currentSubscription: UserSubscription | null;
  usageData: UsageData | null;
  loading: boolean;
  error: string | null;
  billingCycle: BillingCycle;
  currency: Currency;
  setBillingCycle: (cycle: BillingCycle) => void;
  setCurrency: (currency: Currency) => void;
  refreshSubscriptions: () => Promise<void>;
  subscribeToPlan: (planName: string, interval: 'monthly' | 'yearly', currency: 'NGN' | 'USD') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  upgradeSubscription: (newPlanName: string) => Promise<void>;
  fetchUsage: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
  fetchPlans: (currency?: string) => Promise<void>; // Updated to accept currency parameter
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
  autoInitialize?: boolean;
}

interface ApiCallOptions extends Omit<AxiosRequestConfig, 'url'> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ 
  children, 
  autoInitialize = false
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>({ type: 'monthly', label: 'Monthly' });
  const [currency, setCurrency] = useState<Currency>({ code: 'USD', symbol: '$', name: 'US Dollar' });
  const [initialized, setInitialized] = useState(false);

  const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config) => {
      const token = cookieService.getAuthToken?.() || cookieService.get?.('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        cookieService.remove('accessToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }
      return Promise.reject(error);
    }
  );

  const apiCall = useCallback(async <T,>(endpoint: string, options: ApiCallOptions = {}): Promise<ApiResponse<T>> => {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await api({
        url: endpoint,
        ...options,
      });

      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
          throw new Error('Unable to connect to the server. Please check your internet connection.');
        }
        
        if (err.response?.data) {
          const errorData = err.response.data as unknown;
          if (typeof errorData === 'object' && errorData !== null && 'message' in errorData) {
            const apiError = errorData as { message?: string };
            throw new Error(apiError.message || `Request failed with status ${err.response.status}`);
          }
          throw new Error(`Request failed with status ${err.response.status}`);
        }
        
        throw new Error(err.message || 'An unexpected error occurred');
      }
      
      throw new Error('An unexpected error occurred');
    }
  }, [api]);

  const clearError = useCallback(() => setError(null), []);

  // UPDATED: fetchPlans now accepts currency parameter
  const fetchPlans = useCallback(async (currencyCode?: string) => {
    try {
      // Build endpoint with currency parameter if provided
      const endpoint = currencyCode 
        ? `/subscriptions/plans?currency=${currencyCode}`
        : '/subscriptions/plans';

      const data = await apiCall<SubscriptionPlan[]>(endpoint);
      
      // Handle different response structures
      if (data && typeof data === 'object') {
        if ('success' in data && data.success && 'data' in data && Array.isArray(data.data)) {
          // Case 1: { success: true, data: SubscriptionPlan[] }
          setPlans(data.data);
        } else if (Array.isArray(data)) {
          // Case 2: Direct array response
          setPlans(data);
        } else if ('plans' in data && Array.isArray(data.plans)) {
          // Case 3: { plans: SubscriptionPlan[] }
          setPlans(data.plans);
        } else {
          console.warn('Unexpected plans response structure:', data);
          setPlans([]);
        }
      } else {
        console.warn('Invalid plans response:', data);
        setPlans([]);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      setPlans([]);
    }
  }, [apiCall]);

  const fetchCurrentSubscription = useCallback(async () => {
    try {
      const token = cookieService.getAuthToken?.() || cookieService.get?.('accessToken');
      if (!token) {
        setCurrentSubscription(null);
        return;
      }

      const data = await apiCall<UserSubscription>('/subscriptions/current');
      
      if (data && typeof data === 'object' && 'success' in data && data.success) {
        // Handle both { success: true, data: UserSubscription } and direct UserSubscription
        if ('data' in data && data.data) {
          setCurrentSubscription(data.data);
        } else {
          // If data is the subscription itself
          setCurrentSubscription(data as unknown as UserSubscription);
        }
      } else {
        setCurrentSubscription(null);
      }
    } catch (err) {
      console.error('Failed to fetch current subscription:', err);
      setCurrentSubscription(null);
    }
  }, [apiCall]);

  const parseLimit = useCallback((limit: number | string): number => {
    if (typeof limit === 'string') {
      return limit === 'Unlimited' ? -1 : parseInt(limit, 10) || 0;
    }
    return limit;
  }, []);

  const fetchUsage = useCallback(async (): Promise<void> => {
    try {
      const token = cookieService.getAuthToken?.() || cookieService.get?.('accessToken');
      if (!token) {
        setUsageData(null);
        return;
      }

      const usageResponse = await apiCall<UsageApiResponse>('/subscriptions/usage');
      const payload = usageResponse.usage;
      if (payload) { 
        if (!payload.listings || !payload.manualPushUps || !payload.featuredListings || !payload.clientRequests) {
          throw new Error('Incomplete usage data received from API');
        }
        const transformedUsageData: UsageData = {
          listingsCreated: payload.listings.used,
          limit: parseLimit(payload.listings.limit),
          used: payload.listings.used,
          manualPushUps: payload.manualPushUps.used,
          manualPushUpsLimit: parseLimit(payload.manualPushUps.limit),
          featuredListingsUsed: payload.featuredListings.used,
          featuredListingsLimit: parseLimit(payload.featuredListings.limit),
          socialMediaAdsUsed: payload.socialMediaAds?.used || 0,
          socialMediaAdsLimit: payload.socialMediaAds ? parseLimit(payload.socialMediaAds.limit) : 0,
          clientRequestsUsed: payload.clientRequests.used,
          clientRequestsLimit: parseLimit(payload.clientRequests.limit),
          canCreateListing: payload.listings.canCreate || payload.listings.canUse || false
        };
        setUsageData(transformedUsageData);
      } else {
        setUsageData(null);
        throw new Error(usageResponse.message || usageResponse.error || 'Failed to fetch usage data or usage data is empty');
      }
    } catch (err) {
      console.error('Failed to fetch usage data:', err);
      setUsageData(null);
    }
  }, [apiCall, parseLimit]);

  const refreshSubscriptions = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      await Promise.all([fetchPlans(), fetchCurrentSubscription(), fetchUsage()]);
    } catch (err) {
      console.error('Error refreshing subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchPlans, fetchCurrentSubscription, fetchUsage, clearError]);

  const initialize = useCallback(async () => {
    if (initialized) return;
    
    setLoading(true);
    try {
      const token = cookieService.getAuthToken?.() || cookieService.get?.('accessToken');
      if (token) {
        await Promise.all([fetchPlans(), fetchCurrentSubscription(), fetchUsage()]);
      } else {
        await fetchPlans();
        setCurrentSubscription(null);
        setUsageData(null);
      }
      setInitialized(true);
    } catch (err) {
      console.error('Error initializing subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }, [initialized, fetchPlans, fetchCurrentSubscription, fetchUsage]);

  const subscribeToPlan = useCallback(async (planName: string, interval: 'monthly' | 'yearly', currency: 'USD' | 'NGN') => {
    setLoading(true);
    clearError();
    
    try {
      const requestData: CreateSubscriptionRequest = {
        planName,
        interval,
        currency,
        paymentGateway: 'flutterwave'
      };

      const data = await apiCall<SubscriptionResponse>('/subscriptions/create_sub', {
        method: 'POST',
        data: requestData,
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to subscribe to plan');
      }

      if (data.success && data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        await refreshSubscriptions();
      }
    } catch (err) {
      console.error('❌ Detailed subscribe error:', err);
      
      let errorMessage = 'Failed to subscribe to plan';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, refreshSubscriptions, clearError]);

  const cancelSubscription = useCallback(async () => {
    setLoading(true);
    clearError();
    
    try {
      const data = await apiCall<void>('/subscriptions/cancel', {
        method: 'POST',
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to cancel subscription');
      }

      await refreshSubscriptions();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, refreshSubscriptions, clearError]);

  const upgradeSubscription = useCallback(async (newPlanName: string) => {
    setLoading(true);
    clearError();
    
    try {
      const data = await apiCall<SubscriptionResponse>('/subscriptions/upgrade', {
        method: 'POST',
        data: { newPlanName },
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to upgrade subscription');
      }

      if (data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        await refreshSubscriptions();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upgrade subscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, refreshSubscriptions, clearError]);

  useEffect(() => {
    if (autoInitialize) {
      initialize();
    }
  }, [autoInitialize, initialize]);

  const value: SubscriptionContextType = {
    plans,
    currentSubscription,
    usageData,
    loading,
    error,
    billingCycle,
    currency,
    setBillingCycle,
    setCurrency,
    refreshSubscriptions,
    subscribeToPlan,
    cancelSubscription,
    upgradeSubscription,
    fetchUsage,
    clearError,
    initialize,
    fetchPlans
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};