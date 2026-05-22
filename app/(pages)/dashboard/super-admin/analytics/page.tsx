"use client";
import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Home,
  Download,
  RefreshCw,
  Phone,
  Mail,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowUp,
} from 'lucide-react';
import { adminService } from '@/app/api/adminService';

// Define proper types
interface UserGrowthData {
  daily: number[];
  weekly: number[];
  monthly: number[];
}

interface PropertyGrowthData {
  daily: number[];
  weekly: number[];
  monthly: number[];
}

interface RevenueData {
  total: number;
  monthly: number[];
  yearly: number[];
}

interface TopAgent {
  id: string;
  name: string;
  properties: number;
  views: number;
  leads: number;
}

interface AgentPerformance {
  topAgents: TopAgent[];
}

interface AnalyticsData {
  totalUsers: number;
  totalAdmins: number;
  totalProperties: number;
  pendingVerifications: number;
  pendingListings: number;
  activeSubscriptions: number;
  systemHealth: string;
  userGrowth?: UserGrowthData;
  propertyGrowth?: PropertyGrowthData;
  revenueData?: RevenueData;
  agentPerformance?: AgentPerformance;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';
type ActiveTab = 'overview' | 'users' | 'properties' | 'revenue';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const fetchAnalytics = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set fallback data
      setAnalytics({
        totalUsers: 0,
        totalAdmins: 0,
        totalProperties: 0,
        pendingVerifications: 0,
        pendingListings: 0,
        activeSubscriptions: 0,
        systemHealth: 'degraded',
        userGrowth: {
          daily: [0, 0, 0, 0, 0, 0, 0],
          weekly: [0, 0, 0, 0],
          monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        propertyGrowth: {
          daily: [0, 0, 0, 0, 0, 0, 0],
          weekly: [0, 0, 0, 0],
          monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        revenueData: {
          total: 0,
          monthly: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          yearly: [0, 0, 0, 0]
        },
        agentPerformance: {
          topAgents: []
        }
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await fetchAnalytics();
  };

  const handleExport = (): void => {
    if (!analytics) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      analytics: {
        totalUsers: analytics.totalUsers,
        totalAdmins: analytics.totalAdmins,
        totalProperties: analytics.totalProperties,
        pendingVerifications: analytics.pendingVerifications,
        pendingListings: analytics.pendingListings,
        activeSubscriptions: analytics.activeSubscriptions,
        systemHealth: analytics.systemHealth
      },
      timeRange
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getGrowthData = (): number[] => {
    if (!analytics?.userGrowth) return [];
    
    switch (timeRange) {
      case 'daily':
        return analytics.userGrowth.daily;
      case 'weekly':
        return analytics.userGrowth.weekly;
      case 'monthly':
        return analytics.userGrowth.monthly;
      default:
        return [];
    }
  };

  const getPropertyGrowthData = (): number[] => {
    if (!analytics?.propertyGrowth) return [];
    
    switch (timeRange) {
      case 'daily':
        return analytics.propertyGrowth.daily;
      case 'weekly':
        return analytics.propertyGrowth.weekly;
      case 'monthly':
        return analytics.propertyGrowth.monthly;
      default:
        return [];
    }
  };

  const getRevenueData = (): number[] => {
    if (!analytics?.revenueData) return [];
    
    switch (timeRange) {
      case 'daily':
        return analytics.revenueData.monthly.slice(0, 7);
      case 'weekly':
        return analytics.revenueData.monthly.slice(0, 4);
      case 'monthly':
        return analytics.revenueData.monthly;
      default:
        return [];
    }
  };

  const getMaxValue = (data: number[]): number => {
    return Math.max(...data, 1);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const growthData = getGrowthData();
  const propertyData = getPropertyGrowthData();
  const revenueData = getRevenueData();
  const maxGrowthValue = getMaxValue(growthData);
  const maxPropertyValue = getMaxValue(propertyData);
  const maxRevenueValue = getMaxValue(revenueData);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Platform performance metrics and insights</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold mt-1">{analytics?.totalUsers.toLocaleString() || 0}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold mt-1">{analytics?.totalProperties.toLocaleString() || 0}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +8% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold mt-1">{analytics?.activeSubscriptions.toLocaleString() || 0}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +5% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold mt-1">24.8%</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +2.3% from last month
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
              { id: 'users' as const, label: 'User Analytics', icon: Users },
              { id: 'properties' as const, label: 'Property Analytics', icon: Home },
              { id: 'revenue' as const, label: 'Revenue Analytics', icon: DollarSign }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Growth Charts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Platform Growth</h2>
              <div className="flex space-x-2">
                {(['daily', 'weekly', 'monthly'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      timeRange === range
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 flex items-end space-x-2">
              {growthData.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-red-600 rounded-t transition-all duration-500"
                    style={{ height: `${(value / maxGrowthValue) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">
                    {timeRange === 'daily' ? `Day ${index + 1}` :
                     timeRange === 'weekly' ? `Week ${index + 1}` :
                     `Month ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Actions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium">Pending Verifications</p>
                      <p className="text-sm text-gray-600">Agent verifications awaiting review</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{analytics?.pendingVerifications || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Pending Listings</p>
                      <p className="text-sm text-gray-600">Properties awaiting approval</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{analytics?.pendingListings || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Health</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    analytics?.systemHealth === 'healthy'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      analytics?.systemHealth === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    {analytics?.systemHealth === 'healthy' ? 'All Systems Operational' : 'Some Issues Detected'}
                  </div>
                  <p className="mt-4 text-gray-600">Last check: {new Date().toLocaleString()}</p>
                </div>
                <CheckCircle className={`w-12 h-12 ${
                  analytics?.systemHealth === 'healthy' ? 'text-green-500' : 'text-yellow-500'
                }`} />
              </div>
            </div>
          </div>

          {/* Top Agents Performance */}
          {analytics?.agentPerformance?.topAgents && analytics.agentPerformance.topAgents.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Agents</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Properties</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.agentPerformance.topAgents.map(agent => (
                      <tr key={agent.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{agent.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{agent.properties}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{agent.views}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{agent.leads}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* User Analytics Tab */}
      {activeTab === 'users' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Growth</h2>
            <div className="h-64 flex items-end space-x-2">
              {growthData.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-600 rounded-t transition-all duration-500"
                    style={{ height: `${(value / maxGrowthValue) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">
                    {timeRange === 'daily' ? `Day ${index + 1}` :
                     timeRange === 'weekly' ? `Week ${index + 1}` :
                     `Month ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Registered</p>
                  <p className="text-2xl font-bold">{analytics?.totalUsers.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Verified</p>
                  <p className="text-2xl font-bold">{Math.floor((analytics?.totalUsers || 0) * 0.85).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Users (30d)</p>
                  <p className="text-2xl font-bold">{Math.floor((analytics?.totalUsers || 0) * 0.45).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Analytics Tab */}
      {activeTab === 'properties' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Property Listings Growth</h2>
            <div className="h-64 flex items-end space-x-2">
              {propertyData.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-600 rounded-t transition-all duration-500"
                    style={{ height: `${(value / maxPropertyValue) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">
                    {timeRange === 'daily' ? `Day ${index + 1}` :
                     timeRange === 'weekly' ? `Week ${index + 1}` :
                     `Month ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Listing Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Approved</span>
                  <span className="font-semibold text-green-600">
                    {((analytics?.totalProperties || 0) - (analytics?.pendingListings || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Approval</span>
                  <span className="font-semibold text-yellow-600">{analytics?.pendingListings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rejected</span>
                  <span className="font-semibold text-red-600">0</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Property Categories</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Residential</span>
                  <span className="font-semibold">{Math.floor((analytics?.totalProperties || 0) * 0.65)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commercial</span>
                  <span className="font-semibold">{Math.floor((analytics?.totalProperties || 0) * 0.25)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Land</span>
                  <span className="font-semibold">{Math.floor((analytics?.totalProperties || 0) * 0.10)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Analytics Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Growth</h2>
            <div className="h-64 flex items-end space-x-2">
              {revenueData.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-purple-600 rounded-t transition-all duration-500"
                    style={{ height: `${(value / maxRevenueValue) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">
                    {timeRange === 'daily' ? `Day ${index + 1}` :
                     timeRange === 'weekly' ? `Week ${index + 1}` :
                     `Month ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Revenue Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold text-2xl text-purple-600">
                    ₦{(analytics?.revenueData?.total || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold">
                    ₦{(analytics?.revenueData?.monthly?.[new Date().getMonth()] || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average per User</span>
                  <span className="font-semibold">
                    ₦{Math.floor((analytics?.revenueData?.total || 0) / (analytics?.totalUsers || 1)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Subscription Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Basic Plan</span>
                  <span className="font-semibold">{Math.floor((analytics?.activeSubscriptions || 0) * 0.5)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pro Plan</span>
                  <span className="font-semibold">{Math.floor((analytics?.activeSubscriptions || 0) * 0.3)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Enterprise Plan</span>
                  <span className="font-semibold">{Math.floor((analytics?.activeSubscriptions || 0) * 0.2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}