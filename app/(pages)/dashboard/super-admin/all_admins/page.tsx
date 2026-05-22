// app/dashboard/admins/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { adminService } from '@/app/api/adminService';
import Link from 'next/link';
import { 
  MoreVertical, 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Trash2,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  isVerified: boolean;
  isEmailVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalAdmins?: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const AdminsDashboard: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, [currentPage]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAllAdmins(currentPage, 10);
      
      setAdmins(response.admins || []);
      
      // Safe pagination handling
      if (response.pagination) {
        setPagination(response.pagination);
      } else {
        // Fallback pagination
        const totalAdmins = response.admins?.length || 0;
        const totalPages = Math.ceil(totalAdmins / 10);
        setPagination({
          currentPage: currentPage,
          totalPages: totalPages,
          totalAdmins: totalAdmins,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        });
      }
    } catch (err: unknown) {
      console.error('Error fetching admins:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setAdmins([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to suspend this admin?')) return;
    
    try {
      setActionLoading(adminId);
      await adminService.suspendAdmin(adminId);
      await fetchAdmins(); // Refresh list
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
      setMobileMenuOpen(null);
    }
  };

  const handleActivateAdmin = async (adminId: string) => {
    try {
      setActionLoading(adminId);
      await adminService.activateAdmin(adminId);
      await fetchAdmins(); // Refresh list
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
      setMobileMenuOpen(null);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;
    
    try {
      setActionLoading(adminId);
      await adminService.deleteAdmin(adminId);
      await fetchAdmins(); // Refresh list
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
      setMobileMenuOpen(null);
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (typeof error === 'object' && error !== null) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        return apiError.response.data.message;
      }
      return JSON.stringify(error);
    }
    
    return 'An unknown error occurred';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspended' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      super_admin: { color: 'bg-purple-100 text-purple-800', label: 'Super Admin' },
      admin: { color: 'bg-blue-100 text-blue-800', label: 'Admin' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.admin;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <Shield className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">Manage system administrators</p>
        </div>
        <Link
          href="/dashboard/super-admin/register_admin"
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
        >
          <User className="w-4 h-4" />
          <span>Add New Admin</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error: {error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-800 hover:text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {pagination && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <p className="text-sm text-gray-600">
                Showing {admins.length} administrator(s)
              </p>
            </div>
            {pagination.totalPages > 1 && (
              <div className="text-sm text-gray-600">
                <span>Page {currentPage} of {pagination.totalPages}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admins Table/Cards */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {admins.length === 0 ? (
          <div className="text-center p-8 sm:p-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No administrators found</p>
            <p className="text-gray-400 mt-2">Add your first administrator to get started</p>
          </div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="sm:hidden space-y-4 p-4">
              {admins.map((admin) => (
                <div key={admin._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{admin.name}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3 mr-1" />
                          <span className="truncate">{admin.email}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {getRoleBadge(admin.role)}
                          {getStatusBadge(admin.accountStatus)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="relative">
                      <button
                        onClick={() => setMobileMenuOpen(mobileMenuOpen === admin._id ? null : admin._id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={actionLoading === admin._id}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      {/* Mobile Dropdown Menu */}
                      {mobileMenuOpen === admin._id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                          {admin.accountStatus === 'active' ? (
                            <button
                              onClick={() => handleSuspendAdmin(admin._id)}
                              disabled={actionLoading === admin._id}
                              className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                              <PauseCircle className="w-4 h-4 mr-2" />
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateAdmin(admin._id)}
                              disabled={actionLoading === admin._id}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Activate
                            </button>
                          )}
                          {admin.role !== 'super_admin' && (
                            <button
                              onClick={() => handleDeleteAdmin(admin._id)}
                              disabled={actionLoading === admin._id}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </div>
                    {actionLoading === admin._id && (
                      <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                    )}
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
                      Admin
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {admin.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(admin.role)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(admin.accountStatus)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {admin.accountStatus === 'active' ? (
                            <button
                              onClick={() => handleSuspendAdmin(admin._id)}
                              disabled={actionLoading === admin._id}
                              className="text-yellow-600 hover:text-yellow-900 transition-colors disabled:opacity-50 flex items-center"
                              title="Suspend Admin"
                            >
                              <PauseCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateAdmin(admin._id)}
                              disabled={actionLoading === admin._id}
                              className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50 flex items-center"
                              title="Activate Admin"
                            > Suspend
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}
                          {admin.role !== 'super_admin' && (
                            <button
                              onClick={() => handleDeleteAdmin(admin._id)}
                              disabled={actionLoading === admin._id}
                              className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 flex items-center"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          {actionLoading === admin._id && (
                            <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                          )}
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
                Page {currentPage} of {pagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
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
};

export default AdminsDashboard;