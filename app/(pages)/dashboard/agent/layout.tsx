// app/dashboard/agent/layout.tsx
"use client";
import React, { useState } from 'react';
import AgentSidebar from '@/app/components/dashboard/Bars/AgentSidebar';

interface AgentLayoutProps {
  children: React.ReactNode;
}

export default function AgentLayout({ children }: AgentLayoutProps) {
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AgentSidebar currentPage={currentPage} onNavigate={handleNavigate} />
      {/* Add lg:ml-64 to account for sidebar width on desktop */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <main className="flex-1 overflow-auto md:mt-15 sm:mt-15 lg:mt-0 ">
          {children}
        </main>
      </div>
    </div>
  );
}