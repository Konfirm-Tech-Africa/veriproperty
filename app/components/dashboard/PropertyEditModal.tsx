"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Image as ImageIcon, Video, MapPin, Search, Save, X, Loader2 } from "lucide-react";
import type { Property, PropertyListingPayload } from "../property/types/property";
import { useProperty } from "@/app/context/PropertyContext";
import Image from "next/image";

// File size and count limits
const MAX_IMAGE_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 50;
const MAX_IMAGES = 10;
const MAX_VIDEOS = 1;

// Edit form data interface
interface PropertyEditFormData {
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

interface PropertyEditModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedProperty: Property) => void;
}

// Geocoding service
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
      }, 1000);

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
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="button"
          onClick={handleGeocode}
          disabled={isGeocoding || !address.trim()}
          className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={16} />
          {isGeocoding ? "Finding..." : "Locate"}
        </button>
      </div>
      
      {geocodeError && (
        <p className="text-green-500 text-sm">{geocodeError}</p>
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

export default function PropertyEditModal({ property, isOpen, onClose, onUpdate }: PropertyEditModalProps) {
  const { updateProperty } = useProperty();
  
  const [formData, setFormData] = useState<PropertyEditFormData>({
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

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newVideos, setNewVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [videosToRemove, setVideosToRemove] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOverImage, setDragOverImage] = useState(false);
  const [dragOverVideo, setDragOverVideo] = useState(false);
  const [hasValidCoordinates, setHasValidCoordinates] = useState(false);

  // Initialize form with property data
  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        listingType: property.listingType || "sale",
        price: property.price || 0,
        currency: property.currency || "NGN",
        location: {
          address: property.location?.address || "",
          city: property.location?.city || "",
          state: property.location?.state || "",
          postalCode: property.location?.postalCode || "",
          coordinate: {
            lat: property.lat || property.location?.coordinate?.lat || 0,
            lon: property.lon || property.location?.coordinate?.lon || 0,
          },
        },
        features: {
          bedrooms: property.features?.bedrooms || 0,
          bathrooms: property.features?.bathrooms || 0,
          toilets: property.features?.toilets || 0,
          parkingSpaces: property.features?.parkingSpaces || 0,
          size: property.features?.size || 0,
          yearBuilt: property.features?.yearBuilt || 0,
          furnishing: property.features?.furnishing || "",
          amenities: property.features?.amenities || "",
          extras: property.features?.extras || "",
          condition: property.features?.condition || property.condition || "",
        },
        contact: property.contact?.contactName || property.contact?.contactNumber || "",
        ownership: property.ownership || "owner",
        propertyType: property.propertyType || "",
        status: property.status || "available",
        condition: property.condition || "new",
      });

      // Set initial coordinate validation
      const hasCoords = (property.lat && property.lon) || 
                       (property.location?.coordinate?.lat && property.location?.coordinate?.lon);
      setHasValidCoordinates(!!hasCoords);

      // Clear file states
      setNewImages([]);
      setNewVideos([]);
      setImagePreviews([]);
      setVideoPreviews([]);
      setImagesToRemove([]);
      setVideosToRemove([]);
      setError("");
    }
  }, [property, isOpen]);

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
          setError("Could not get current location. Please enter the address manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser. Please enter the address manually.");
    }
  };

  // Generic handler for all inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    
    // Handle enum-like fields
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
    
    // For features fields
    if ([
      "bedrooms", "bathrooms", "toilets", "parkingSpaces", "size", "yearBuilt",
      "furnishing", "amenities", "extras", "condition"
    ].includes(name)) {
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: ["bedrooms", "bathrooms", "toilets", "parkingSpaces", "size", "yearBuilt"].includes(name)
            ? Number(value)
            : value,
        },
      }));
    } else if (["city", "state", "postalCode"].includes(name)) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // File handling functions
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
    setError("");

    const maxCount = isImage ? MAX_IMAGES : MAX_VIDEOS;
    const maxSizeMB = isImage ? MAX_IMAGE_SIZE_MB : MAX_VIDEO_SIZE_MB;
    const setFiles = isImage ? setNewImages : setNewVideos;
    const setPreviews = isImage ? setImagePreviews : setVideoPreviews;
    const currentFiles = isImage ? newImages : newVideos;
    const existingMedia = isImage ? property.media.images : property.media.videos;
    const mediaToRemove = isImage ? imagesToRemove : videosToRemove;

    // Check total file count (existing + new - removed)
    const totalAfterAdd = (existingMedia.length - mediaToRemove.length) + currentFiles.length + files.length;
    if (totalAfterAdd > maxCount) {
      setError(`You can only have a maximum of ${maxCount} ${isImage ? 'images' : 'videos'}.`);
      return;
    }

    // Check file sizes
    const filesArray = Array.from(files);
    for (const file of filesArray) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        setError(`File ${file.name} exceeds the maximum size of ${maxSizeMB}MB.`);
        return;
      }
    }

    // Create previews
    const newPreviews = filesArray.map(file => URL.createObjectURL(file));

    // Add files to state
    setFiles((prev) => [...prev, ...filesArray]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveExistingMedia = (index: number, isImage: boolean): void => {
    const mediaArray = isImage ? property.media.images : property.media.videos;
    const mediaItem = mediaArray[index];
    
    if (isImage) {
      setImagesToRemove(prev => [...prev, mediaItem.public_id]);
    } else {
      setVideosToRemove(prev => [...prev, mediaItem.public_id]);
    }
  };

  const handleRemoveNewFile = (index: number, isImage: boolean): void => {
    const setFiles = isImage ? setNewImages : setNewVideos;
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

  // Restore removed media
  const handleRestoreMedia = (publicId: string, isImage: boolean): void => {
    if (isImage) {
      setImagesToRemove(prev => prev.filter(id => id !== publicId));
    } else {
      setVideosToRemove(prev => prev.filter(id => id !== publicId));
    }
  };

  // Prepare payload for update
const preparePayload = (): Partial<PropertyListingPayload> & { imagesToRemove?: string[]; videosToRemove?: string[] } => {
  const payload: Partial<PropertyListingPayload> & { imagesToRemove?: string[]; videosToRemove?: string[] } = {
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
  };

  // Add media removal info if any
  if (imagesToRemove.length > 0) {
    payload.imagesToRemove = imagesToRemove;
  }
  if (videosToRemove.length > 0) {
    payload.videosToRemove = videosToRemove;
  }

  return payload;
};

  // Handle form submission
// In your PropertyEditModal, update the handleSubmit function
const handleSubmit = async (e: React.FormEvent): Promise<void> => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  // Validate form data
  if (!formData.title || !formData.description || !formData.listingType) {
    setError("Please fill in all required fields.");
    setIsLoading(false);
    return;
  }

  // Validate address
  if (!formData.location.address.trim()) {
    setError("Please enter a property address.");
    setIsLoading(false);
    return;
  }

  // Validate coordinates
  if (formData.location.coordinate.lat === 0 || formData.location.coordinate.lon === 0) {
    setError("Please wait for the address to be located, or use the current location button.");
    setIsLoading(false);
    return;
  }

  try {
    const payload = preparePayload();
    
    const result = await updateProperty(property._id, payload, newImages, newVideos);
    
    if (result.success && result.updatedProperty) {
      onUpdate(result.updatedProperty);
      onClose();
    } else {
      setError(result.message || "Failed to update property");
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred while updating the property";
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  // Render file previews
  const renderFilePreviews = (previews: string[], files: File[], isImage: boolean) => (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {previews.map((preview, index) => (
        <div key={`new-${index}`} className="relative rounded-lg overflow-hidden border border-gray-200">
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
              onClick={() => handleRemoveNewFile(index, isImage)}
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

  // Render existing media with remove option
interface MediaItem {
  url: string;
  public_id: string;
  alt?: string;
}

const renderExistingMedia = (mediaArray: MediaItem[], isImage: boolean) => (
  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {mediaArray.map((media, index) => {
      const isRemoved = isImage 
        ? imagesToRemove.includes(media.public_id)
        : videosToRemove.includes(media.public_id);

      if (isRemoved) {
        return (
          <div key={media.public_id} className="relative rounded-lg overflow-hidden border border-gray-200 opacity-50">
            {isImage ? (
              <Image
                src={media.url}
                alt={media.alt || 'Property image'}
                className="w-full h-24 object-cover"
                width={70}
                height={50}
              />
            ) : (
              <video
                src={media.url}
                className="w-full h-24 object-cover"
                controls
                title="Property video"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRestoreMedia(media.public_id, isImage)}
                className="text-white bg-green-500 rounded-full p-2 hover:bg-green-600 transition-colors text-xs"
              >
                Restore
              </button>
            </div>
          </div>
        );
      }

      return (
        <div key={media.public_id} className="relative rounded-lg overflow-hidden border border-gray-200">
          {isImage ? (
            <Image
              src={media.url}
              alt={media.alt || 'Property image'}
              className="w-full h-24 object-cover"
              width={70}
              height={50}
            />
          ) : (
            <video
              src={media.url}
              className="w-full h-24 object-cover"
              controls
              title="Property video"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => handleRemoveExistingMedia(index, isImage)}
              className="text-white bg-green-500 rounded-full p-2 hover:bg-green-600 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Edit Property</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <option value="shortlet">Short Let</option>
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
            </div>

            {/* RIGHT SIDE */}
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
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Coordinate Display */}
              <CoordinateDisplay coordinates={formData.location.coordinate} />

              {/* Fallback: Use Current Location */}
              <div className="p-4 border border-gray-200 rounded-lg bg-green-50">
                <p className="text-sm text-green-700 mb-2">
                  Can not find your address? Use your current location instead:
                </p>
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <MapPin size={16} />
                  Use Current Location
                </button>
              </div>

              {/* Existing Images */}
              <div className="p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Existing Images ({property.media.images.length - imagesToRemove.length} remaining)
                </label>
                {renderExistingMedia(property.media.images, true)}
              </div>

              {/* New Image Upload */}
              <div className="p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Add New Images (Max: {MAX_IMAGES}) - {newImages.length} selected
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
                    id="image-upload-edit"
                  />
                  <label 
                    htmlFor="image-upload-edit" 
                    className="absolute inset-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                  ></label>
                </div>
                {renderFilePreviews(imagePreviews, newImages, true)}
              </div>

              {/* Existing Videos */}
              <div className="p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Existing Videos ({property.media.videos.length - videosToRemove.length} remaining)
                </label>
                {renderExistingMedia(property.media.videos, false)}
              </div>

              {/* New Video Upload */}
              <div className="p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Add New Videos (Max: {MAX_VIDEOS}) - {newVideos.length} selected
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
                    id="video-upload-edit"
                  />
                  <label 
                    htmlFor="video-upload-edit" 
                    className="absolute inset-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                  ></label>
                </div>
                {renderFilePreviews(videoPreviews, newVideos, false)}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !hasValidCoordinates}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Update Property
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}