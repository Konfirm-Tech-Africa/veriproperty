// app/components/dashboard/settings/verification/DocumentUploadForm.tsx
'use client';
import Image from 'next/image';
import React, { useState, useRef } from 'react';

export interface VerificationData {
  idType: 'national_id' | 'passport' | 'drivers_license' | 'voters_card';
  fullName: string;
  idNumber: string;
  documents: File[];
}

interface DocumentUploadFormProps {
  onComplete: (data: VerificationData) => void;
}

const ID_TYPES = [
  { value: 'national_id', label: 'National ID Card' },
  { value: 'passport', label: 'International Passport' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'voters_card', label: "Voter's Card" },
] as const;

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

export default function DocumentUploadForm({ onComplete }: DocumentUploadFormProps) {
  const [formData, setFormData] = useState<Omit<VerificationData, 'documents'>>({
    idType: 'national_id',
    fullName: '',
    idNumber: '',
  });
  
  const [documents, setDocuments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    }

    if (documents.length === 0) {
      newErrors.documents = 'At least one document is required';
    }

    if (documents.length > MAX_FILES) {
      newErrors.documents = `Maximum ${MAX_FILES} documents allowed`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const fileErrors: string[] = [];

    newFiles.forEach((file) => {
      // Check file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        fileErrors.push(`"${file.name}" - Only JPEG, JPG, PNG, and WEBP files are allowed`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        fileErrors.push(`"${file.name}" - File size must be less than 5MB`);
        return;
      }

      // Check total file count
      if (documents.length + validFiles.length >= MAX_FILES) {
        fileErrors.push(`Maximum ${MAX_FILES} documents allowed`);
        return;
      }

      validFiles.push(file);
    });

    if (fileErrors.length > 0) {
      setErrors(prev => ({
        ...prev,
        documents: fileErrors.join(', ')
      }));
    }

    if (validFiles.length > 0) {
      setDocuments(prev => [...prev, ...validFiles]);
      setErrors(prev => ({
        ...prev,
        documents: ''
      }));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // REMOVE the artificial delay - this was causing unnecessary waiting
      // await new Promise(resolve => setTimeout(resolve, 6000));
      
      // Pass data to parent component immediately
      onComplete({
        ...formData,
        documents
      });
    } catch (error) {
      console.error('Error processing documents:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to process documents. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getFilePreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ID Type Selection */}
        <div>
          <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-2">
            Identification Type *
          </label>
          <select
            id="idType"
            name="idType"
            value={formData.idType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {ID_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.idType && (
            <p className="mt-1 text-sm text-red-600">{errors.idType}</p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name (as on document) *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name as it appears on your ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* ID Number */}
        <div>
          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
            ID Number *
          </label>
          <input
            type="text"
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
            placeholder="Enter your ID number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          {errors.idNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>
          )}
        </div>

        {/* Document Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Documents *
          </label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_FILE_TYPES.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Choose Files
                </button>
                <p className="mt-2 text-sm text-gray-600">
                  or drag and drop
                </p>
              </div>
              
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG, WEBP up to 5MB each. Maximum {MAX_FILES} files.
              </p>
            </div>
          </div>

          {errors.documents && (
            <p className="mt-2 text-sm text-red-600">{errors.documents}</p>
          )}

          {/* File Preview */}
          {documents.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Selected Documents ({documents.length}/{MAX_FILES})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((file, index) => (
                  <div key={index} className="relative border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={getFilePreviewUrl(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          width="50"
                          height="50"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="flex-shrink-0 text-red-600 hover:text-red-800"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Requirements */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Verification Requirements
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Documents must be clear and readable</li>
            <li>• All four corners of the ID should be visible</li>
            <li>• Photos must be in color and well-lit</li>
            <li>• File size must not exceed 5MB per document</li>
            <li>• Accepted formats: JPG, JPEG, PNG, WEBP</li>
          </ul>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">          
          <button
            type="submit"
            disabled={isLoading || documents.length === 0}
            className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Submit Verification ${documents.length > 0 ? `(${documents.length})` : ''}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
}