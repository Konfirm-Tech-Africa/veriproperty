export interface AgentProfile {
  id: string;
  email: string;
  whatsapp: string;
  city: string;
  state: string;
  zipCode: string;
  avatar?: string;
  success?: boolean;
  message?: string;
  agency?: {
    name?: string;
    licenseNumber?: string;
    address?: string;
  };
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  newLeaseAlerts: boolean;
  maintenanceAlerts: boolean;
  paymentReminders: boolean;
  overdueAlerts: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  compactMode: boolean;
  highContrast: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  passwordLastChanged: string;
}

export interface PaymentSettings {
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  paypalEmail: string;
  bankAccount: string;
  bankRouting: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  autoRenew: boolean;
  invoiceEmails: boolean;
  taxReceipts: boolean;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EditProfileData {
  name: string;
  email: string;
  phone?: string;
  whatsapp: string;
  cea: string;
  avatar?: string;
  agency?: {
    name?: string;
    licenseNumber?: string;
    address?: string;
  };
}