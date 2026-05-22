"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { authService } from '@/app/api/auth';
import { useRouter } from 'next/navigation';
import { ApiErrorResponse, VerifyOtpResponse, ResendOtpResponse } from "@/app/types/auth";
import { useMessageCenter } from "@/app/components/message/MessageCenter";

function EmailVerification() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { showError, showSuccess, showWarning } = useMessageCenter();

  // Get email from sessionStorage on component mount
  useEffect(() => {
    const getStoredEmail = () => {
      try {
        const verificationEmail = sessionStorage.getItem('verificationEmail');
        const loginEmail = sessionStorage.getItem('loginEmail');
        const storedEmail = sessionStorage.getItem('email');
        
        const userEmail = verificationEmail || loginEmail || storedEmail;
        
        if (userEmail) {
          setEmail(userEmail);
        } else {
          showError("No email found. Please try logging in again.");
          setError("No email found. Please try logging in again.");
          console.warn("No email found in storage");
        }
      } catch (err) {
        console.error("Error retrieving email from storage:", err);
        showError("Error retrieving email information.");
        setError("Error retrieving email information.");
      }
    };

    getStoredEmail();
    setCountdown(30);
  }, []);

  // Handle countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (!newOtp[index] && e.currentTarget.previousSibling) {
        (e.currentTarget.previousSibling as HTMLInputElement).focus();
      }
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (!isNaN(Number(pastedData))) {
      const newOtp = pastedData.split('').slice(0, 6);
      const updatedOtp = [...otp];
      newOtp.forEach((char, index) => {
        updatedOtp[index] = char;
      });
      setOtp(updatedOtp);
      
      const inputs = document.querySelectorAll<HTMLInputElement>('.otp-input');
      const focusIndex = Math.min(newOtp.length, 5);
      if (inputs[focusIndex]) {
        inputs[focusIndex].focus();
      }
    }
  };

  // Enhanced error message handler
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      console.log('AxiosError details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        code: error.code
      });

      // Handle timeout specifically
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        showWarning("Request timed out. The server is taking longer than expected to respond. Please try again.");
        return "Request timed out. The server is taking longer than expected to respond. Please try again.";
      }
      
      // Handle network errors
      if (!error.response) {
        showError("Network error. Please check your internet connection and try again.");
        return "Network error. Please check your internet connection and try again.";
      }
      
      const errorData = error.response?.data as ApiErrorResponse | undefined;
      
      // Handle specific HTTP status codes
      switch (error.response.status) {
        case 400:
          showError(errorData?.message || "Invalid OTP or email. Please check and try again.");
          return errorData?.message || "Invalid OTP or email. Please check and try again.";
        case 500:
          showError(errorData?.message || "Server error. Please try again in a few moments.");
          return errorData?.message || "Server error. Please try again in a few moments.";
        case 404:
          showError(errorData?.message || "Verification service not found. Please contact support.");
          return "Verification service not found. Please contact support.";
        default:
          showError(errorData?.message || error.message || "An error occurred. Please try again.")
          return errorData?.message || error.message || "An error occurred. Please try again.";
      }
    }
    
    if (error instanceof Error) {
      showError(error.message)
      return error.message;
    }
    showError("An unexpected error occurred. Please try again.")
    return "An unexpected error occurred. Please try again.";
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      showWarning("Please enter a valid 6-digit OTP");
      return;
    }

    if (!email) {
      showWarning("Email not found. Please try logging in again.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {     
      const response = await authService.verifyOtp(email, otpString) as VerifyOtpResponse;      
      if (response.user || response.success) {
        sessionStorage.removeItem('verificationEmail');
        sessionStorage.removeItem('loginEmail');
        sessionStorage.removeItem('email');
        
        showSuccess("Email verified successfully! You can now login.");
        if (response.success) {
          if (response.user && response.user.role === 'agent' && !response.user.kycVerified) {
            showWarning("Agent KYC not verified. Redirecting to KYC verification.");
            router.push('/dashboard/agent/settings/verification');
            return;
          }
          else {
            router.push('/auth/login');
          }
        }
      }
      else {
        const errorMsg = response.message || "OTP verification failed. Please try again.";
        showError(errorMsg);
        setOtp(["", "", "", "", "", ""]);
        const firstInput = document.querySelector<HTMLInputElement>('.otp-input');
        if (firstInput) firstInput.focus();
      }
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      const errorMessage = getErrorMessage(error);
      
      // Set error state for UI display
      showError(errorMessage)
      setError(errorMessage);

      
      // Don't show alert for server errors to avoid spam
      if (!errorMessage.includes('Server error') && !errorMessage.includes('timed out')) {
        showError(errorMessage);
      }
      
      setOtp(["", "", "", "", "", ""]);
      const firstInput = document.querySelector<HTMLInputElement>('.otp-input');
      if (firstInput) firstInput.focus();
    } finally {
      setLoading(false);
    }
  };

const handleResendOtp = async () => {
  if (countdown > 0 || !email) return;

  setResendLoading(true);
  setError("");
  
  try {   
    const response = await authService.resendOtp(email) as ResendOtpResponse;
       
    if (response.success || response.message === "OTP resent successfully") {
      showSuccess("OTP has been resent to your email.");
      setCountdown(60); 
      // Clear current OTP inputs
      setOtp(["", "", "", "", "", ""]);
      
      // Focus first input
      const firstInput = document.querySelector<HTMLInputElement>('.otp-input');
      if (firstInput) firstInput.focus();
    } else {
      const errorMsg = response.message || "Failed to resend OTP. Please try again.";
      showError(errorMsg);
    }
  } catch (error: unknown) {
    console.error("Resend OTP error:", error);
    const errorMessage = getErrorMessage(error);
    showError(errorMessage)
    setError(errorMessage);
    
    // Show alert for specific errors
    if (errorMessage.includes("Email is already verified")) {
      showWarning("Your email is already verified. Please login instead.");
      router.push('/auth/login');
    } else if (!errorMessage.includes('timed out')) {
      showError(errorMessage)
      showError(errorMessage);
    }
  } finally {
    setResendLoading(false);
  }
};

  const isOtpComplete = otp.join('').length === 6;

  return (
    <section className="flex flex-col md:flex-row min-h-screen">
      <div className="w-full flex flex-col items-center justify-center min-h-screen py-6 md:py-8 px-4 md:px-8">
        <div className="p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#270450] mb-4">
            Verify Your Email
          </h2>
          
          <p className="text-gray-600 mb-2">
            Enter the 6-digit code sent to your email address to verify your account.
          </p>
          
          {error && (
            <div className="text-red-500 font-semibold mb-4 p-3 bg-red-50 rounded-lg">
              {error}
              <div className="text-sm text-gray-600 mt-2">
                If this continues, please try again later or contact support.
              </div>
            </div>
          )}

          <p className="text-gray-800 font-semibold mb-6">
            {email || "Loading email..."}
          </p>

          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                className="otp-input w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-semibold focus:border-[#270450] focus:outline-none transition-colors"
                onChange={(e) => handleOtpChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                onFocus={(e) => e.target.select()}
                disabled={loading || !!error}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOtp}
            disabled={!isOtpComplete || loading || !!error}
            className={`w-full py-3 rounded-lg font-semibold transition mb-6 ${
              !isOtpComplete || loading || error
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-red-800 hover:bg-red-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify Email'
            )}
          </button>

          {/* Resend OTP Section */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Did not receive the code?{" "}
              {countdown > 0 ? (
                <span className="text-gray-500">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading || !!error}
                  className="text-[#270450] font-semibold underline hover:text-[#270450]/80 transition-colors disabled:text-gray-400"
                >
                  {resendLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Resend Code'
                  )}
                </button>
              )}
            </p>

            <Link 
              href="/auth/login"
              className="text-[#270450] font-semibold hover:text-[#270450]/80 transition-colors inline-block mt-4"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmailVerification;