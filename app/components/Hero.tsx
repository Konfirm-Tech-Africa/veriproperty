"use client";
import Image from "next/image";
import React, { useState } from "react";
import FilterModal from "./filters/FilterModal";
import SearchFilterBar from "./filters/SearchFilterBar";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyFilters = (filters: {
    propertyTypes: string[];
    prices: string[];
    bedrooms: string[];
  }) => {
    console.log("Applied Filters:", filters);
    setIsModalOpen(false);
  };

  return (
    <section className="w-full h-screen relative mb-20">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-200">
        <Image 
          src={"/hero-page-img2.jpg"} 
          alt="Modern real estate property" 
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="100vw"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Text Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight sm:leading-snug lg:leading-normal">
              Selling your property?
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-4 sm:mt-6 lg:mt-8 text-white/90">
              Start with the right agent
            </p>
          </div>
        </div>

        {/* Search Filter Bar - Positioned at bottom */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
          <div className="max-w-4xl mx-auto">
            <SearchFilterBar
              onFilterClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyFilters}
      />
    </section>
  );
}