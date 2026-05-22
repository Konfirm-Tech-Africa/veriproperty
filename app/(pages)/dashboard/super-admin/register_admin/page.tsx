'use client';
import React, { useState, ChangeEvent } from 'react';
import { MailIcon, LockIcon, UserIcon } from '@/app/components/common/Icons';
import { FormInput } from '@/app/components/common/FormInput';
import Link from 'next/link';
import { adminService } from '@/app/api/adminService';
import { useRouter } from 'next/navigation';

const RegisterAdmin: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (field: keyof typeof formData) => 
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
      if (success) setSuccess(null);
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

    return true;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log('Creating new admin...');
      
      const response = await adminService.createAdmin({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: 'admin'
      });    
      
      console.log('Admin creation successful:', response);
      setSuccess('Admin account created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Optionally redirect to admins list after delay
      setTimeout(() => {
        router.push('/dashboard/super-admin/admins');
      }, 2000);
    
    } catch (err: unknown) {
      console.error('Admin creation error:', err);
      
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();
        
        if (errorMessage.includes('email') && errorMessage.includes('already')) {
          setError('Email already exists. Please use a different email.');
        } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
          setError('Network error. Please check your connection and try again.');
        } else if (errorMessage.includes('unauthorized') || errorMessage.includes('permission')) {
          setError('You do not have permission to create admin accounts.');
        } else {
          setError(err.message || 'Admin creation failed. Please try again.');
        }
      } else {
        setError('Admin creation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-[80vh] px-4'>
      <div className="flex flex-col w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create New Admin</h1>
          <p className="mt-2 text-gray-500">Add a new admin to manage the platform</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
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
          
          {error && (
            <div className="p-3 text-sm text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 text-sm text-center text-green-500 bg-green-50 rounded-lg border border-green-200">
              {success}
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 bg-red-600 rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creating Admin...
                </span>
              ) : (
                'Create Admin'
              )}
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-sm text-center text-gray-500">
          Back to{' '}
          <Link
            href="/dashboard"
            className="font-semibold text-slate-900 hover:underline focus:outline-none cursor-pointer transition-colors duration-200"
          >
            Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterAdmin;