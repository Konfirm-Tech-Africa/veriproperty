"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '@/app/api/auth';
import type { User } from '../types/auth';
import { cookieService } from '@/app/lib/cookies';

interface ProfessionalData {
  agency: {
    name?: string;
    licenseNumber?: string;
    address?: string;
  };
  cea?: string;
  whatsapp?: string;
}

interface ExtendedUser extends User {
  isVerified?: boolean;
  kycVerified?: boolean;
  status?: 'pending' | 'verified' | 'rejected' | 'unverified';
  professionalData?: ProfessionalData;
  avatar?: string;
    name: string;
    email: string;
    licenseNumber?: string;
    address?: string;
  agency?: {
    name?: string;
    licenseNumber?: string;
    address?: string;
  };
  cea?: string;
  whatsapp?: string;
}

interface UserContextType {
  user: ExtendedUser | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
  updateUser: (updates: Partial<ExtendedUser>) => void;
  updateProfile: (updates: Partial<ExtendedUser>) => Promise<void>;
  userProfile: () => Promise<User | null>;
  loading: boolean;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = cookieService.get('accessToken');      
      if (token) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData as ExtendedUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, token: string) => {
    setUser(userData as ExtendedUser);
    setIsAuthenticated(true);
    cookieService.set('accessToken', token, 7);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      cookieService.remove('accessToken');
    }
  };

  const logout = handleLogout;

  const updateUser = (updates: Partial<ExtendedUser>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const userProfile = async () => {
    try {
      const profileData = await authService.getCurrentUser();
      return profileData;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
    return null;
  };
  // update user profile
  const updateProfile = async (updates: Partial<ExtendedUser>) => {
    try {
      const updatedUser = await authService.updateProfile(updates);
      setUser(prev => prev ? { ...prev, ...updatedUser } : null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const value: UserContextType = {
    user,
    login,
    logout,
    updateUser,
    updateProfile,
    checkAuth,
    userProfile,
    loading,
    isAuthenticated,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}