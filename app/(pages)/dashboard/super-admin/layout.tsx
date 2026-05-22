"use client";
import React, { useState } from 'react';
import { VerificationProvider } from '@/app/context/VerificationContext';
import { PropertyProvider } from '@/app/context/PropertyContext';
import SuperAdminSidebar from '@/app/components/dashboard/Bars/SuperAdminSidebar';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const [currentPage, setCurrentPage] = useState('Admin Dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <VerificationProvider>
      <PropertyProvider>
        <div className="flex min-h-screen bg-gray-100">
          <SuperAdminSidebar currentPage={currentPage} onNavigate={handleNavigate} />
          <div className="flex-1 flex flex-col lg:ml-64">
            <main className="flex-1 overflow-auto mt-15">
              {children}
            </main>
          </div>
        </div>
      </PropertyProvider>
    </VerificationProvider>
  );
}