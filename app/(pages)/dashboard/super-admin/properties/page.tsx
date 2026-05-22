// app/dashboard/admin/properties/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Home, 
  MapPin,   
  Trash2,  
  AlertCircle,
  RefreshCw,
  Star,
  Eye,
  MoreVertical,
  Filter,
  HomeIcon
} from 'lucide-react';
import { adminService } from '@/app/api/adminService';
import { Property } from '@/app/components/property/types/property';
import { AxiosError } from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProperties: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  const fetchProperties = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.getAllProperties(page, 10);
      
      setProperties(response.properties || []);
      
      if (response.pagination) {
        setPagination({
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalProperties: response.pagination.totalProperties || 0,
          hasNext: response.pagination.hasNext,
          hasPrev: response.pagination.hasPrev
        });
      } else {
        const totalProperties = response.properties?.length || 0;
        const totalPages = Math.ceil(totalProperties / 10);
        setPagination({
          currentPage: page,
          totalPages,
          totalProperties,
          hasNext: page < totalPages,
          hasPrev: page > 1
        });
      }
    } catch (err: unknown) {
      console.error('Error fetching properties:', err);
      let errorMessage = 'Failed to load properties. Please try again.';
      
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setProperties([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage]);

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(propertyId);
      setError(null);
      
      await adminService.deleteProperty(propertyId);
      
      setProperties(prev => prev.filter(property => property._id !== propertyId));
      
      if (pagination) {
        setPagination(prev => prev ? {
          ...prev,
          totalProperties: prev.totalProperties - 1
        } : null);
      }
    } catch (err: unknown) {
      console.error('Error deleting property:', err);
      let errorMessage = 'Failed to delete property.';
      
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setActionLoading(null);
      setMobileMenuOpen(null);
    }
  };

  const handleToggleFeatured = async (propertyId: string, currentlyFeatured: boolean) => {
    try {
      setActionLoading(propertyId);
      setError(null);
      
      const currentProperty = properties.find(p => p._id === propertyId);
      if (!currentProperty) return;

      await adminService.updateProperty(propertyId, {
        metadata: {
          ...currentProperty.metadata,
          isFeatured: !currentlyFeatured
        }
      });
      
      setProperties(prev => prev.map(property => 
        property._id === propertyId 
          ? { 
              ...property, 
              isFeatured: !currentlyFeatured
            } 
          : property
      ));
    } catch (err: unknown) {
      console.error('Error toggling featured status:', err);
      let errorMessage = 'Failed to update featured status.';
      
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setActionLoading(null);
      setMobileMenuOpen(null);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.propertyType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || property.listingType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      sale: { color: 'bg-red-100 text-red-800', label: 'For Sale' },
      rent: { color: 'bg-blue-100 text-blue-800', label: 'For Rent' }
    };

    const config = typeConfig[type as keyof typeof typeConfig] || { color: 'bg-gray-100 text-gray-800', label: type };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Property Management</h1>
            <p className="text-gray-600 mt-1 sm:mt-2">Manage all property listings</p>
          </div>
          <button
            onClick={() => fetchProperties(currentPage)}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle for Mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Filters */}
          <div className={`flex flex-col sm:flex-row gap-4 ${showFilters ? 'block' : 'hidden sm:flex'}`}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="shortlet">For Shortlet</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {pagination && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <p className="text-sm text-gray-600">
                Showing {filteredProperties.length} of {pagination.totalProperties} properties
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
            </div>
          </div>
        </div>
      )}

      {/* Properties Grid/Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredProperties.length === 0 ? (
          <div className="text-center p-8 sm:p-12">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No properties found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="sm:hidden space-y-4 p-4">
              {filteredProperties.map((property) => (
                <div key={property._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {property.media?.images?.length > 0 ? (
                          <Image
                            src={property.media.images[0].url}
                            alt={property.title}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover"
                          />
                        ) : (
                          <Home className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{property.title}</h3>
                        <p className="text-sm text-gray-500">{property.propertyType}</p>
                        <div className="flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="text-xs text-gray-600 truncate">
                            {property.location?.city || 'N/A'}, {property.location?.state || 'N/A'}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {getTypeBadge(property.listingType)}
                          {property.metadata.isFeatured && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="relative">
                      <button
                        onClick={() => setMobileMenuOpen(mobileMenuOpen === property._id ? null : property._id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      {/* Mobile Dropdown Menu */}
                      {mobileMenuOpen === property._id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                          <Link
                            href={`/dashboard/admin/properties/${property._id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                          <button
                            onClick={() => handleToggleFeatured(property._id, property.metadata.isFeatured || false)}
                            disabled={actionLoading === property._id}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Star className={`w-4 h-4 mr-2 ${property.metadata.isFeatured ? 'fill-current text-yellow-500' : ''}`} />
                            {property.metadata.isFeatured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property._id)}
                            disabled={actionLoading === property._id}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatPrice(property.price, property.currency)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property._id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {property.media?.images?.length > 0 ? (
                              <Image
                                src={property.media.images[0].url}
                                alt={property.title}
                                width={48}
                                height={48}
                                className="w-12 h-12 object-cover"
                              />
                            ) : (
                              <Home className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.propertyType}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(property.createdAt).toLocaleDateString()}
                            </div>
                            {property.metadata.isFeatured && (
                              <div className="flex items-center mt-1 text-xs text-yellow-600">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Featured
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(property.listingType)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(property.price, property.currency)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.location?.city || 'N/A'}, {property.location?.state || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard/admin/properties/${property._id}`}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          
                          <button
                            onClick={() => handleToggleFeatured(property._id, property.metadata.isFeatured || false)}
                            disabled={actionLoading === property._id}
                            className={`flex items-center ${property.metadata.isFeatured ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-600 hover:text-gray-900'} disabled:opacity-50`}
                            title={property.metadata.isFeatured ? 'Remove Featured' : 'Make Featured'}
                          >
                            <Star className={`w-4 h-4 ${property.metadata.isFeatured ? 'fill-current' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleDeleteProperty(property._id)}
                            disabled={actionLoading === property._id}
                            className="text-red-600 hover:text-red-900 flex items-center disabled:opacity-50"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <HomeIcon className="w-3 h-3 mr-1" />
                          {property.metadata?.status || 'available'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white px-4 sm:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}