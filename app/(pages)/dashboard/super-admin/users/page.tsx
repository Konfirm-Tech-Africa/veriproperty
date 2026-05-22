
"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Shield, 
  Ban, 
  PlayCircle,
  MoreVertical,
  RefreshCw,
  AlertCircle,
  Calendar,
  Phone
} from 'lucide-react';
import { adminService } from '@/app/api/adminService';
import { AxiosError } from 'axios';
import { User } from '@/app/components/property/types/verification';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers?: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Define a proper error response interface
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.getAllUsers(currentPage, 10);
      
      setUsers(response.users || []);
      
      // Safe pagination handling
      if (response.pagination) {
        setPagination(response.pagination);
      } else {
        // Fallback pagination
        const totalUsers = response.users?.length || 0;
        const totalPages = Math.ceil(totalUsers / 10);
        setPagination({
          currentPage: currentPage,
          totalPages: totalPages,
          totalUsers: totalUsers,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        });
      }
    } catch (err: unknown) {
      console.error('Error fetching users:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    
    try {
      setActionLoading(userId);
      setError(null);
      
      await adminService.suspendUser(userId);
      await fetchUsers(); // Refresh list
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
      setMobileMenuOpen(null);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      setActionLoading(userId);
      setError(null);
      
      // Note: You might need to implement activateUser in your adminService
      // For now, we'll use suspendUser with 'active' status or implement accordingly
      await fetchUsers(); // Refresh list to show updated status
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setActionLoading(null);
      setMobileMenuOpen(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    if (!confirm(`Change user role to ${newRole}?`)) return;
    
    try {
      setActionLoading(userId);
      setError(null);
      
      // Note: You might need to implement updateUserRole in your adminService
      console.log('Changing role for user:', userId, 'to:', newRole);
      
      // Temporary update until API is implemented
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
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
      // Use type assertion with proper interface
      const apiError = error as ApiErrorResponse;
      if (apiError.response?.data?.message) {
        return apiError.response.data.message;
      }
      
      // Handle AxiosError specifically
      if (error instanceof AxiosError) {
        return error.response?.data?.message || error.message || 'Axios error occurred';
      }
      
      return JSON.stringify(error);
    }
    
    return 'An unknown error occurred';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.accountStatus === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: User['role']) => {
    const roleConfig = {
      super_admin: { color: 'bg-red-100 text-red-800', label: 'Super Admin' },
      admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      agent: { color: 'bg-red-100 text-red-800', label: 'Agent' },
      premium_user: { color: 'bg-green-100 text-green-800', label: 'Premium User' },
      user: { color: 'bg-gray-100 text-gray-800', label: 'User' }
    };

    const config = roleConfig[role] || roleConfig.user;
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <Shield className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspended' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getVerificationBadge = (isVerified: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
        isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isVerified ? 'Verified' : 'Unverified'}
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">Manage all users and their permissions</p>
        </div>
        <button
          onClick={() => fetchUsers()}
          disabled={loading}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
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

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="buy">Regular User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
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
                Showing {filteredUsers.length} of {pagination.totalUsers || users.length} users
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

      {/* Users Table/Cards */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center p-8 sm:p-12">
            <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="sm:hidden space-y-4 p-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserPlus className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3 mr-1" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.profile?.phone && (
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            <span>{user.profile.phone}</span>
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.accountStatus)}
                          {getVerificationBadge(user.isVerified)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="relative">
                      <button
                        onClick={() => setMobileMenuOpen(mobileMenuOpen === user._id ? null : user._id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={actionLoading === user._id}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      {/* Mobile Dropdown Menu */}
                      {mobileMenuOpen === user._id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                          {/* Role Change Options */}
                          {user.role !== 'super_admin' && (
                            <>
                              <button
                                onClick={() => handleRoleChange(user._id, 'agent')}
                                disabled={actionLoading === user._id}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                Make Agent
                              </button>
                              <button
                                onClick={() => handleRoleChange(user._id, 'user')}
                                disabled={actionLoading === user._id}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                Make User
                              </button>
                            </>
                          )}
                          
                          {/* Status Toggle */}
                          {user.accountStatus === 'active' ? (
                            <button
                              onClick={() => handleSuspendUser(user._id)}
                              disabled={actionLoading === user._id}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(user._id)}
                              disabled={actionLoading === user._id}
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Activate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    {actionLoading === user._id && (
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
                      User
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role & Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserPlus className="w-5 h-5 text-red-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                            {user.profile?.phone && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.profile.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.accountStatus)}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {getVerificationBadge(user.isVerified)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {/* Role Change Buttons */}
                          {user.role !== 'super_admin' && (
                            <>
                              <button
                                onClick={() => handleRoleChange(user._id, 'agent')}
                                disabled={actionLoading === user._id}
                                className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 flex items-center"
                                title="Make Agent"
                              >
                                <Shield className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRoleChange(user._id, 'user')}
                                disabled={actionLoading === user._id}
                                className="text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 flex items-center"
                                title="Make Regular User"
                              >
                                <UserPlus className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          
                          {/* Status Toggle */}
                          {user.accountStatus === 'active' ? (
                            <button
                              onClick={() => handleSuspendUser(user._id)}
                              disabled={actionLoading === user._id}
                              className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50 flex items-center"
                              title="Suspend User"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(user._id)}
                              disabled={actionLoading === user._id}
                              className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50 flex items-center"
                              title="Activate User"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          {actionLoading === user._id && (
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
}