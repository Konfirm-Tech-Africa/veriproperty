"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Image as ImageIcon, Video, MapPin, Search } from "lucide-react";
import type { PropertyListingPayload } from "../property/types/property";
import { useProperty } from "@/app/context/PropertyContext";
import { useSubscription } from "@/app/context/SubscriptionContext";
import Image from "next/image";
import { useMessageCenter } from "../message/MessageCenter";

// File size and count limits for client-side validation
const MAX_IMAGE_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 50;
const MAX_IMAGES = 10;
const MAX_VIDEOS = 1;

// Define proper types for the form that match your PropertyListingPayload
interface PropertyFormData {
  title: string;
  description: string;
  listingType: "sale" | "rent" | "shortlet";
  price: number;
  currency: "USD" | "NGN";
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    coordinate: {
      lat: number;
      lon: number;
    };
  };
  media: {
    images: string[];
    videos: string[];
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    parkingSpaces: number;
    size: number;
    yearBuilt: number;
    furnishing: string;
    amenities: string;
    extras: string;
    condition: string;
  };
  contact: string;
  ownership: "owner" | "agent" | "helper";
  propertyType: string;
  status: "available" | "negotiation" | "rented" | "unavailable";
  condition: "new" | "old" | "renovated";
}

// Geocoding service using OpenStreetMap Nominatim API
const geocodeAddress = async (address: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Address Autocomplete Component
const AddressAutocomplete: React.FC<{
  address: string;
  onAddressChange: (address: string) => void;
  onCoordinatesFound: (coords: { lat: number; lon: number }) => void;
}> = ({ address, onAddressChange, onCoordinatesFound }) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

  const handleGeocode = async () => {
    if (!address.trim()) {
      setGeocodeError("Please enter an address first");
      return;
    }

    setIsGeocoding(true);
    setGeocodeError("");

    try {
      const coords = await geocodeAddress(address);
      
      if (coords) {
        onCoordinatesFound(coords);
        setGeocodeError("");
      } else {
        setGeocodeError("Could not find coordinates for this address. Please try a more specific address.");
      }
    } catch (error) {
      setGeocodeError("Geocoding service error. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    if (address.trim().length > 10) {
      const timer = setTimeout(() => {
        handleGeocode();
      }, 1000); // 1 second debounce

      return () => clearTimeout(timer);
    }
  }, [address]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Enter full property address"
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          type="button"
          onClick={handleGeocode}
          disabled={isGeocoding || !address.trim()}
          className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={16} />
          {isGeocoding ? "Finding..." : "Locate"}
        </button>
      </div>
      
      {geocodeError && (
        <p className="text-red-500 text-sm">{geocodeError}</p>
      )}
    </div>
  );
};

// Coordinate Display Component
const CoordinateDisplay: React.FC<{
  coordinates: { lat: number; lon: number };
}> = ({ coordinates }) => {
  if (coordinates.lat === 0 && coordinates.lon === 0) {
    return (
      <div className="text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
        <p className="text-sm">📍 Enter address above to automatically get coordinates</p>
      </div>
    );
  }

  return (
    <div className="text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
      <p className="text-sm font-medium">✅ Location coordinates found:</p>
      <div className="grid grid-cols-2 gap-4 mt-2 text-xs">
        <div>
          <span className="font-medium">Latitude:</span>
          <p>{coordinates.lat.toFixed(6)}</p>
        </div>
        <div>
          <span className="font-medium">Longitude:</span>
          <p>{coordinates.lon.toFixed(6)}</p>
        </div>
      </div>
    </div>
  );
};

export default function PropertyForm() {
  // Use PropertyContext - now we have access to listNewProperty and usageData
  const { 
    listNewProperty, 
    loadingListNew, 
    error: propertyError,
    clearError 
  } = useProperty();
  
  const { fetchUsage, usageData } = useSubscription();

  // State to manage all form inputs with proper typing
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    listingType: "sale" as "sale" | "rent" | "shortlet",
    price: 0,
    currency: "NGN",
    location: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      coordinate: {
        lat: 0,
        lon: 0,
      },
    },
    media: {
      images: [],
      videos: [],
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      toilets: 0,
      parkingSpaces: 0,
      size: 0,
      yearBuilt: 0,
      furnishing: "",
      amenities: "",
      extras: "",
      condition: "",
    },
    contact: "",
    ownership: "owner",
    propertyType: "",
    status: "available",
    condition: "new",
  });

  // State for managing uploaded images and videos
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [fileError, setFileError] = useState("");
  const [dragOverImage, setDragOverImage] = useState(false);
  const [dragOverVideo, setDragOverVideo] = useState(false);
  const [hasValidCoordinates, setHasValidCoordinates] = useState(false);
  const { showError, showSuccess } = useMessageCenter();

  useEffect(() => {
    fetchUsage();
  }, []);

  // Clear property context errors when component unmounts or on successful submission
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Handle address changes
  const handleAddressChange = (address: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        address
      }
    }));
  };

  // Handle coordinate changes from geocoding
  const handleCoordinatesFound = (coords: { lat: number; lon: number }) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        coordinate: coords
      }
    }));
    setHasValidCoordinates(true);
  };

  // Use current location as fallback
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          handleCoordinatesFound(coords);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setFileError("Could not get current location. Please enter the address manually.");
        }
      );
    } else {
      setFileError("Geolocation is not supported by this browser. Please enter the address manually.");
    }
  };

  // Generic handler for all text and select inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    
    // Handle enum-like fields with type assertions
    if (name === "listingType") {
      setFormData(prev => ({
        ...prev,
        listingType: value as "sale" | "rent" | "shortlet"
      }));
      return;
    }
    
    if (name === "currency") {
      setFormData(prev => ({
        ...prev,
        currency: value as "USD" | "NGN"
      }));
      return;
    }
    
    if (name === "ownership") {
      setFormData(prev => ({
        ...prev,
        ownership: value as "owner" | "agent" | "helper"
      }));
      return;
    }
    
    if (name === "status") {
      setFormData(prev => ({
        ...prev,
        status: value as "available" | "negotiation" | "rented" | "unavailable"
      }));
      return;
    }
    
    if (name === "condition") {
      setFormData(prev => ({
        ...prev,
        condition: value as "new" | "old" | "renovated"
      }));
      return;
    }
    
    // For features fields, handle nested update
    if (
      [
        "bedrooms",
        "bathrooms",
        "toilets",
        "parkingSpaces",
        "size",
        "yearBuilt",
        "furnishing",
        "amenities",
        "extras",
        "condition",
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: name === "bedrooms" || name === "bathrooms" || name === "toilets" || name === "parkingSpaces" || name === "size" || name === "yearBuilt"
            ? Number(value)
            : value,
        },
      }));
    } else if (
      ["city", "state", "postalCode"].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, isImage: boolean): void => {
    e.preventDefault();
    if (isImage) {
      setDragOverImage(true);
    } else {
      setDragOverVideo(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, isImage: boolean): void => {
    e.preventDefault();
    if (isImage) {
      setDragOverImage(false);
    } else {
      setDragOverVideo(false);
    }
  };

  const handleDrop = (e: React.DragEvent, isImage: boolean): void => {
    e.preventDefault();
    if (isImage) {
      setDragOverImage(false);
    } else {
      setDragOverVideo(false);
    }
    const files = e.dataTransfer.files;
    handleFiles(files, isImage);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isImage: boolean): void => {
    const files = e.target.files;
    handleFiles(files, isImage);
    e.target.value = '';
  };

  const handleFiles = (files: FileList | null, isImage: boolean): void => {
    if (!files || files.length === 0) return;
    setFileError("");

    const maxCount = isImage ? MAX_IMAGES : MAX_VIDEOS;
    const maxSizeMB = isImage ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB;
    const setFiles = isImage ? setImages : setVideos;
    const setPreviews = isImage ? setImagePreviews : setVideoPreviews;
    const currentFiles = isImage ? images : videos;

    // Check file count
    if (currentFiles.length + files.length > maxCount) {
      setFileError(`You can only upload a maximum of ${maxCount} ${isImage ? 'images' : 'videos'}.`);
      return;
    }

    // Check file sizes
    const filesArray = Array.from(files);
    for (const file of filesArray) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        setFileError(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB.`);
        return;
      }
    }

    // Create previews
    const newPreviews = filesArray.map(file => URL.createObjectURL(file));

    // Add files to state
    setFiles((prev) => [...prev, ...filesArray]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index: number, isImage: boolean): void => {
    const setFiles = isImage ? setImages : setVideos;
    const setPreviews = isImage ? setImagePreviews : setVideoPreviews;
    
    setFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    
    setPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  // Convert FormData to PropertyListingPayload for the context
  const preparePayload = (): PropertyListingPayload => {
    return {
      title: formData.title,
      description: formData.description,
      listingType: formData.listingType,
      price: formData.price ? Number(formData.price) : 0,
      currency: formData.currency,
      location: formData.location,
      features: formData.features,
      contact: formData.contact,
      ownership: formData.ownership,
      propertyType: formData.propertyType,
      status: formData.status,
      condition: formData.condition,
      media: formData.media
    };
  };

  // Enhanced handleSubmit with context integration
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFileError("");
    setShowSubmissionSuccess(false);
    clearError();

    // Validate form data
    if (!formData.title || !formData.description || !formData.listingType) {
      setFileError("Please fill in all required fields.");
      return;
    }

    // Validate address
    if (!formData.location.address.trim()) {
      setFileError("Please enter a property address.");
      return;
    }

    // Validate coordinates
    if (formData.location.coordinate.lat === 0 || formData.location.coordinate.lon === 0) {
      setFileError("Please wait for the address to be located, or use the current location button.");
      return;
    }

    // Validate that at least one image is provided
    if (images.length === 0) {
      setFileError("At least one image is required for property listing.");
      return;
    }

    try {
      const payload = preparePayload();

      const result = await listNewProperty(payload, images, videos);

      if (result.success) {
        setShowSubmissionSuccess(true);
        showSuccess("Property listed successfully!");
        
        // Refresh usage data
        await fetchUsage();

        // Reset form on successful submission
        setFormData({
          title: "",
          description: "",
          listingType: "sale" as "sale" | "rent" | "shortlet",
          price: 0,
          currency: "NGN",
          location: {
            address: "",
            city: "",
            state: "",
            postalCode: "",
            coordinate: {
              lat: 0,
              lon: 0,
            },
          },
          media: {
            images: [],
            videos: [],
          },
          features: {
            bedrooms: 0,
            bathrooms: 0,
            toilets: 0,
            parkingSpaces: 0,
            size: 0,
            yearBuilt: 0,
            furnishing: "",
            amenities: "",
            extras: "",
            condition: "",
          },
          contact: "",
          ownership: "owner",
          propertyType: "",
          status: "available",
          condition: "new",
        });
        
        // Clear files and previews
        setImages([]);
        setVideos([]);
        
        // Revoke all preview URLs
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        videoPreviews.forEach(url => URL.revokeObjectURL(url));
        setImagePreviews([]);
        setVideoPreviews([]);
        setHasValidCoordinates(false);
      }
    } catch (error) {
      // Error is already handled by the context
      console.error("Submission error:", error);
    }
  };

  // Render file previews
  const renderFilePreviews = (previews: string[], files: File[], isImage: boolean) => (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {previews.map((preview, index) => (
        <div key={index} className="relative rounded-lg overflow-hidden border border-gray-200">
          {isImage ? (
            <Image
              src={preview}
              alt={`Preview of ${files[index]?.name || 'property image'}`}
              className="w-full h-24 object-cover"
              width={70}
              height={50}
            />
          ) : (
            <video
              src={preview}
              className="w-full h-24 object-cover"
              controls
              title={`Video preview: ${files[index]?.name || 'property video'}`}
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => handleRemoveFile(index, isImage)}
              className="text-white bg-green-500 rounded-full p-2 hover:bg-green-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 truncate">
            {files[index]?.name}
          </div>
        </div>
      ))}
    </div>
  );

  // Add usage display component
  const renderUsageInfo = () => {
    if (!usageData) return null;

    const isLimitReached = usageData.listingsCreated >= usageData.limit && usageData.limit !== -1;
    const isNearLimit = usageData.listingsCreated >= usageData.limit - 2 && usageData.limit !== -1;

    return (
      <div className={`mb-6 p-4 rounded-lg border ${
        isLimitReached 
          ? 'bg-green-50 border-green-200' 
          : isNearLimit 
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-blue-50 border-blue-200'
      }`}>
        <h3 className={`text-lg font-medium mb-2 ${
          isLimitReached ? 'text-green-800' : isNearLimit ? 'text-yellow-800' : 'text-blue-800'
        }`}>
          Your Current Usage
          {isLimitReached && (
            <span className="ml-2 text-sm font-normal">(Limit Reached)</span>
          )}
          {isNearLimit && !isLimitReached && (
            <span className="ml-2 text-sm font-normal">(Approaching Limit)</span>
          )}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Listings: </span>
            <span className={isLimitReached ? "text-green-600 font-bold" : ""}>
              {usageData.listingsCreated} / {usageData.limit === -1 ? 'Unlimited' : usageData.limit}
            </span>
          </div>
          <div>
            <span className="font-medium">Push-ups: </span>
            <span>{usageData.manualPushUps} / {usageData.manualPushUpsLimit === -1 ? 'Unlimited' : usageData.manualPushUpsLimit}</span>
          </div>
          <div>
            <span className="font-medium">Featured: </span>
            <span>{usageData.featuredListingsUsed} / {usageData.featuredListingsLimit}</span>
          </div>
          <div>
            <span className="font-medium">Social Ads: </span>
            <span>{usageData.socialMediaAdsUsed} / {usageData.socialMediaAdsLimit === -1 ? 'Unlimited' : usageData.socialMediaAdsLimit}</span>
          </div>
        </div>
        {isLimitReached && (
          <p className="text-green-600 text-sm mt-2">
            You have reached your listing limit. Please upgrade your subscription to add more properties.
          </p>
        )}
      </div>
    );
  };

  // Check if user can submit based on usage limits
  const canSubmit = usageData && (usageData.limit === -1 || usageData.listingsCreated < usageData.limit);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="flex-1 max-w-5xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">ADD PROPERTY</h1>

        {/* Display usage information */}
        {renderUsageInfo()}

        {showSubmissionSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4">
            <span className="block sm:inline">Property added successfully! Your usage has been updated.</span>
            <button
              type="button"
              onClick={() => setShowSubmissionSuccess(false)}
              className="absolute top-2 right-2 text-green-700 p-1 rounded-full hover:bg-green-200"
            >
              ×
            </button>
          </div>
        )}

        {fileError && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4">
            <span className="block sm:inline">{fileError}</span>
            <button
              type="button"
              onClick={() => setFileError("")}
              className="absolute top-2 right-2 text-green-700 p-1 rounded-full hover:bg-green-200"
            >
              ×
            </button>
          </div>
        )}

        {propertyError && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4">
            <span className="block sm:inline">{propertyError}</span>
            <button
              type="button"
              onClick={clearError}
              className="absolute top-2 right-2 text-green-700 p-1 rounded-full hover:bg-green-200"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Listing Type *</label>
              <select
                name="listingType"
                value={formData.listingType}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                <option value="shortlet">Shortlet</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter Property Title"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Property Description"
                className="w-full border rounded-xl p-3 h-32 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter Price"
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="USD">USD</option>
                  <option value="NGN">NGN</option>
                </select>
              </div>
            </div>

            {/* Features Section */}
            <div>
              <label className="text-sm font-medium text-gray-700">Features</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.features.bedrooms}
                    onChange={handleChange}
                    min={0}
                    className="w-full border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.features.bathrooms}
                    onChange={handleChange}
                    min={0}
                    className="w-full border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Toilets</label>
                  <input
                    type="number"
                    name="toilets"
                    value={formData.features.toilets}
                    onChange={handleChange}
                    min={0}
                    className="w-full border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Parking Spaces</label>
                  <input
                    type="number"
                    name="parkingSpaces"
                    value={formData.features.parkingSpaces}
                    onChange={handleChange}
                    min={0}
                    className="w-full border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Size (sq ft)</label>
                  <input
                    type="number"
                    name="size"
                    value={formData.features.size}
                    onChange={handleChange}
                    min={0}
                    className="w-full border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Year Built</label>
                  <input
                    type="number"
                    name="yearBuilt"
                    value={formData.features.yearBuilt}
                    onChange={handleChange}
                    min={0}
                    className="w-full border rounded-xl p-2"
                  />
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600">Furnishing</label>
                  <input
                    type="text"
                    name="furnishing"
                    value={formData.features.furnishing}
                    onChange={handleChange}
                    placeholder="e.g. Fully Furnished"
                    className="w-full border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Amenities</label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.features.amenities}
                    onChange={handleChange}
                    placeholder="e.g. Pool, Gym"
                    className="w-full border rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Extras</label>
                  <input
                    type="text"
                    name="extras"
                    value={formData.features.extras}
                    onChange={handleChange}
                    placeholder="e.g. Security"
                    className="w-full border rounded-xl p-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact info"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Ownership</label>
              <select
                name="ownership"
                value={formData.ownership}
                onChange={handleChange}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="owner">Owner</option>
                <option value="agent">Agent</option>
                <option value="helper">Helper</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Property Type</label>
              <input
                type="text"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                placeholder="e.g. Apartment, House"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="available">Available</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="rented">Rented</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="new">New</option>
                  <option value="old">Old</option>
                  <option value="renovated">Renovated</option>
                </select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="p-4 rounded-xl border border-gray-200">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Property Images (Max: {MAX_IMAGES}) - {images.length} selected
              </label>
              <div
                className={`relative mt-2 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
                  dragOverImage ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}
                onDragOver={(e) => handleDragOver(e, true)}
                onDragLeave={(e) => handleDragLeave(e, true)}
                onDrop={(e) => handleDrop(e, true)}
              >
                <ImageIcon size={48} className="text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drop your images here, or <span className="text-green-600 font-semibold">browse</span>
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, true)}
                  className="hidden"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload" 
                  className="absolute inset-0 cursor-pointer"
                  style={{ zIndex: 10 }}
                ></label>
              </div>
              {renderFilePreviews(imagePreviews, images, true)}
            </div>
            
            {/* Video Upload Section */}
            <div className="p-4 rounded-xl border border-gray-200">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Property Videos (Max: {MAX_VIDEOS}) - {videos.length} selected
              </label>
              <div
                className={`relative mt-2 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${
                  dragOverVideo ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}
                onDragOver={(e) => handleDragOver(e, false)}
                onDragLeave={(e) => handleDragLeave(e, false)}
                onDrop={(e) => handleDrop(e, false)}
              >
                <Video size={48} className="text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drop your videos here, or <span className="text-green-600 font-semibold">browse</span>
                </p>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, false)}
                  className="hidden"
                  id="video-upload"
                />
                <label 
                  htmlFor="video-upload" 
                  className="absolute inset-0 cursor-pointer"
                  style={{ zIndex: 10 }}
                ></label>
              </div>
              {renderFilePreviews(videoPreviews, videos, false)}
            </div>
          </div>

          {/* RIGHT SIDE (Location + submit button) */}
          <div className="space-y-6">
            {/* Address field with autocomplete */}
            <div>
              <label className="text-sm font-medium text-gray-700">Property Address *</label>
              <AddressAutocomplete
                address={formData.location.address}
                onAddressChange={handleAddressChange}
                onCoordinatesFound={handleCoordinatesFound}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.location.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Coordinate Display */}
            <CoordinateDisplay coordinates={formData.location.coordinate} />

            {/* Fallback: Use Current Location */}
            <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
              <p className="text-sm text-blue-700 mb-2">
                Can not find your address? Use your current location instead:
              </p>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <MapPin size={16} />
                Use Current Location
              </button>
            </div>

            <button
              type="submit"
              disabled={loadingListNew || !canSubmit || !hasValidCoordinates}
              className="w-full bg-green-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loadingListNew ? "Adding Property..." : 
               !canSubmit ? "Listing Limit Reached" : 
               !hasValidCoordinates ? "Locating Address..." : "Add Property"}
            </button>

            {!canSubmit && (
              <p className="text-green-600 text-sm text-center">
                You have reached your property listing limit. Please upgrade your subscription to add more properties.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}