
export interface Coordinates {
  lat: number;
  lon: number;
}

export interface LocationDetails {
  country: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  coordinate: Coordinates;
}

// --- Media Types ---
export interface MediaItem {
  url: string;
  public_id: string;
}

export interface Media {
  images: MediaItem[];
  videos: MediaItem[];
}

// --- Features Type ---
export interface Features {
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  parkingSpaces: number;
  size: number; 
  yearBuilt: number;
  furnishing: string;
  amenities: string; 
  extras: string;
  condition: string;
}

// --- Contact Type ---
export interface Contact {
  listedBy?: string;
  contactName?: string;
  contactNumber?: string;
  contactEmail?: string;
  agency?: string;
}

// --- Metadata Types ---
export interface PropertyMetadata {
  dateListed: Date;
  isVerified: boolean;
  views: number;
  status: 'active' | 'pending' | 'sold' | 'rented' | 'inactive';
  isFeatured: boolean;
  hasManualPushUp: boolean; 
  hasSocialMediaAd: boolean;
  pushUpUsedAt: Date | null;
  socialMediaAdUsedAt: Date | null;
}

export interface Dispute {
  openedBy?: string;
  reason?: string;
  evidenceUrl?: string;
  openedAt?: Date;
  winner?: string;
}

// --- Main Property Type ---
export interface Property {
  _id: string;
  id: string;
  isNew: string;
  userId: string;
  agentId: string;
  title: string;
  description: string;
  listingType: 'sale' | 'rent' | 'shortlet';
  propertyType: string;
  totalProperties?: number;
  price: number;
  currency: 'USD' | 'NGN';
  lat: number;
  lon: number;
  
  location: LocationDetails;
  features: Features;
  media: Media;
  contact: Contact;
  metadata: PropertyMetadata;
  condition: 'new' | 'old' | 'renovated';
  status: "available" | "negotiation" | "rented" | "unavailable";
  ownership: 'agent' | 'helper' | 'owner';
  
  dispute?: Dispute; 
  propertyLimit: 5 | 20 | 50; 
  
  createdAt: Date;
  updatedAt: Date;
}

// --- Payloads for Listing/Updating ---
export interface PropertyListingPayload {
  title: string;
  description: string;
  listingType: 'sale' | 'rent' | 'shortlet';
  price: number;
  currency: 'USD' | 'NGN';
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    coordinate: {
      lat: number;
      lon: number;
    };
  };
  media: {
    images: string[]; // Cloudinary URLs
    videos: string[]; // Cloudinary URLs
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    parkingSpaces: number;
    size: number;
    yearBuilt: number;
    furnishing: string;
    amenities: string;
    extras: string;
    condition: string;
  };
  contact: string;
  ownership: 'owner' | 'agent' | "helper";
  propertyType: string;
  status: "available" | "negotiation" | "rented" | "unavailable";
  condition: 'new' | 'old' | 'renovated';
  imagesToRemove?: string[];
  videosToRemove?: string[];
}

// --- Form Data Type ---
export interface FormData {
  title: string;
  description: string;
  listingType: string;
  price: string;
  currency: string;
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    coordinate: {
      lat: number;
      lon: number;
    };
  };
  media: {
    images: File[];
    videos: File[];
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    parkingSpaces: number;
    size: number;
    yearBuilt: number;
    furnishing: string;
    amenities: string;
    extras: string;
    condition: string;
  };
  contact: string;
  ownership: string;
  propertyType: string;
  status: string;
  condition: string;
}

// --- Report Types ---
export interface PropertyReportPayload {
  reason: string;
  description?: string;
}

export interface Report {
  _id: string;
  reporter: string;
  property: string | Property;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  updatedAt?: Date;
}

// --- API Response Types ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  totalProperties?: number;
  property?: Property;
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

// --- Preview File Type ---
export interface PreviewFile {
  id: string;
  file: File;
  preview: string;
  uploadProgress?: number;
  uploadedUrl?: string;
  type: 'image' | 'video';
}

// --- Context Property Type (Simplified) ---
export interface ContextProperty extends Omit<Property, 'contact' | 'metadata'> {
  // You can extend or modify specific properties for context usage
  isFavorite?: boolean;
  distance?: number;
}

// --- Usage Data Interface ---
export interface UsageData {
  listingsCreated: number;
  limit: number;
  manualPushUpsUsed: number;
  manualPushUpsLimit: number;
  featuredListingsUsed: number;
  featuredListingsLimit: number;
  socialMediaAdsUsed: number;
  socialMediaAdsLimit: number;
}

// --- Property Filters ---
export interface PropertyFilters {
  listingType?: 'sale' | 'rent' | 'shortlet';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  location?: string;
  status?: string;
  coordinates?: {
    lat: number;
    lon: number;
    radius: number;
  };
}

// --- Property Search Result ---
export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}