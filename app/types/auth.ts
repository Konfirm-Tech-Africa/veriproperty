
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'buy' | 'admin' | 'super-admin';
  isEmailVerified?: boolean;
  isVerified?: boolean;
  kycVerified?: boolean;
  status?: 'pending' | 'verified' | 'rejected' | 'unverified';
  kycData?: {
    idType: string;
    idNumble: string;
    fullName: string;
    verifiedAt?: string;
    document?: string;
  };
  professionalData?: {
    agency: {
      name?: string;
      licenseNumber?: string;
      address?: string;
    }
    cea?: string;
    whatsapp?: string;
    submittedAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user?: User;
  accessToken: string;
  success: boolean;
  message: string
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'buy' | 'agent' | 'admin';
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Agent Verification Interfaces
export interface NINVerificationData {
  nin: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface ProfessionalInfoData {
  agencyName?: string;
  licenseNumber?: string;
  yearsOfExperience: number;
  specialties: string[];
  bio: string;
}

export interface AgentVerificationData {
  ninData: NINVerificationData;
  professionalData: ProfessionalInfoData;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  user: User;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}


export interface FormInputProps {
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  error?: boolean;
}

export interface SocialButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}



export interface ApiErrorResponse {
  message?: string;
  success?: boolean;
  email?: string;
}

// In your auth types
export interface ResendOtpResponse {
  success: boolean;
  message: string;
  expiresIn?: number; // Optional: time in milliseconds
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    role: "buy" | "agent" | "admin";
    email: string;
    isVerified: boolean;
    isEmailVerified: boolean;
    kycVerified: boolean;
  };
}