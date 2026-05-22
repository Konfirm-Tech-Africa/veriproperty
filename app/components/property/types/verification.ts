import { Property } from "./property";

// lib/types/nin.ts
export interface NINVerificationResponse {
  success: boolean;
  data?: {
    nin: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    verificationId: string;
    status: 'verified' | 'pending' | 'failed';
    message?: string;
  };
  error?: string;
  verificationId?: string;
}

export interface NINVerificationData {
  nin: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  verificationId: string;
}

export interface DocumentUploadData {
  verificationId: string;
  frontImage: File;
  backImage: File;
  selfieImage: File;
}


// Response interfaces
export interface MessageResponse {
  message: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalProperties?: number;
  totalUsers?: number;
  totalAdmins?: number;
  totalVerifications?: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse {
  properties: Property[];
  pagination: PaginationData;
}

// User interfaces
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'agent' | 'admin' | 'super_admin';
  isVerified: boolean;
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  profile?: {
    avatar?: string;
    phone?: string;
  };
}

export interface UsersResponse {
  users: User[];
  pagination: PaginationData;
}

/** Admin management interfaces */
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  isVerified: boolean;
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminsResponse {
  admins: AdminUser[];
  pagination: PaginationData;
}

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  role: 'admin';
}

export interface UpdateAdminData {
  name?: string;
  email?: string;
  accountStatus?: 'active' | 'suspended' | 'inactive';
}

// Verification interfaces
export interface Verification {
  _id: string;
  agent: {
    _id: string;
    name: string;
    email: string;
  };
  idType: 'national_id' | 'passport' | 'drivers_license' | 'voters_card';
  fullName: string;
  idNumber: string;
  documents: Array<{
    url: string;
    public_id: string;
    originalName?: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  adminComment?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface VerificationsResponse {
  verifications: Verification[];
  pagination: PaginationData;
}

export interface ReviewVerificationData {
  status: 'approved' | 'rejected';
  adminComment?: string;
}

// Analytics interfaces
export interface AnalyticsData {
  totalUsers: number;
  totalAdmins: number;
  totalProperties: number;
  totalAgents: number;
  pendingVerifications: number;
  pendingListings: number;
  activeSubscriptions: number;
  systemHealth: string;
  recentActivity: Activity[];
}

export interface Activity {
  _id: string;
  type: 'user' | 'property' | 'verification' | 'admin';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    email: string;
  };
}

// Define specific API response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  properties?: Property[];
  users?: User[];
  admins?: AdminUser[];
  verifications?: Verification[];
  count?: number;
  property?: Property;
  listings?: Property[];
  pagination?: PaginationData;
  admin?: AdminUser;
  analytics?: AnalyticsData;
}

export interface Activity {
  _id: string;
  type: 'user' | 'property' | 'verification' | 'admin';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    email: string;
  };
}