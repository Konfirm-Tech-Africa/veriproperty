"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProjectCard from "@/app/components/property/PropertyCard";
import { Project } from "@/app/components/common/fallbackProjects";
import { ContextProperty } from "./types/property";
import { useProperty } from "@/app/context/PropertyContext";

const convertPropertyToProject = (property: ContextProperty): Project => {
  return {
    id: property._id,
    agentId: property.agentId,
    title: property.title,
    description: property.description,
    price: `₦ ${property.price?.toLocaleString() || '0'}`,
    isNew: property.condition === 'new',
    propertyType: property.propertyType,
    location: {
      address: property.location?.address || '',
      city: property.location?.city || '',
      state: property.location?.state || '',
      country: 'Nigeria'
    },
    features: {
      bedrooms: property.features?.bedrooms,
      bathrooms: property.features?.bathrooms,
      toilets: property.features?.toilets,
      parkingSpaces: property.features?.parkingSpaces,
      size: property.features?.size,
      yearBuilt: property.features?.yearBuilt,
      furnishing: property.features?.furnishing,
      amenities: property.features?.amenities,
      extras: property.features?.extras,
      condition: property.condition
    },
    media: property.media?.images?.map((img) => ({
      url: img.url,
      alt: property.title
    })) || [],
    images: property.media?.images?.map((img) => img.url) || [],
    condition: property.condition
  };
};

export default function ProjectList({ className }: { className?: string }) {
  const [displayProperties, setDisplayProperties] = useState<Project[]>([]);
  const { 
    properties: allProperties, 
    loadingProperties, 
    fetchProperties
  } = useProperty();
  
  const router = useRouter();

  // Fetch all properties on component mount
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Convert properties to Project format when allProperties changes
  useEffect(() => {
    if (allProperties && allProperties.length > 0) {      
      const convertedProperties: Project[] = allProperties.map(convertPropertyToProject);
      setDisplayProperties(convertedProperties);
      
    } else {
      setDisplayProperties([]);
    }
  }, [allProperties]);

  // Show loading state
  if (loadingProperties) {
    return (
      <div className="flex justify-center items-center h-32 sm:h-48">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading properties...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no properties found
  if (!loadingProperties && displayProperties.length === 0) {
    return (
      <div className="flex justify-center items-center h-32 sm:h-48">
        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base mb-2">
            No properties found.
          </p>
          <button
            onClick={() => fetchProperties()}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="w-full px-4 sm:px-6 lg:container lg:mx-auto py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Featured Properties
          </h2>
          <Link
            href="/properties/all-properties"
            className="text-green-600 font-semibold hover:underline text-sm sm:text-base"
          >
            View More &rarr;
          </Link>
        </div>
        
        {/* Properties Grid */}
        <div
          className={`grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className || ''}`}
        >
          {displayProperties.map(property => (
            <div
              key={property.id}
              className="cursor-pointer transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => router.push(`/properties/${property.id}`)}
            >
              <ProjectCard project={property} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}