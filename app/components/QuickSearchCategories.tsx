"use client";
import { useRouter } from "next/navigation";
import { Home, Building2, MapPin, Store, Clock } from "lucide-react";

const categories = [
  { label: "Buy", icon: Home, params: "listingType=sale" },
  { label: "Rent", icon: Clock, params: "listingType=rent" },
  { label: "Land", icon: MapPin, params: "propertyType=Land" },
  { label: "Commercial", icon: Store, params: "propertyType=Commercial" },
  { label: "Short-let", icon: Building2, params: "listingType=shortlet" },
];

export default function QuickSearchCategories() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {categories.map(({ label, icon: Icon, params }) => (
        <button
          key={label}
          onClick={() => router.push(`/properties/all-properties?${params}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full transition-colors backdrop-blur-sm text-sm sm:text-base"
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}