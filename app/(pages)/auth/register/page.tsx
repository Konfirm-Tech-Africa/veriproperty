'use client';
import React, { useState, ChangeEvent } from 'react';
import { MailIcon, LockIcon, GoogleIcon, UserIcon } from '@/app/components/common/Icons';
import { FormInput } from '@/app/components/common/FormInput';
import { SocialButton } from '@/app/components/common/SocialButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/app/api/auth';
import Footer from '@/app/components/footer';
import { Navbar } from '@/app/components/navbar';
import { useMessageCenter } from '@/app/components/message/MessageCenter';

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showSuccess, showError } = useMessageCenter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate terms agreement
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        name,
        email,
        password,
        role: 'buy'
      });

      // Store email for verification
      sessionStorage.setItem('email', email);
      
      if (response.success) {
        showSuccess('Registered successfully! Redirecting to email verification page...');
        router.push('/auth/verifications');
      } else {
        showSuccess('Registered successfully! Redirecting to email verification page...');
        router.push('/auth/verifications');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message || 'Registration failed. Please try again.');
        setError(err.message || 'Registration failed. Please try again.');
      } else {
        showError('Registration failed. Please try again.');
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value);
  const handleTermsChange = (e: ChangeEvent<HTMLInputElement>) => setAgreeToTerms(e.target.checked);

  return (
    <>
      <Navbar />
      <div className='flex justify-center items-center min-h-[80vh] px-4 py-10'>
        <div className="flex flex-col w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Join Veri Property Today!</h1>
            <p className="mt-2 text-gray-500">Register now to get started with our service</p>
            <p className="mt-4 text-sm text-center text-gray-500">
              Do you want to Register as AGENT?{' '}
              <Link
                href="/auth/agent"
                className="font-semibold cursor-pointer text-red-600 hover:underline focus:outline-none">
                Register As Agent
              </Link>
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
            <FormInput
              type="text"
              placeholder="Full Name"
              icon={<UserIcon />}
              value={name}
              onChange={handleNameChange}
              required
            />
            <FormInput
              type="email"
              placeholder="Email Address"
              icon={<MailIcon />}
              value={email}
              onChange={handleEmailChange}
              required
            />
            <FormInput
              type="password"
              placeholder="Password"
              icon={<LockIcon />}
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <FormInput
              type="password"
              placeholder="Confirm Password"
              icon={<LockIcon />}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-3 py-2">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={handleTermsChange}
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

            {error && <p className="text-sm text-center text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <button
              type="submit"
              disabled={loading || !agreeToTerms}
              className="w-full px-4 py-3 text-sm cursor-pointer font-semibold text-white transition-colors bg-red-600 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-6">
            <span className="absolute inset-x-0 h-px bg-gray-200"></span>
            <span className="relative z-10 px-4 text-sm font-medium text-gray-400 bg-white">OR</span>
          </div>

          <div className="space-y-3">
            <SocialButton icon={<GoogleIcon />} text="Sign Up with Google" />
          </div>

          <p className="mt-6 text-sm text-center text-gray-500">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold cursor-pointer text-red-600 hover:underline focus:outline-none">
              Log In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;