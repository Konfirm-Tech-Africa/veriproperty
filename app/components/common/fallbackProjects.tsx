import { Agent, SubscriptionPlan } from "../property/types/agent";

interface Media {
  url: string;
  alt?: string;
}

interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
}

interface Features {
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parkingSpaces?: number;
  size?: number;
  yearBuilt?: number;
  furnishing?: string;
  amenities?: string | string[];
  extras?: string;
  condition?: string;
}

export interface Project {
  id: string;
  agentId: string;
  agent?: Agent; // ✅ Add this optional agent property
  media?: Media[];
  title: string;
  location: Location;
  price: string;
  isNew: boolean;
  propertyType: string;
  features: Features;
  description?: string;
  condition?: string;
  images?: string[];
}

export interface OnBack {
  onBack: () => void;
}

// Your existing subscription plans remain the same...
const starterPlan: SubscriptionPlan = {
  name: 'starter',
  displayName: 'Starter Agent',
  description: 'Free plan for new agents testing the platform',
  tier: 1,
  isActive: true,
  isFree: true,
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
  },
  badgeColor: '#6B7280'
};

const proPlan: SubscriptionPlan = {
  name: 'pro',
  displayName: 'Pro Agent',
  description: 'For professional agents managing multiple listings',
  tier: 3,
  isActive: true,
  isFree: false,
  pricing: {
    USD: { monthly: 2600, yearly: 31200 },
    NGN: { monthly: 40000, yearly: 480000 }
  },
  formattedPricing: {
    USD: { monthly: '$26.00', yearly: '$312.00' },
    NGN: { monthly: '₦40,000', yearly: '₦480,000' }
  },
  limits: {
    listings: 100,
    manualPushUps: 20,
    featuredListings: 5,
    areaSpecialists: 3,
    socialMediaAds: 2,
    bannerAds: false,
    sponsoredListings: 5,
    clientRequests: -1,
    autoPushUpFrequency: 15
  },
  features: {
    verifiedBadge: true,
    whatsappIntegration: true,
    socialMediaAds: true,
    bannerAds: false,
    areaSpecialist: true,
    advancedAnalytics: true,
    priorityListing: true
  },
  support: {
    email: true,
    chat: true,
    priority: true,
    dedicatedManager: false
  },
  flutterwavePlanId: {
    NGN: { 
      monthly: 'FLW_PLAN_PRO_NGN_MONTHLY', 
      yearly: 'FLW_PLAN_PRO_NGN_YEARLY' 
    },
    USD: { 
      monthly: 'FLW_PLAN_PRO_USD_MONTHLY', 
      yearly: 'FLW_PLAN_PRO_USD_YEARLY' 
    }
  },
  badgeColor: '#8B5CF6'
};

const basicPlan: SubscriptionPlan = {
  name: 'basic',
  displayName: 'Basic Agent',
  description: 'For solo agents looking to grow visibility',
  tier: 2,
  isActive: true,
  isFree: false,
  pricing: {
    USD: { monthly: 1300, yearly: 15600 },
    NGN: { monthly: 20000, yearly: 240000 }
  },
  formattedPricing: {
    USD: { monthly: '$13.00', yearly: '$156.00' },
    NGN: { monthly: '₦20,000', yearly: '₦240,000' }
  },
  limits: {
    listings: 25,
    manualPushUps: 10,
    featuredListings: 2,
    areaSpecialists: 1,
    socialMediaAds: 0,
    bannerAds: false,
    sponsoredListings: 0,
    clientRequests: 20,
    autoPushUpFrequency: 30
  },
  features: {
    verifiedBadge: true,
    whatsappIntegration: true,
    socialMediaAds: false,
    bannerAds: false,
    areaSpecialist: true,
    advancedAnalytics: true,
    priorityListing: false
  },
  support: {
    email: true,
    chat: true,
    priority: false,
    dedicatedManager: false
  },
  flutterwavePlanId: {
    NGN: { 
      monthly: 'FLW_PLAN_BASIC_NGN_MONTHLY', 
      yearly: 'FLW_PLAN_BASIC_NGN_YEARLY' 
    },
    USD: { 
      monthly: 'FLW_PLAN_BASIC_USD_MONTHLY', 
      yearly: 'FLW_PLAN_BASIC_USD_YEARLY' 
    }
  },
  badgeColor: '#3B82F6'
};

export const fallbackAgents: Agent[] = [
  {
    agentId: 'agent123',
    name: "Paul Seow",
    agency: "PROPNEX REALTY PTE. LTD.",
    cea: "CEA: R053893D / L3008022J",
    whatsapp: "+65 9123 4567",
    avatar: "https://placehold.co/100x100?text=Paul",
    phone: "+65 9123 4567",
    email: "paul.seow@example.com",
    rating: 4.8,
    subscriptionPlan: proPlan,
    subscriptionStatus: 'active',
    propertiesListed: 45,
    responseRate: 95,
    responseTime: "within 1 hour",
    isOnline: true
  },
  {
    agentId: 'agent456',
    name: "Sam Liu Tong",
    agency: "HUTTONS ASIA PTE LTD",
    cea: "CEA: R000191D / L3008899K",
    whatsapp: "+1 (202) 555-0191",
    avatar: "https://placehold.co/100x100?text=Sam",
    phone: "+1 202-555-0191",
    email: "sam.liu@example.com",
    rating: 4.5,
    subscriptionPlan: basicPlan,
    subscriptionStatus: 'active',
    propertiesListed: 23,
    responseRate: 88,
    responseTime: "within 2 hours",
    isOnline: false
  },
  {
    agentId: 'agent789',
    name: "Sarah Chen",
    agency: "ERA REALTY NETWORK PTE LTD",
    cea: "CEA: R042567A / L3007456M",
    whatsapp: "+65 9876 5432",
    avatar: "https://placehold.co/100x100?text=Sarah",
    phone: "+65 9876 5432",
    email: "sarah.chen@example.com",
    rating: 4.2,
    subscriptionPlan: starterPlan,
    subscriptionStatus: 'active',
    propertiesListed: 8,
    responseRate: 75,
    responseTime: "within 4 hours",
    isOnline: true
  }
];

export const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'Aurea',
    location: {
      address: 'Beach Road',
      city: 'Nigeria',
      state: 'Central',
      country: 'Nigeria'
    },
    price: '# 5,500',
    isNew: true,
    propertyType: 'Condominium',
    features: {
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      size: 1200,
      yearBuilt: 2020,
      condition: "New",
      extras: "Kitchen",
      amenities: ["Swimming Pool", "Gym", "BBQ Area"]
    },
    agentId: 'agent123',
    agent: fallbackAgents.find(a => a.agentId === 'agent123'), // ✅ Add agent data
    description: 'Springleaf Residence will be the first development to shape the transformation of the Springleaf neighbourhood. It marks the start of URA\'s long-term housing vision for the area, which includes around 2,000 new homes and expanded nature-based recreational spaces, supported by improved accessibility following the opening of Springleaf MRT station in 2021.',
    images: [
      "https://placehold.co/400x300?text=Gallery1",
      "https://placehold.co/400x300?text=Gallery2"
    ]
  },
  {
    id: '2',
    title: 'One Marina Gardens',
    location: {
      address: 'Marina Bay',
      city: 'Nigeria',
      state: 'Central',
      country: 'Nigeria'
    },
    price: '# 8,480,000',
    isNew: true,
    propertyType: 'Detached House',
    features: {
      bedrooms: 6,
      bathrooms: 7,
      parkingSpaces: 3,
      size: 4500,
      yearBuilt: 2020,
      condition: "New",
      extras: "Kitchen",
      amenities: ["Private Garden", "Swimming Pool", "Home Theater"]
    },
    agentId: 'agent123',
    agent: fallbackAgents.find(a => a.agentId === 'agent123'), // ✅ Add agent data
    description: 'Springleaf Residence will be the first development to shape the transformation of the Springleaf neighbourhood. It marks the start of URA\'s long-term housing vision for the area, which includes around 2,000 new homes and expanded nature-based recreational spaces, supported by improved accessibility following the opening of Springleaf MRT station in 2021.',
    images: [
      "https://placehold.co/400x300?text=Gallery1",
      "https://placehold.co/400x300?text=Gallery2", 
    ]
  },
  {
    id: '3',
    title: 'Aurea',
    location: {
      address: 'Beach Road',
      city: 'Nigeria',
      state: 'Central',
      country: 'Nigeria'
    },
    price: '# 5,500',
    isNew: true,
    propertyType: 'Condominium',
    features: {
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 1,
      size: 1100,
      yearBuilt: 2020,
      condition: "New",
      extras: "Kitchen",
      amenities: ["Gym", "Playground", "Function Room"]
    },
    agentId: 'agent456',
    agent: fallbackAgents.find(a => a.agentId === 'agent456'), // ✅ Add agent data
    description: 'Springleaf Residence will be the first development to shape the transformation of the Springleaf neighbourhood. It marks the start of URA\'s long-term housing vision for the area, which includes around 2,000 new homes and expanded nature-based recreational spaces, supported by improved accessibility following the opening of Springleaf MRT station in 2021.',
    images: [
      "https://placehold.co/400x300?text=Gallery1",
      "https://placehold.co/400x300?text=Gallery2"
    ]
  },
  {
    id: '4',
    title: 'One Marina Gardens',
    location: {
      address: 'Marina Bay',
      city: 'Nigeria',
      state: 'Central',
      country: 'Nigeria'
    },
    price: '# 8,480,000',
    isNew: true,
    propertyType: 'Detached House',
    features: {
      bedrooms: 6,
      bathrooms: 7,
      parkingSpaces: 3,
      size: 4600,
      yearBuilt: 2021,
      condition: "New",
      extras: "Kitchen",
      amenities: ["Wine Cellar", "Home Spa", "Rooftop Terrace"]
    },
    agentId: 'agent789',
    agent: fallbackAgents.find(a => a.agentId === 'agent789'), // ✅ Add agent data
    description: 'Springleaf Residence will be the first development to shape the transformation of the Springleaf neighbourhood. It marks the start of URA\'s long-term housing vision for the area, which includes around 2,000 new homes and expanded nature-based recreational spaces, supported by improved accessibility following the opening of Springleaf MRT station in 2021.',
    images: [
      "https://placehold.co/400x300?text=Gallery1",
      "https://placehold.co/400x300?text=Gallery2", 
    ]
  }
];