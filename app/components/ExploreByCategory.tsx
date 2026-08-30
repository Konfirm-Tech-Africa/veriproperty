"use client";
import { useRouter } from "next/navigation";
import { Home, Building2, MapPin, Building, Crown, Store } from "lucide-react";

const categories = [
  { label: "Houses", icon: Home, propertyType: "House" },
  { label: "Apartments", icon: Building2, propertyType: "Apartment" },
  { label: "Land", icon: MapPin, propertyType: "Land" },
  { label: "Commercial", icon: Store, propertyType: "Commercial" },
  { label: "Luxury", icon: Crown, propertyType: "Luxury" },
  { label: "Short-let", icon: Building, propertyType: "" }, // handled via listingType instead
];

export default function ExploreByCategory() {
  const router = useRouter();

  const handleClick = (label: string, propertyType: string) => {
    if (label === "Short-let") {
      router.push(`/properties/all-properties?listingType=shortlet`);
    } else {
      router.push(`/properties/all-properties?propertyType=${encodeURIComponent(propertyType)}`);
    }
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Explore by Category
          </h2>
          <p className="text-gray-500 mt-2">
            Find exactly the kind of property you&apos;re after.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ label, icon: Icon, propertyType }) => (
            <button
              key={label}
              onClick={() => handleClick(label, propertyType)}
              className="flex flex-col items-center justify-center gap-3 p-6 border border-gray-200 rounded-2xl hover:border-green-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-50 text-green-700">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-800 text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
