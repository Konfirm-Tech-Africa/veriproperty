'use client';
import React, { useState, ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { MailIcon, LockIcon, GoogleIcon } from '@/app/components/common/Icons';
import { authService, EmailNotVerifiedError } from '@/app/api/auth';
import { useUser } from '@/app/context/UserContext';
import AuthFormInput from '@/app/components/common/AuthFormInput';
import AuthSocialButton from '@/app/components/common/AuthSocialButton';
import Footer from '@/app/components/footer';
import { Navbar } from '@/app/components/navbar';
import { useMessageCenter } from '@/app/components/message/MessageCenter';

// Define proper interface for error response
interface ErrorResponse {
  message?: string;
  success?: boolean;
  [key: string]: unknown;
}

const Login: React.FC = () => {
  const router = useRouter();
  const { login } = useUser();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { showSuccess, showError } = useMessageCenter();

  const handleInputChange = useCallback((field: keyof typeof formData) => 
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
    }, [error]);

  const redirectBasedOnRole = useCallback((role: string) => {
    const routes: { [key: string]: string } = {
      super_admin: '/dashboard/super-admin',
      admin: '/dashboard/super-admin/admin',
      agent: '/dashboard/agent',
    };
    
    const route = routes[role] || '/dashboard/customer';
    router.push(route);
  }, [router]);

  const handleEmailVerification = useCallback((email: string) => {
    sessionStorage.setItem('verificationEmail', email);
    sessionStorage.setItem('loginEmail', email);
    sessionStorage.setItem('email', email);
    router.push('/auth/verifications');
  }, [router]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {     
      const response = await authService.login({ 
        email: formData.email.trim().toLowerCase(), 
        password: formData.password 
      });
      
      // Handle email verification
      if (response.user && (!response.user.isEmailVerified || !response.user.isVerified)) {
        showSuccess('Email not verified. Redirecting to email verification page...');
        handleEmailVerification(formData.email);
        return;
      }

      // Update context first, then handle redirects
      if (response.user && response.accessToken) {
        login(response.user, response.accessToken);
        showSuccess('Login successful. User verified.');
        
        setTimeout(() => {
          if (response.user?.role === 'agent' && !response.user.kycVerified) {
            showSuccess('Agent KYC not verified. Redirecting to KYC verification.');
            router.push('/dashboard/agent/settings/verification');
          }
          else if (response.user?.role === 'agent' && response.user.status === "pending") {
            showSuccess('Agent KYC not verified. Redirecting to KYC verification status.');
            router.push('/dashboard/agent/settings/verification/status');
          }
          
          else {
            showSuccess('Redirecting to dashboard...');
            redirectBasedOnRole(response.user?.role || 'customer');
          }
        }, 300);
      } else {
        showError('Invalid response from server. Please try again.');
        setError('Invalid response from server. Please try again.');
      }

    } catch (err: unknown) {
      console.error('Login error:', err);
      
      // Handle email not verified error specifically
      if (err instanceof EmailNotVerifiedError) {
        showError('Email not verified. Redirecting to verification page...');
        handleEmailVerification(err.email || formData.email);
        return;
      }
      
      // Handle other Axios errors with proper typing
      if (err instanceof AxiosError) {
        showError('Login failed. Please check your credentials.');
        const errorData = err.response?.data as ErrorResponse;
        const errorMessage = errorData?.message || err.message || 'Login failed. Please check your credentials.';
        
        if (err.code === 'ECONNABORTED' || err.message?.includes('Network')) {
          showError('Network error. Please check your connection.');
          setError('Network error. Please check your connection.');
        } else {
          showError(errorMessage);
          setError(errorMessage);
        }
      } else if (err instanceof Error) {
        showError(err.message || 'Login failed. Please check your credentials.');
        setError(err.message || 'Login failed. Please check your credentials.');
      } else {
        showError('Login failed. Please check your credentials.');
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="flex flex-col w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-500">Sign in to your account to continue</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleLogin} noValidate>
          <AuthFormInput
            type="email"
            placeholder="Email Address"
            icon={<MailIcon />}
            value={formData.email}
            onChange={handleInputChange('email')}
            required={true}
            disabled={loading}
          />
          
          <div className="relative">
            <AuthFormInput
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              icon={<LockIcon />}
              value={formData.password}
              onChange={handleInputChange('password')}
              required={true}
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye icon for hiding password
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                // Eye icon for showing password
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          {error && (
            <div className="p-3 text-sm text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-sm font-semibold text-white transition-all duration-200 bg-red-600 rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Logging In...
              </span>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-x-0 h-px bg-gray-200"></div>
          <span className="relative z-10 px-4 text-sm font-medium text-gray-400 bg-white">
            OR
          </span>
        </div>

        <div className="space-y-3">
          <AuthSocialButton 
            icon={<GoogleIcon />} 
            text="Log In with Google"
            disabled={loading}
          />
        </div>

        <p className="mt-6 text-sm text-center text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-red-700 hover:underline focus:outline-none cursor-pointer transition-colors duration-200"
          >
            Create Account
          </Link>
        </p>

        <p className="mt-4 text-sm text-center text-gray-500">
          <Link
            href="/auth/forgot-password"
            className="font-medium text-red-700 hover:text-red-900 hover:underline focus:outline-none cursor-pointer transition-colors duration-200"
          >
            Forgot password?
          </Link>
        </p>
      </div>
      </div>
  <Footer/>
  </>
  );
};

export default Login;