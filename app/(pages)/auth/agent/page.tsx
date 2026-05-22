'use client';
import React, { useState, ChangeEvent } from 'react';
import { MailIcon, LockIcon, UserIcon } from '@/app/components/common/Icons';
import { FormInput } from '@/app/components/common/FormInput';
import Link from 'next/link';
import { authService } from '@/app/api/auth';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/app/components/navbar';
import Footer from '@/app/components/footer';
import { useMessageCenter } from '@/app/components/message/MessageCenter';

const AgentRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [agreeToAgentTerms, setAgreeToAgentTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showError, showSuccess } = useMessageCenter();

  const handleInputChange = (field: keyof typeof formData) => 
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
    };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return false;
    }

    if (!agreeToAgentTerms) {
      setError('You must agree to the Agent Terms and Conditions');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {     
      const response = await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: 'agent'
      });    
      
      // Store email for verification
      sessionStorage.setItem('verificationEmail', formData.email);
      sessionStorage.setItem('email', formData.email);
      
      if (response.success) {
        showSuccess('Registration successful! Please verify your email.');
        router.push('/auth/verifications');
      } else {
        router.push('/auth/verifications');
      }
    
    } catch (err: unknown) {
      console.error('Registration error:', err);
      
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();
        
        if (errorMessage.includes('email') && errorMessage.includes('already')) {
          setError('Email already exists. Please use a different email or login.');
          showError('Email already exists. Please use a different email or login.');
        } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
          setError('Network error. Please check your connection and try again.');
          showError('Network error. Please check your connection and try again.');
        } else {
          setError(err.message || 'Registration failed. Please try again.');
          showError(err.message || 'Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please try again.');
        showError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex justify-center items-center min-h-[80vh] px-4 py-10'>
        <div className="flex flex-col w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Join Veri Property Today!</h1>
            <p className="mt-2 text-gray-500">Register as an agent to get started</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
            <FormInput
              type="text"
              placeholder="Full Name"
              icon={<UserIcon />}
              value={formData.name}
              onChange={handleInputChange('name')}
              required
            />
            <FormInput
              type="email"
              placeholder="Email Address"
              icon={<MailIcon />}
              value={formData.email}
              onChange={handleInputChange('email')}
              required
            />
            <FormInput
              type="password"
              placeholder="Password"
              icon={<LockIcon />}
              value={formData.password}
              onChange={handleInputChange('password')}
              required
            />
            <FormInput
              type="password"
              placeholder="Confirm Password"
              icon={<LockIcon />}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
            />

            {/* Terms and Conditions Section */}
            <div className="space-y-3 py-2 border-t border-gray-100">
              {/* General Terms */}
              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                    required
                  />
                </div>
                <label htmlFor="terms" className="text-sm text-gray-600">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" target="_blank" className="text-red-600 hover:underline font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank" className="text-red-600 hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Agent Specific Terms */}
              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="agentTerms"
                    checked={agreeToAgentTerms}
                    onChange={(e) => setAgreeToAgentTerms(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                    required
                  />
                </div>
                <label htmlFor="agentTerms" className="text-sm text-gray-600">
                  You agree to our{' '}
                  <Link href="/agent-terms" target="_blank" className="text-red-600 hover:underline font-medium">
                    Agent Terms and Conditions
                  </Link>{' '}
                  and confirm that you are a licensed real estate professional
                </label>
              </div>
            </div>
            
            {error && (
              <div className="p-3 text-sm text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !agreeToTerms || !agreeToAgentTerms}
              className="w-full px-4 py-3 text-sm font-semibold text-white transition-all duration-200 bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Register as Agent'
              )}
            </button>
          </form>
          
          <p className="mt-6 text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-red-600 hover:underline focus:outline-none cursor-pointer transition-colors duration-200"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AgentRegister;