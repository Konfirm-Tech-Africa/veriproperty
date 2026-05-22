"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import ScrollableCheckboxList from "./ScrollableCheckboxList";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    propertyTypes: string[];
    prices: string[];
    bedrooms: string[];
  }) => void;
}

const propertySubtypeOptions: Record<string, string[]> = {
  All: ["Select All", "Office", "Retail", "Warehouse"],
  HDB: [
    "Select All",
    "1-Room / Studio",
    "2I (Improved)",
    "2-Room Flexi",
    "3NG (New Generation)",
    "3NG (Modified)",
    "3I (Modified)",
    "3STD (Standard)",
    "2A",
    "2S (Standard)",
    "3A",
    "3I (Improved)",
    "3S (Simplified)",
    "3PA (3 Room Premium Apartment)",
    "2-Room Flexi",
    "3A (Modified)",
  ],
  Condo: ["Select All", "Studio", "1-Bedroom", "2-Bedroom", "Penthouse"],
  Landed: ["Select All", "Terrace", "Semi-Detached", "Bungalow"],
};

const bedroomOptions = ["Select All", "1 Bed", "2 Bed", "3 Bed", "4 Bed", "5+"];

const priceOptions = [
  "No Min",
  "200,000",
  "300,000",
  "400,000",
  "500,000",
  "600,000",
  "700,000",
  "800,000",
  "900,000",
  "1,000,000+",
];

const PropertyTypeTab = ({
  selected,
  onSelect,
}: {
  selected: string[];
  onSelect: (type: string) => void;
}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const options = propertySubtypeOptions[activeCategory] || [];

  return (
    <div className="mt-4">
      {/* Scrollable category tabs */}
      <div className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-hide -mx-1 px-1">
        {Object.keys(propertySubtypeOptions).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-2 rounded-full border font-medium text-sm whitespace-nowrap flex-shrink-0 ${
              activeCategory === cat
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scrollable checkbox list */}
      <div className="max-h-[45vh] overflow-y-auto">
        <ScrollableCheckboxList
          options={options}
          selected={selected}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
};

const PriceTab = ({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
}: {
  minPrice: string;
  maxPrice: string;
  onMinChange: (price: string) => void;
  onMaxChange: (price: string) => void;
}) => (
  <div className="flex flex-col gap-4 mt-4">
    {/* Min Price */}
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Min Price
      </label>
      <select
        value={minPrice}
        onChange={(e) => onMinChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
      >
        {priceOptions.map((price) => (
          <option key={price} value={price}>
            {price}
          </option>
        ))}
      </select>
    </div>

    {/* Max Price */}
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Max Price
      </label>
      <select
        value={maxPrice}
        onChange={(e) => onMaxChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
      >
        {priceOptions.map((price) => (
          <option key={price} value={price}>
            {price}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const BedroomTab = ({
  selected,
  onSelect,
}: {
  selected: string[];
  onSelect: (beds: string) => void;
}) => (
  <div className="mt-4 max-h-[45vh] overflow-y-auto">
    <ScrollableCheckboxList
      options={bedroomOptions}
      selected={selected}
      onSelect={onSelect}
    />
  </div>
);

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
}: FilterModalProps) {
  const [activeTab, setActiveTab] = useState("Property Type");
  const [propertyTypesSelected, setPropertyTypesSelected] = useState<string[]>([]);
  const [bedroomsSelected, setBedroomsSelected] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("No Min");
  const [maxPrice, setMaxPrice] = useState("1,000,000+");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handlePropertyTypeSelect = (type: string) => {
    setPropertyTypesSelected((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleBedroomSelect = (beds: string) => {
    setBedroomsSelected((prev) =>
      prev.includes(beds) ? prev.filter((b) => b !== beds) : [...prev, beds]
    );
  };

  const handleClear = () => {
    setPropertyTypesSelected([]);
    setBedroomsSelected([]);
    setMinPrice("No Min");
    setMaxPrice("1,000,000+");
  };

  const handleApply = () => {
    onApply({
      propertyTypes: propertyTypesSelected,
      prices: [minPrice, maxPrice],
      bedrooms: bedroomsSelected,
    });
    onClose();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Property Type":
        return (
          <PropertyTypeTab
            selected={propertyTypesSelected}
            onSelect={handlePropertyTypeSelect}
          />
        );
      case "Price":
        return (
          <PriceTab
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinChange={setMinPrice}
            onMaxChange={setMaxPrice}
          />
        );
      case "Bedroom":
        return (
          <BedroomTab
            selected={bedroomsSelected}
            onSelect={handleBedroomSelect}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-modal-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 mt-20 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white rounded-2xl w-full max-w-md h-[85vh] shadow-xl transform transition-all duration-300 flex flex-col ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-4 bg-black rounded-t-2xl">
          <h2
            id="filter-modal-title"
            className="text-xl font-bold text-white"
          >
            Filters
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          className="flex mt-4 overflow-x-auto px-4 scrollbar-hide"
        >
          {["Property Type", "Price", "Bedroom"].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`flex-shrink-0 px-4 py-3 text-base font-semibold border-b-2 transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 px-4">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-4 py-4 bg-white">
          <button
            onClick={handleClear}
            className="flex-1 py-3 text-base font-semibold rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 text-base font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}