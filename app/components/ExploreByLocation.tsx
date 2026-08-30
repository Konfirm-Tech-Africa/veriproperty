"use client";
import { useRouter } from "next/navigation";

const locations = [
  "Lekki", "Ajah", "Ikeja", "Abuja",
  "Port Harcourt", "Enugu", "Ibadan", "Asaba",
];

export default function ExploreByLocation() {
  const router = useRouter();

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Explore by Location
          </h2>
          <p className="text-gray-500 mt-2">
            Browse verified listings in Nigeria&apos;s most sought-after cities.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {locations.map((city) => (
            <button
              key={city}
              onClick={() => router.push(`/properties/all-properties?search=${encodeURIComponent(city)}`)}
              className="relative h-32 rounded-2xl overflow-hidden group text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900 group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/20" />
              <span className="absolute bottom-4 left-4 text-white font-semibold text-lg">
                {city}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
