'use client';
import React, { useState } from 'react';

export interface ProfessionalData {
    agency: {
        name?: string;
        licenseNumber?: string;
        address: string;
    }
  cea?: string;
  whatsapp?: string;
}

interface ProfessionalInfoFormProps {
  onSubmit: (data: ProfessionalData) => void;
  isLoading: boolean;
  verificationData?: {
    idType: string;
    fullName: string;
    idNumber: string;
  };
}

export default function ProfessionalInfoForm({ 
  onSubmit, 
  isLoading, 
  verificationData 
}: ProfessionalInfoFormProps) {
  const [formData, setFormData] = useState<ProfessionalData>({
      agency: {
          name: '',
          licenseNumber: '',
          address: '',
      },
    cea: '',
    whatsapp: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};
      
    // CEA License validation (optional but if provided, validate format)
    if (formData.cea && !/^[A-Z0-9]{6,20}$/i.test(formData.cea)) {
      newErrors.cea = 'Please enter a valid CEA license number';
    }

    // WhatsApp validation (optional but if provided, validate format)
    if (formData.whatsapp && !/^\+?[\d\s-()]{10,}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Please enter a valid WhatsApp number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Verification Summary */}
      {verificationData && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-2">Identity Verified</h3>
          <p className="text-sm text-green-700">
            <strong>Name:</strong> {verificationData.fullName} • 
            <strong> ID Type:</strong> {verificationData.idType.replace('_', ' ').toUpperCase()} • 
            <strong> ID Number:</strong> {verificationData.idNumber}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Agency Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 mb-2">
              Agency Name (Optional)
            </label>
            <input
              type="text"
              id="agencyName"
              name="agencyName"
              value={formData.agency.name}
              onChange={handleInputChange}
              placeholder="Enter your agency name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
              License Number (Optional)
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.agency.licenseNumber}
              onChange={handleInputChange}
              placeholder="Enter your professional license number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* CEA License */}
        <div>
          <label htmlFor="cea" className="block text-sm font-medium text-gray-700 mb-2">
            CEA License Number (Optional)
          </label>
          <input
            type="text"
            id="cea"
            name="cea"
            value={formData.cea}
            onChange={handleInputChange}
            placeholder="Enter your CEA license number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {errors.cea && (
            <p className="mt-1 text-sm text-red-600">{errors.cea}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Council for Estate Agencies license number (if applicable)
          </p>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Professional Address *
          </label>
          <input
            id="address"
            name="address"
            value={formData.agency.address}
            onChange={handleInputChange}
            placeholder="Enter your real estate agent adress"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-vertical"
          />
        </div>

        {/* WhatsApp Contact */}
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Number (Optional)
          </label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {errors.whatsapp && (
            <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Include country code. This will be visible to potential clients.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Tips for a Great Profile
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Be specific about your areas of expertise and locations you serve</li>
            <li>• Highlight your achievements and certifications</li>
            <li>• Mention your approach to client service</li>
            <li>• Include languages you speak if multilingual</li>
            <li>• Keep your bio professional but approachable</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Verification...
              </span>
            ) : (
              'Submit Verification'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}