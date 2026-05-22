"use client";
import React from "react";
import Image from "next/image";
import { BedDouble, Bath, Car, Ruler, Calendar, Sofa } from "lucide-react";

// Assuming PropertyForm fields:
interface Media {
  url: string;
  alt?: string;
}
interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
}
interface Features {
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parkingSpaces?: number;
  size?: number;
  yearBuilt?: number;
  furnishing?: string;
  amenities?: string;
  extras?: string;
}

interface DashboardPropertyCardProps {
  project: {
    id: string;
    media?: Media[];
    title: string;
    location: Location;
    price: string;
    isNew: boolean;
    propertyType: string;
    features: Features;
    description?: string;
    condition?: string;
  };
  onEdit: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export default function DashboardPropertyCard({
  project,
}: DashboardPropertyCardProps) {
  const { features, location } = project;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 relative">
      {/* Image */}
      <div className="relative w-full h-40">
        <Image
          src={
            project.media && project.media.length > 0
              ? project.media[0].url
              : "/placeholder.jpg"
          }
          alt={project.media && project.media.length > 0
            ? project.media[0].alt || project.title
            : project.title}
          fill
          className="object-cover"
          unoptimized={true}
        />
        {project.isNew && (
          <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            NEW property
          </span>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Title & Location */}
        <h3 className="text-base font-semibold text-gray-900">{project.title}</h3>
        <p className="text-xs text-gray-500">
          {location?.city}, {location?.state}, {location?.country}
        </p>
        {/* Property Type & Condition */}
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
          <span className="bg-gray-100 px-2 py-1 rounded">{project.propertyType}</span>
          {project.condition && (
            <span className="bg-gray-100 px-2 py-1 rounded">{project.condition}</span>
          )}
        </div>
        {/* Features */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-gray-500 text-xs">
          {features?.bedrooms !== undefined && (
            <span className="flex items-center">
              <BedDouble className="w-3 h-3 mr-1" />
              {features.bedrooms} Beds
            </span>
          )}
          {features?.bathrooms !== undefined && (
            <span className="flex items-center">
              <Bath className="w-3 h-3 mr-1" />
              {features.bathrooms} Baths
            </span>
          )}
          {features?.toilets !== undefined && (
            <span className="flex items-center">
              <Bath className="w-3 h-3 mr-1" />
              {features.toilets} Toilets
            </span>
          )}
          {features?.parkingSpaces !== undefined && (
            <span className="flex items-center">
              <Car className="w-3 h-3 mr-1" />
              {features.parkingSpaces} Parking
            </span>
          )}
          {features?.size !== undefined && (
            <span className="flex items-center">
              <Ruler className="w-3 h-3 mr-1" />
              {features.size} m²
            </span>
          )}
          {features?.yearBuilt !== undefined && (
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {features.yearBuilt}
            </span>
          )}
          {features?.furnishing && (
            <span className="flex items-center">
              <Sofa className="w-3 h-3 mr-1" />
              {features.furnishing}
            </span>
          )}
          {features?.amenities && (
            <span className="flex items-center">
              <Bath className="w-3 h-3 mr-1" />
              {features.amenities}
            </span>
          )}
          {features?.extras && (
            <span className="flex items-center">
              <Bath className="w-3 h-3 mr-1" />
              {features.extras}
            </span>
          )}
        </div>
        {/* Description */}
        <div className="mt-2 text-gray-700 text-sm line-clamp-2">
          {project.description}
        </div>
        {/* Price + Actions */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-red-600">
            {project.price}
          </span>
        </div>
      </div>
    </div>
  );
}
