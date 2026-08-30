"use client";
import { useRouter } from "next/navigation";
import { Home, Building2, MapPin, TrendingUp } from "lucide-react";

const options = [
  {
    label: "Buy Property",
    description: "Looking for a home to purchase.",
    icon: Home,
    params: "listingType=sale",
  },
  {
    label: "Rent Property",
    description: "Find apartments, houses and offices for rent.",
    icon: Building2,
    params: "listingType=rent",
  },
  {
    label: "Buy Land",
    description: "Discover verified land listings.",
    icon: MapPin,
    params: "propertyType=Land",
  },
  {
    label: "Invest",
    description: "Explore investment opportunities and high-potential properties.",
    icon: TrendingUp,
    params: "propertyType=Investment",
  },
];

export default function WhatBringsYouHere() {
  const router = useRouter();

  return (
    <section className="w-full pt-32 lg:pt-40 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            What Brings You Here Today?
          </h2>
          <p className="text-gray-500 mt-2">
            Tell us what you need, and we&apos;ll take it from there.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map(({ label, description, icon: Icon, params }) => (
            <button
              key={label}
              onClick={() => router.push(`/properties/all-properties?${params}`)}
              className="flex flex-col items-start text-left p-6 border border-gray-200 rounded-2xl hover:border-green-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-50 text-green-700 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
