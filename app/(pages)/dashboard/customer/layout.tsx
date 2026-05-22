
"use client";
import React, { useState } from 'react';
import CustomerSidebar from '@/app/components/dashboard/Bars/CustomerSidebar';

interface AgentLayoutProps {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: AgentLayoutProps) {
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <CustomerSidebar currentPage={currentPage} onNavigate={handleNavigate} />
      {/* Add lg:ml-64 to account for sidebar width on desktop */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 overflow-auto mt-20">
          {children}
        </main>
      </div>
    </div>
  );
}