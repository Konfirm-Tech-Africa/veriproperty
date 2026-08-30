"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PropertyDetails from "@/app/components/dashboard/PropertyDetails";
import { Project } from "@/app/components/common/fallbackProjects";
import { Navbar } from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { useProperty } from "@/app/context/PropertyContext";
import { ContextProperty } from "@/app/components/property/types/property";

const convertPropertyToProject = (property: ContextProperty): Project => {
  return {
    id: property._id,
    agentId: property.agentId,
    title: property.title,
    description: property.description,
    price: `₦ ${property.price?.toLocaleString() || '0'}`,
    priceValue: property.price || 0,
    listingType: property.listingType || 'sale',
    createdAt: property.createdAt ? new Date(property.createdAt).toISOString() : undefined,
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

export default function PropertyDetailsPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const { properties, fetchProperties, loadingProperties } = useProperty();
  const params = useParams();
  const id = params?.id as string;

  // Fetch properties if not already loaded
  useEffect(() => {
    if (properties.length === 0 && !loadingProperties) {
      fetchProperties();
    }
  }, [properties.length, loadingProperties, fetchProperties]);

  // Find the project from context properties
  useEffect(() => {
    if (!id) {
      setError("Property ID not found");
      setLoading(false);
      return;
    }

    if (properties.length > 0) {
      console.log('🔍 Searching for property in context:', id);
      
      // Find the property in context properties
      const contextProperty = properties.find((p: ContextProperty) => p._id === id);
      
      if (contextProperty) {
        console.log('✅ Property found in context, converting to Project format');
        const convertedProject = convertPropertyToProject(contextProperty);
        setProject(convertedProject);
        setError(null);
      } else {
        console.log('❌ Property not found in context properties');
        setError("Property not found");
      }
      setLoading(false);
    } else if (!loadingProperties) {
      // Properties are loaded but empty, or failed to load
      setError("No properties available");
      setLoading(false);
    }
  }, [properties, id, loadingProperties]);

  const handleBack = () => {
    router.back();
  };

  // Show loading state
  if (loading || loadingProperties) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show error state
  if (error || !project) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4 text-lg">
              {error || "Property not found"}
            </p>
            <div className="space-x-4">
              <button
                onClick={handleBack}
                className="text-red-600 hover:text-red-800 text-sm font-medium border border-red-600 px-4 py-2 rounded"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.reload()}
                className="text-white bg-red-600 hover:bg-red-700 text-sm font-medium px-4 py-2 rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PropertyDetails
        project={project}
        onBack={handleBack}
      />
      <Footer />
    </>
  );
}