"use client";
import React from "react";
import DashboardPropertyLists from "@/app/components/dashboard/Cards/DashboardPropertyLists";
import { useUser } from "@/app/context/UserContext";

export default function RentPropertyContent() {
  const { user } = useUser();
  const loggedInAgentId = user?.id && user?.role === "agent" ? user.id : undefined;

  return (
    <div className="flex-1 flex flex-col p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">PROPERTIES FOR RENT</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Property list spans full width */}
        <div className="lg:col-span-4">
          <DashboardPropertyLists 
            landlordId={loggedInAgentId} 
            listingType="rent" 
          />
        </div>
      </div>
    </div>
  );
}