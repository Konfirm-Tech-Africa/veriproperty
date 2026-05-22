
"use client";
import React, { useState, useMemo } from 'react';
import { 
  Search, Wrench, Clock, CheckCircle, AlertTriangle, 
  User, Phone, DollarSign, 
  MoreVertical, Eye
} from 'lucide-react';

// Define TypeScript interfaces
interface MaintenanceRequest {
  id: string;
  propertyTitle: string;
  propertyId: string;
  tenantName: string;
  tenantContact: string;
  issueType: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  reportedDate: string;
  assignedTo?: string;
  technician?: string;
  technicianContact?: string;
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: string;
  completedDate?: string;
  images?: string[];
}

interface MaintenanceStats {
  totalRequests: number;
  pending: number;
  inProgress: number;
  completed: number;
  highPriority: number;
  totalCost: number;
}

export default function MaintainerDashboard() {
  // Sample maintenance data
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([
    {
      id: 'MNT-001',
      propertyTitle: 'Sunset Apartments #4B',
      propertyId: 'prop-001',
      tenantName: 'John Smith',
      tenantContact: '(555) 123-4567',
      issueType: 'Plumbing - Leaking Faucet',
      priority: 'medium',
      status: 'in-progress',
      description: 'Kitchen faucet leaking continuously, causing water wastage',
      reportedDate: '2024-10-15',
      assignedTo: 'Mike Johnson',
      technician: 'Mike Johnson',
      technicianContact: '(555) 987-6543',
      estimatedCost: 150,
      scheduledDate: '2024-10-16',
      images: ['faucet-leak.jpg']
    },
    {
      id: 'MNT-002',
      propertyTitle: 'Lakeside Condo #12',
      propertyId: 'prop-002',
      tenantName: 'Maria Garcia',
      tenantContact: '(555) 234-5678',
      issueType: 'Electrical - Power Outage',
      priority: 'high',
      status: 'assigned',
      description: 'Complete power outage in living room and kitchen areas',
      reportedDate: '2024-10-16',
      assignedTo: 'Sarah Chen',
      technician: 'Sarah Chen',
      technicianContact: '(555) 876-5432',
      estimatedCost: 300,
      scheduledDate: '2024-10-17'
    },
    {
      id: 'MNT-003',
      propertyTitle: 'Downtown Loft #7A',
      propertyId: 'prop-003',
      tenantName: 'David Johnson',
      tenantContact: '(555) 345-6789',
      issueType: 'HVAC - AC Not Cooling',
      priority: 'high',
      status: 'pending',
      description: 'Air conditioning unit running but not cooling the apartment',
      reportedDate: '2024-10-16',
      estimatedCost: 450
    },
    {
      id: 'MNT-004',
      propertyTitle: 'Sunset Apartments #2C',
      propertyId: 'prop-001',
      tenantName: 'Sarah Chen',
      tenantContact: '(555) 456-7890',
      issueType: 'Appliance - Oven Not Heating',
      priority: 'medium',
      status: 'completed',
      description: 'Electric oven not heating up, display shows error code E3',
      reportedDate: '2024-10-10',
      assignedTo: 'Robert Brown',
      technician: 'Robert Brown',
      technicianContact: '(555) 765-4321',
      estimatedCost: 200,
      actualCost: 180,
      scheduledDate: '2024-10-12',
      completedDate: '2024-10-12'
    },
    {
      id: 'MNT-005',
      propertyTitle: 'Garden Villas #8D',
      propertyId: 'prop-004',
      tenantName: 'James Wilson',
      tenantContact: '(555) 567-8901',
      issueType: 'Emergency - Water Leak',
      priority: 'emergency',
      status: 'in-progress',
      description: 'Major water leak from ceiling, potential structural damage',
      reportedDate: '2024-10-17',
      assignedTo: 'Emergency Team',
      technician: 'Emergency Team',
      technicianContact: '(555) 911-9111',
      estimatedCost: 1200,
      scheduledDate: '2024-10-17'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');

  // Available technicians
  const technicians = [
    { id: 'tech-1', name: 'Mike Johnson', specialty: 'Plumbing', contact: '(555) 987-6543' },
    { id: 'tech-2', name: 'Sarah Chen', specialty: 'Electrical', contact: '(555) 876-5432' },
    { id: 'tech-3', name: 'Robert Brown', specialty: 'Appliances', contact: '(555) 765-4321' },
    { id: 'tech-4', name: 'Emergency Team', specialty: 'Emergency', contact: '(555) 911-9111' },
    { id: 'tech-5', name: 'Carlos Rodriguez', specialty: 'HVAC', contact: '(555) 654-3210' }
  ];

  // Calculate maintenance statistics
  const maintenanceStats: MaintenanceStats = useMemo(() => {
    const totalRequests = maintenanceRequests.length;
    const pending = maintenanceRequests.filter(req => req.status === 'pending').length;
    const inProgress = maintenanceRequests.filter(req => req.status === 'in-progress').length;
    const completed = maintenanceRequests.filter(req => req.status === 'completed').length;
    const highPriority = maintenanceRequests.filter(req => 
      req.priority === 'high' || req.priority === 'emergency'
    ).length;
    const totalCost = maintenanceRequests
      .filter(req => req.actualCost || req.estimatedCost)
      .reduce((sum, req) => sum + (req.actualCost || req.estimatedCost || 0), 0);

    return {
      totalRequests,
      pending,
      inProgress,
      completed,
      highPriority,
      totalCost
    };
  }, [maintenanceRequests]);

  // Filter maintenance requests
  const filteredRequests = useMemo(() => {
    return maintenanceRequests.filter(request => {
      const matchesSearch = 
        request.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
      const matchesProperty = propertyFilter === 'all' || request.propertyId === propertyFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesProperty;
    });
  }, [maintenanceRequests, searchTerm, statusFilter, priorityFilter, propertyFilter]);

  // Get unique properties for filter
  const uniqueProperties = useMemo(() => {
    const properties = [...new Set(maintenanceRequests.map(req => req.propertyId))];
    return properties.map(id => {
      const request = maintenanceRequests.find(req => req.propertyId === id);
      return { id, title: request?.propertyTitle || id };
    });
  }, [maintenanceRequests]);

  const handleAssignTechnician = (requestId: string, technicianId: string) => {
    const technician = technicians.find(tech => tech.id === technicianId);
    if (technician) {
      setMaintenanceRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              assignedTo: technician.name,
              technician: technician.name,
              technicianContact: technician.contact,
              status: 'assigned'
            }
          : req
      ));
    }
  };

  const handleUpdateStatus = (requestId: string, newStatus: MaintenanceRequest['status']) => {
    setMaintenanceRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: newStatus,
            completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : req.completedDate
          }
        : req
    ));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'emergency': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case 'emergency': return `${baseClasses} bg-red-100 text-red-800`;
      case 'high': return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'medium': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low': return `${baseClasses} bg-blue-100 text-blue-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed': return `${baseClasses} bg-green-100 text-green-800`;
      case 'in-progress': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'assigned': return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'cancelled': return `${baseClasses} bg-gray-100 text-gray-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="flex-1 p-8 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Maintenance Management</h1>
          <p className="text-gray-600">Track and manage property maintenance requests</p>
        </div>
        
        {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create New Request
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Generate Report
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Manage Technicians
          </button>
        </div>
      </div>
      </div>

      {/* Maintenance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{maintenanceStats.totalRequests}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{maintenanceStats.pending}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{maintenanceStats.inProgress}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{maintenanceStats.completed}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{maintenanceStats.highPriority}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-purple-600">${maintenanceStats.totalCost.toLocaleString()}</p>
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
              placeholder="Search requests, properties, tenants, or issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="emergency">Emergency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
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

        {/* Maintenance Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Request ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Property & Tenant</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Issue Details</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Technician</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cost</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-mono text-sm font-semibold text-gray-800">{request.id}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.reportedDate).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-800">{request.propertyTitle}</p>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <User className="w-4 h-4 mr-1" />
                        {request.tenantName}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-1" />
                        {request.tenantContact}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-800">{request.issueType}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {request.description}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {getPriorityIcon(request.priority)}
                      <span className={`ml-2 ${getPriorityBadge(request.priority)}`}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={getStatusBadge(request.status)}>
                      {request.status.replace('-', ' ').charAt(0).toUpperCase() + 
                       request.status.replace('-', ' ').slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {request.technician ? (
                      <div>
                        <p className="font-medium text-gray-800">{request.technician}</p>
                        <p className="text-sm text-gray-600">{request.technicianContact}</p>
                      </div>
                    ) : (
                      <select
                        value=""
                        onChange={(e) => handleAssignTechnician(request.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Assign Technician</option>
                        {technicians.map(tech => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name} ({tech.specialty})
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      {request.actualCost ? (
                        <p className="font-semibold text-green-600">${request.actualCost}</p>
                      ) : request.estimatedCost ? (
                        <p className="font-semibold text-blue-600">${request.estimatedCost} (est.)</p>
                      ) : (
                        <p className="text-gray-500">Not estimated</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {request.status !== 'completed' && request.status !== 'cancelled' && (
                        <select
                          value={request.status}
                          onChange={(e) => handleUpdateStatus(request.id, e.target.value as MaintenanceRequest['status'])}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="assigned">Assigned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Complete</option>
                          <option value="cancelled">Cancel</option>
                        </select>
                      )}
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
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
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-8">
              <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No maintenance requests found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}