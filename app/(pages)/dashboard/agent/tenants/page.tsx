
"use client";
import React, { useState, useMemo } from 'react';
import { Search, MoreVertical, Mail, Phone, FileText, AlertTriangle, CheckCircle, Clock, Users, DollarSign } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  propertyId: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  status: 'current' | 'late' | 'overdue';
  lastPaymentDate?: string;
  balanceDue: number;
  daysLate?: number;
}

interface PaymentStats {
  totalTenants: number;
  currentPayments: number;
  latePayments: number;
  overduePayments: number;
  totalMonthlyRent: number;
}

export default function TenantManagementPage() {
  // Sample tenant data - replace with actual API data
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      title: 'Sunset Apartments #4B',
      propertyId: 'prop-001',
      leaseStart: '2024-01-01',
      leaseEnd: '2024-12-31',
      monthlyRent: 1850,
      status: 'current',
      lastPaymentDate: '2024-10-01',
      balanceDue: 0
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria.g@email.com',
      phone: '(555) 234-5678',
      title: 'Lakeside Condo #12',
      propertyId: 'prop-002',
      leaseStart: '2023-11-15',
      leaseEnd: '2024-11-14',
      monthlyRent: 2200,
      status: 'late',
      lastPaymentDate: '2024-09-28',
      balanceDue: 2200,
      daysLate: 5
    },
    {
      id: '3',
      name: 'David Johnson',
      email: 'david.j@email.com',
      phone: '(555) 345-6789',
      title: 'Downtown Loft #7A',
      propertyId: 'prop-003',
      leaseStart: '2024-03-01',
      leaseEnd: '2025-02-28',
      monthlyRent: 1950,
      status: 'overdue',
      lastPaymentDate: '2024-08-30',
      balanceDue: 3900,
      daysLate: 34
    },
    {
      id: '4',
      name: 'Sarah Chen',
      email: 's.chen@email.com',
      phone: '(555) 456-7890',
      title: 'Sunset Apartments #2C',
      propertyId: 'prop-001',
      leaseStart: '2024-02-15',
      leaseEnd: '2025-02-14',
      monthlyRent: 1750,
      status: 'current',
      lastPaymentDate: '2024-10-03',
      balanceDue: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');

  // Calculate payment statistics
  const paymentStats: PaymentStats = useMemo(() => {
    const totalTenants = tenants.length;
    const currentPayments = tenants.filter(t => t.status === 'current').length;
    const latePayments = tenants.filter(t => t.status === 'late').length;
    const overduePayments = tenants.filter(t => t.status === 'overdue').length;
    const totalMonthlyRent = tenants.reduce((sum, tenant) => sum + tenant.monthlyRent, 0);
    
    return {
      totalTenants,
      currentPayments,
      latePayments,
      overduePayments,
      totalMonthlyRent
    };
  }, [tenants]);

  // Filter tenants based on search and filters
  const filteredTenants = useMemo(() => {
    return tenants.filter(tenant => {
      const matchesSearch = 
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
      const matchesProperty = propertyFilter === 'all' || tenant.propertyId === propertyFilter;
      
      return matchesSearch && matchesStatus && matchesProperty;
    });
  }, [tenants, searchTerm, statusFilter, propertyFilter]);

  // Get unique properties for filter dropdown
  const uniqueProperties = useMemo(() => {
    const properties = [...new Set(tenants.map(tenant => tenant.propertyId))];
    return properties.map(id => {
      const tenant = tenants.find(t => t.propertyId === id);
      return { id, title: tenant?.title || id };
    });
  }, [tenants]);

  const handleSendReminder = (tenantId: string) => {
    // Implement reminder logic
    console.log('Sending reminder to tenant:', tenantId);
    alert('Payment reminder sent!');
  };

  const handleViewLease = (tenantId: string) => {
    // Implement lease viewing logic
    console.log('Viewing lease for tenant:', tenantId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'late': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'current': return `${baseClasses} bg-green-100 text-green-800`;
      case 'late': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'overdue': return `${baseClasses} bg-red-100 text-red-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="flex-1 p-8 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tenant Management</h1>
          <p className="text-gray-600">Manage your tenants and track rent payments</p>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-800">{paymentStats.totalTenants}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current</p>
              <p className="text-2xl font-bold text-green-600">{paymentStats.currentPayments}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{paymentStats.latePayments}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{paymentStats.overduePayments}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
              <p className="text-2xl font-bold text-purple-600">${paymentStats.totalMonthlyRent.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tenants, properties, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="current">Current</option>
              <option value="late">Late</option>
              <option value="overdue">Overdue</option>
            </select>
            
            {/* Property Filter */}
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Properties</option>
              {uniqueProperties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Tenant</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Lease</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Balance</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {tenant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{tenant.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-gray-800">{tenant.title}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {tenant.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <p className="text-gray-800">{new Date(tenant.leaseStart).toLocaleDateString()}</p>
                      <p className="text-gray-500">to {new Date(tenant.leaseEnd).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-gray-800">${tenant.monthlyRent.toLocaleString()}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getStatusIcon(tenant.status)}
                      <span className={`ml-2 ${getStatusBadge(tenant.status)}`}>
                        {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                        {tenant.daysLate && ` (${tenant.daysLate}d)`}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className={`font-semibold ${tenant.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {tenant.balanceDue > 0 ? `$${tenant.balanceDue.toLocaleString()}` : 'Paid'}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {tenant.status !== 'current' && (
                        <button
                          onClick={() => handleSendReminder(tenant.id)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Send Payment Reminder"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleViewLease(tenant.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Lease"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTenants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No tenants found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}