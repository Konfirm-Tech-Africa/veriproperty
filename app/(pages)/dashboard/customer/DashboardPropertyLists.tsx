"use client";
import React, { useState, useEffect } from 'react';
import DashboardProjectCard from '@/app/components/dashboard/Cards/DashboardPropertyCard';
import PropertyDetails from '@/app/components/dashboard/PropertyDetails';
import { Search } from 'lucide-react';
import { fallbackProjects, Project } from "@/app/components/common/fallbackProjects";

export default function DashboardPropertyLists({ agentId }: { agentId?: string; className?: string }) {
  const [properties, setProperties] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const filteredProperties = agentId 
        ? fallbackProjects.filter(prop => prop.agentId === agentId)
        : fallbackProjects;
      setProperties(filteredProperties);
      setIsLoading(false);
    }, 1000);
  }, [agentId]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Convert Project to be compatible with DashboardProjectCard
  const convertToDashboardProject = (project: Project) => {
    const { agentId, features, ...rest } = project;
    
    // Convert amenities from string[] to string if needed
    const compatibleFeatures = {
      ...features,
      amenities: Array.isArray(features.amenities) 
        ? features.amenities.join(', ') 
        : features.amenities
    };
    
    return {
      ...rest,
      features: compatibleFeatures
    };
  };

  const filteredProperties = properties.filter(prop => {
    const locationString = `${prop.location.address} ${prop.location.city} ${prop.location.state} ${prop.location.country}`;
    
    return (
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locationString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prop.description && prop.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <PropertyDetails
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">ALL PROPERTIES</h1>
      <div className="mb-6 flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((project) => (
            <div
              key={project.id}
              className="cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <DashboardProjectCard
                project={convertToDashboardProject(project)} 
                onEdit={() => console.log("edit")}
                onDelete={() => console.log("delete")}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No properties found.
          </div>
        )}
      </div>
    </div>
  );
}