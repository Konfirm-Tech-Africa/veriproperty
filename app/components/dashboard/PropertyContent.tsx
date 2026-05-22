"use client";
import React from "react";
import DashboardPropertyLists from "@/app/components/dashboard/Cards/DashboardPropertyLists";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";

export default function PropertyContent() {
  const {user} = useUser()
const loggedInAgentId = user?.id && user?.role === "agent" ? user.id : undefined;
  return (
    <div className="flex-1 flex flex-col p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">PROPERTIES</h1>
    {        user?.role === 'agent' && (
          <Link
            href="/dashboard/agent/properties/add"
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-colors duration-200">
            Add New Property
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Property list spans 3/4 */}
        <div className="lg:col-span-4">
          <DashboardPropertyLists landlordId={loggedInAgentId} />
        </div>
      </div>
    </div>
  );
}
