// app/dashboard/admin/layout.tsx
"use client";
import React, { useState } from 'react';
import AdminSidebar from '@/app/components/dashboard/Bars/AdminSidebar';
import { VerificationProvider } from '@/app/context/VerificationContext';
import { PropertyProvider } from '@/app/context/PropertyContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [currentPage, setCurrentPage] = useState('Admin Dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <VerificationProvider>
      <PropertyProvider>
        <div className="flex min-h-screen bg-gray-100">
          <AdminSidebar currentPage={currentPage} onNavigate={handleNavigate} />
          <div className="flex-1 flex flex-col">
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </PropertyProvider>
    </VerificationProvider>
  );
}