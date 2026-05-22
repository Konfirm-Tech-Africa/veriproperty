// app/dashboard/admin/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Home, AlertTriangle, RefreshCw, Shield, FileText, Settings } from 'lucide-react';
import { adminService } from '@/app/api/adminService';
import Link from 'next/link';
import { Verification } from '@/app/components/property/types/verification';

interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalProperties: number;
  pendingVerifications: number;
  pendingListings: number;
  flaggedContent: number;
  verificationStats?: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalProperties: 0,
    pendingVerifications: 0,
    pendingListings: 0,
    flaggedContent: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch analytics endpoint first
      try {
        const analytics = await adminService.getDashboardAnalytics();
        
        setStats({
          totalUsers: analytics.totalUsers || 0,
          totalAdmins: analytics.totalAdmins || 0,
          totalProperties: analytics.totalProperties || 0,
          pendingVerifications: analytics.pendingVerifications || 0,
          pendingListings: analytics.pendingListings || 0,
          flaggedContent: 0, // You might need a separate endpoint for this
          verificationStats: {
            pending: analytics.pendingVerifications || 0,
            approved: analytics.pendingListings ? analytics.pendingListings - analytics.pendingVerifications : 0,
            rejected: 0,
            total: analytics.pendingListings || 0
          }
        });
        
      } catch (analyticsError) {
        console.warn('Analytics endpoint not available, using fallback:', analyticsError);
        await fetchFallbackData();
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      await fetchFallbackData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fallback data fetching using individual endpoints
  const fetchFallbackData = async () => {
    try {
      console.log('Fetching admin dashboard data from individual endpoints...');
      
      const [
        usersData,
        adminsData,
        propertiesData,
        pendingListingsData,
        verificationsData
      ] = await Promise.all([
        adminService.getAllUsers(1, 1).catch(err => {
          console.error('Error fetching users:', err);
          return { users: [], pagination: { totalUsers: 0 } };
        }),
        adminService.getAllAdmins(1, 1).catch(err => {
          console.error('Error fetching admins:', err);
          return { admins: [], pagination: { totalAdmins: 0 } };
        }),
        adminService.getAllProperties(1, 1).catch(err => {
          console.error('Error fetching properties:', err);
          return { properties: [], pagination: { totalProperties: 0 } };
        }),
        adminService.getPendingListings(1, 1).catch(err => {
          console.error('Error fetching pending listings:', err);
          return { properties: [], pagination: { totalProperties: 0 } };
        }),
        adminService.getAllVerifications(1, 50).catch(err => {
          console.error('Error fetching verifications:', err);
          return { verifications: [], pagination: { totalVerifications: 0 } };
        })
      ]);

      // Count verification statuses
      const verifications = verificationsData.verifications || [];
      const pendingVerifications = verifications.filter((v: Verification) => v.status === 'pending').length;
      const approvedVerifications = verifications.filter((v: Verification) => v.status === 'approved').length;
      const rejectedVerifications = verifications.filter((v: Verification) => v.status === 'rejected').length;

      setStats({
        totalUsers: usersData.pagination?.totalUsers || usersData.users?.length || 0,
        totalAdmins: adminsData.pagination?.totalAdmins || adminsData.admins?.length || 0,
        totalProperties: propertiesData.pagination?.totalProperties || propertiesData.properties?.length || 0,
        pendingVerifications,
        pendingListings: pendingListingsData.pagination?.totalProperties || pendingListingsData.properties?.length || 0,
        flaggedContent: 0, // You might need a separate endpoint for this
        verificationStats: {
          pending: pendingVerifications,
          approved: approvedVerifications,
          rejected: rejectedVerifications,
          total: verifications.length
        }
      });

    } catch (error) {
      console.error('Error fetching fallback data:', error);
      
      // Ultimate fallback with minimal data
      setStats({
        totalUsers: 0,
        totalAdmins: 0,
        totalProperties: 0,
        pendingVerifications: 0,
        pendingListings: 0,
        flaggedContent: 0
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const statsData = [
    { 
      name: 'Total Users', 
      value: stats.totalUsers.toLocaleString(), 
      icon: Users, 
      change: '+12%', 
      changeType: 'positive',
      link: '/dashboard/super-admin/users'
    },
    { 
      name: 'Administrators', 
      value: stats.totalAdmins.toString(), 
      icon: Shield, 
      change: 'Active', 
      changeType: 'positive',
      link: '/dashboard/super-admin/admins'
    },
    { 
      name: 'Total Properties', 
      value: stats.totalProperties.toString(), 
      icon: Home, 
      change: `${stats.pendingListings} pending`, 
      changeType: stats.pendingListings > 0 ? 'neutral' : 'positive',
      link: '/dashboard/super-admin/properties'
    },
    { 
      name: 'Pending Verifications', 
      value: stats.pendingVerifications.toString(), 
      icon: UserCheck, 
      change: `${stats.pendingVerifications > 0 ? '+' : ''}${stats.pendingVerifications}`, 
      changeType: stats.pendingVerifications > 0 ? 'negative' : 'positive',
      link: '/dashboard/super-admin/verifications'
    },
  ];

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to the administration panel</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => {
          const StatComponent = stat.link ? Link : 'div';
          const isPendingVerifications = stat.name === 'Pending Verifications';
          
          return (
            <StatComponent
              key={stat.name}
              href={stat.link || '#'}
              className={stat.link ? 'cursor-pointer' : ''}
            >
              <div className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                stat.link ? 'hover:border-red-300 border-2 border-transparent' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {isPendingVerifications ? 
                        `${stat.change} pending review` : 
                        `${stat.change} from last week`}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    isPendingVerifications && stats.pendingVerifications > 0 ? 
                    'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      isPendingVerifications && stats.pendingVerifications > 0 ? 
                      'text-yellow-600' : 'text-red-600'
                    }`} />
                  </div>
                </div>
              </div>
            </StatComponent>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/super-admin/verifications">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
              <UserCheck className="w-8 h-8 text-red-600 mb-2 mx-auto" />
              <h3 className="font-semibold">Review Verifications</h3>
              <p className="text-sm text-gray-600 mt-1">
                {stats.pendingVerifications} pending requests
              </p>
            </div>
          </Link>
          
          <Link href="/dashboard/super-admin/users">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
              <Users className="w-8 h-8 text-blue-600 mb-2 mx-auto" />
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">
                {stats.totalUsers} total users
              </p>
            </div>
          </Link>

          <Link href="/dashboard/super-admin/properties">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
              <Home className="w-8 h-8 text-green-600 mb-2 mx-auto" />
              <h3 className="font-semibold">Manage Properties</h3>
              <p className="text-sm text-gray-600 mt-1">
                {stats.totalProperties} properties
              </p>
            </div>
          </Link>

          <Link href="/dashboard/super-admin/admins">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
              <Shield className="w-8 h-8 text-purple-600 mb-2 mx-auto" />
              <h3 className="font-semibold">Admin Management</h3>
              <p className="text-sm text-gray-600 mt-1">
                {stats.totalAdmins} administrators
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Pending Items Section */}
      {(stats.pendingVerifications > 0 || stats.pendingListings > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Attention Required</h3>
          <div className="space-y-2">
            {stats.pendingVerifications > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-yellow-700">
                  {stats.pendingVerifications} verification request(s) pending review
                </span>
                <Link 
                  href="/dashboard/super-admin/verifications"
                  className="text-yellow-800 hover:text-yellow-900 font-medium text-sm"
                >
                  Review Now →
                </Link>
              </div>
            )}
            {stats.pendingListings > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-yellow-700">
                  {stats.pendingListings} property listing(s) pending approval
                </span>
                <Link 
                  href="/dashboard/super-admin/properties?filter=pending"
                  className="text-yellow-800 hover:text-yellow-900 font-medium text-sm"
                >
                  Review Now →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}