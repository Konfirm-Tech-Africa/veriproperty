"use client";
import React from "react";
import Image from "next/image";
import { BedDouble, Bath } from "lucide-react";
import { Project } from "@/app/components/common/fallbackProjects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { features, location, agent } = project;

  return (
<div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col">
  {/* Image */}
  <div className="relative w-full h-48 sm:h-52 md:h-64">
    <Image
      src={
        project.media && project.media.length > 0
          ? project.media[0].url
          : "/placeholder.jpg"
      }
      alt={project.title}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover"
      unoptimized
    />
    {project.isNew && (
      <span className="absolute bottom-3 left-3 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
        NEW property
      </span>
    )}
  </div>

  {/* Info */}
  <div className="p-3 sm:p-4 flex flex-col flex-grow">
    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
      {project.title}
    </h3>
    <p className="mt-1 text-xs sm:text-sm text-gray-500 leading-tight">
      {location.address}, {location.city}, {location.state}, {location.country}
    </p>

    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
      <p className="text-lg sm:text-xl font-bold text-gray-900">
        {project.price}
      </p>

      {features.bedrooms && features.bathrooms && (
        <div className="flex items-center space-x-3 text-gray-500 text-xs sm:text-sm">
          <span className="flex items-center">
            <BedDouble className="w-4 h-4 mr-1" />
            {features.bedrooms}
          </span>
          <span className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {features.bathrooms}
          </span>
        </div>
      )}
    </div>

    <span className="mt-3 inline-block bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium px-3 py-1 rounded-full self-start">
      {project.propertyType}
    </span>

    {/* Agent section */}
    {agent && (
      <div className="mt-4 flex w-full items-center gap-3 bg-green-100 pt-3 px-4 py-4 rounded-b-2xl">
        <Image
          src={agent.avatar || "/placeholder-avatar.png"}
          alt={agent.name}
          width={36}
          height={36}
          className="rounded-full border flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
            {agent.name}
          </p>
          <p className="text-[11px] sm:text-xs text-gray-500 truncate">
            {agent.agency}
          </p>
        </div>
      </div>
    )}
  </div>
</div>
  );
}