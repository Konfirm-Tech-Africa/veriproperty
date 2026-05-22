"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Phone, Send } from "lucide-react";
import { useUser } from "@/app/context/UserContext"; 
import WhatsAppIcon from "@/public/whatsapp-icon.png";

interface WhatsAppFloatingProps {
  id: string;
  project: { title: string };
  agentId?: string;
}

export default function WhatsAppFloating({ id, project }: WhatsAppFloatingProps) {
  const [expanded, setExpanded] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const { user, isAuthenticated, loading } = useUser();

  // If loading, show nothing or a loading state
  if (loading) {
    return (
      <div className="fixed bottom-6 right-6 w-[300px] bg-white shadow-lg rounded-xl border border-gray-200 p-4 z-50 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated/not an agent, don't show the component
  if (!isAuthenticated || !user) {
    return (
      <div className="fixed bottom-6 right-6 w-[300px] bg-white shadow-lg rounded-xl border border-gray-200 p-4 z-50">
        <p className="text-center text-gray-900 font-semibold">
          Please log in to see the contact details of the listing agent.
        </p>
      </div>
    );
  }

  // Extract agent data from user context
  const agentData = {
    name: user?.name || "Agent",
    agency: user.agency?.name || 
            user.professionalData?.agency?.name || 
            "Independent Agent",
    cea: user.cea || 
         user.agency?.licenseNumber || 
         "CEA: Pending",
    whatsapp: user.whatsapp || "+234 806 704 2140",
    avatar: user?.avatar || "/placeholder-avatar.png",
    phone: user?.whatsapp || "+234 806 704 2140",
    email: user?.email || "info@propertygurunigeria.com",
  };

  // Clean phone number for WhatsApp link
  const cleanPhone = agentData.whatsapp.replace(/\D/g, "");
  
  // Prepare personalized message
  const baseMessage = `Hi ${encodeURIComponent(agentData.name)}, I am interested in your property "${project.title}". Please provide more details.`;
  
  // Create WhatsApp URLs
  const whatsappWebUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(baseMessage)}`;
  const whatsappMobileUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(baseMessage)}`;
  
  // Create email link
  const enquiryMailto = `mailto:${agentData.email}?subject=Property%20Enquiry&body=Hello%20${encodeURIComponent(
    agentData.name
  )},%20I%20would%20like%20to%20know%20more%20about%20your%20listing.`;

  return (
    <div className="fixed bottom-6 right-6 w-[300px] bg-white shadow-lg rounded-xl border border-gray-200 p-4 z-50">
      {/* Agent Info */}
      <div className="flex items-center space-x-3">
        <div className="relative w-12 h-12">
          <Image
            src={agentData.avatar}
            alt={agentData.name}
            fill
            className="rounded-full border object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{agentData.name}</h3>
          <p className="text-sm text-gray-600">{agentData.agency}</p>
          <p className="text-xs text-gray-500">{agentData.cea}</p>
            <span className="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full mt-1">
              ✓ Verified Agent
            </span>
        </div>
      </div>

      {/* WhatsApp Web Button */}
      <a
        href={whatsappWebUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
      >
        <Image
          src={WhatsAppIcon}
          alt="WhatsApp"
          width={20}
          height={20}
          className="mr-2"
        />
        WhatsApp Web
      </a>

      {/* Toggle More Options */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 w-full text-sm text-gray-700 flex items-center justify-between hover:text-gray-900 transition-colors"
      >
        Other ways to enquire
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded Options */}
      {expanded && (
        <div className="mt-3 space-y-2 pt-3">
          {/* WhatsApp Mobile */}
          <a
            href={whatsappMobileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition-all"
          >
            <Image
              src={WhatsAppIcon}
              alt="WhatsApp"
              width={18}
              height={18}
              className="mr-2"
            />
            WhatsApp Mobile
          </a>

          {/* Send Enquiry */}
          <a
            href={enquiryMailto}
            className="flex items-center justify-center border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition-all"
          >
            <Send className="w-4 h-4 mr-2 text-gray-600" />
            Send Enquiry
          </a>

          {/* View Phone Number */}
          <div>
            <button
              onClick={() => setShowPhone(!showPhone)}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition-all"
            >
              <Phone className="w-4 h-4 mr-2 text-gray-600" />
              {showPhone ? "Hide Phone Number" : "View Phone Number"}
            </button>

            {showPhone && (
              <p className="mt-2 text-center text-gray-900 font-semibold">{agentData.phone}</p>
            )}
          </div>
        </div>
      )}

      {/* Property ID indicator (optional) */}
      {id && (
        <div className="mt-3 pt-3 text-center">
          <p className="text-xs text-gray-500">
            Property ID: <span className="font-mono">{id}</span>
          </p>
        </div>
      )}
    </div>
  );
}