"use client";

import Image from "next/image";
import { BedDouble, Bath, Check, Shield, MessageCircle } from "lucide-react";
import { Project, fallbackAgents } from "@/app/components/common/fallbackProjects";
import WhatsAppFloating from "../message/WhatsApp";


// Define the prop types for the component
interface PropertyDetailsProps {
  project: Project;
  onBack: () => void;
  currentUser?: {
    role: 'agent' | 'buy' | 'tenant';
    id?: string;
  };
}

export default function PropertyDetails({ project, onBack, currentUser }: PropertyDetailsProps) {
  const agent = fallbackAgents.find(a => a.agentId === project.agentId);

  // Check user types - Default to buyer/tenant view if no user specified
  const isListingAgent = currentUser?.role === 'agent' && currentUser?.id === project.agentId;
  const isBuyerOrTenant = !currentUser || currentUser?.role === 'buy' || currentUser?.role === 'tenant';

  // Format location for display
  const formatLocation = (location: Project['location']) => {
    if (typeof location === 'string') {
      return location;
    }
    return `${location.city}, ${location.state}, ${location.country}`;
  };

  // Get agent's active features for display
  const getAgentFeatures = () => {
    if (!agent?.subscriptionPlan) return [];
    
    const planFeatures = agent.subscriptionPlan.features;
    const features = [];
    
    if (planFeatures.verifiedBadge) {
      features.push({ key: 'verifiedBadge', label: 'Verified Agent', icon: Shield });
    }
    if (planFeatures.whatsappIntegration) {
      features.push({ key: 'whatsappIntegration', label: 'WhatsApp Business', icon: MessageCircle });
    }
    if (planFeatures.socialMediaAds) {
      features.push({ key: 'socialMediaAds', label: 'Social Media Ads', icon: '📱' });
    }
    if (planFeatures.bannerAds) {
      features.push({ key: 'bannerAds', label: 'Banner Advertising', icon: '🪧' });
    }
    if (planFeatures.areaSpecialist) {
      features.push({ key: 'areaSpecialist', label: 'Area Specialist', icon: '📍' });
    }
    if (planFeatures.advancedAnalytics) {
      features.push({ key: 'advancedAnalytics', label: 'Advanced Analytics', icon: '📊' });
    }
    if (planFeatures.priorityListing) {
      features.push({ key: 'priorityListing', label: 'Priority Listing', icon: '⭐' });
    }
    
    return features;
  };

  const agentFeatures = getAgentFeatures();

  // Filter features based on user type
  const getVisibleFeatures = () => {
    if (isListingAgent) {
      // Agents see all features EXCEPT whatsappIntegration
      return agentFeatures.filter(feature => feature.key !== 'whatsappIntegration');
    } else {
      // Buyers/tenants only see verifiedBadge and whatsappIntegration
      return agentFeatures.filter(feature => 
        feature.key === 'verifiedBadge'
      );
    }
  };

  const visibleFeatures = getVisibleFeatures();

  

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-green-600 hover:text-green-800 transition-colors duration-200 font-medium"
      >
        ← Back to Properties
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Image */}
          <div className="w-full h-80 sm:h-96 md:h-[500px] relative rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={project.images && project.images.length > 0 ? project.images[0] : "/placeholder.jpg"}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Gallery */}
          {project.images && project.images.length > 1 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Property Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-40 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`${project.title} image ${idx + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <p className="text-gray-600 mt-2 text-lg">{formatLocation(project.location)}</p>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <BedDouble className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-semibold text-gray-900">{project.features.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Bath className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-semibold text-gray-900">{project.features.bathrooms}</p>
                </div>
              </div>
              {project.features.parkingSpaces && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🅿️</span>
                  <div>
                    <p className="text-sm text-gray-600">Parking</p>
                    <p className="font-semibold text-gray-900">{project.features.parkingSpaces}</p>
                  </div>
                </div>
              )}
              {project.features.size && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📐</span>
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-semibold text-gray-900">{project.features.size} sqft</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{project.description}</p>
            </div>

            {/* Additional Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Property Details</h3>
              <p className="text-2xl font-bold text-green-600">{project.price}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {project.features.yearBuilt && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🏗️</span>
                    <span>Built {project.features.yearBuilt}</span>
                  </div>
                )}
                {project.features.furnishing && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🛋️</span>
                    <span>Furnishing: {project.features.furnishing}</span>
                  </div>
                )}
                {project.features.condition && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">✅</span>
                    <span>Condition: {project.features.condition}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {project.features.amenities && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(project.features.amenities) 
                    ? project.features.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {amenity}
                        </span>
                      ))
                    : <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {project.features.amenities}
                      </span>
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Price & Agent Info */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="text-center mb-4">
                <p className="text-gray-600 text-2xl color-black text-bold">Price</p>
              <p className="text-2xl font-bold text-green-600">{project.price}</p>
            
            </div>
            
            {/* Contact Options - Show WhatsApp for buyers/tenants */}
            {isBuyerOrTenant && (
              <div className="space-y-3">
                <WhatsAppFloating 
                  id={project.id}
                  project={project}
                />
              </div>
            )}
          </div>

          {/* Agent Info with Features */}
          {agent && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Listing Agent</h3>
                {agent.subscriptionPlan && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {agent.subscriptionPlan.displayName}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={agent.avatar || "/agent-placeholder.jpg"}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                  <p className="text-sm text-gray-600">{agent.agency}</p>
                  <p className="text-xs text-gray-500">{agent.cea}</p>
                  {agent.rating && (
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-sm text-gray-700">⭐ {agent.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Features - Different display based on user type */}
              {visibleFeatures.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    {isListingAgent ? 'Your Plan Features' : ''}
                  </h4>
                  
                  <div className="space-y-2">
                    {visibleFeatures.map((feature) => (
                      <div 
                        key={feature.key}
                        className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg border border-green-100"
                      >
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                          {typeof feature.icon === 'string' ? (
                            <span className="text-lg">{feature.icon}</span>
                          ) : (
                            <feature.icon className="w-4 h-4 text-green-600" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {feature.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Agent-only view: Show private message */}
                  {isListingAgent && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700 text-center">
                        🔒 Private plan overview - Other users see limited features
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}