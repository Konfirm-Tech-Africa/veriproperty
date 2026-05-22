// app/dashboard/admin/verifications/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search,  
  User, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { verificationService } from '@/app/api/verification';
import { Verification } from '@/app/context/VerificationContext';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalVerifications: number;
  hasNext: boolean;
  hasPrev: boolean;
}

type Agent = string | {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl: string;
  id: string;
};

const getAgentDisplay = (agent: Agent): string => {
  if (typeof agent === 'string') {
    return agent;
  }
  if (typeof agent === 'object' && agent !== null) {
    return agent.name || agent.email || 'Unknown Agent';
  }
  return 'Unknown Agent';
};

export default function VerificationRequests() {
  const [requests, setRequests] = useState<Verification[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Verification | null>(null);
  const [reviewLoading, setReviewLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [adminComment, setAdminComment] = useState('');

  const fetchVerifications = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await verificationService.getAllVerifications(
        page, 
        10, 
        statusFilter === 'all' ? undefined : statusFilter
      );
      console.log("Pending", response);
      setRequests(response.verifications);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch verification requests';
      setError(errorMessage);
      console.error('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications(currentPage);
  }, [currentPage, statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      setReviewLoading(id);
      await verificationService.reviewVerification(
        id, 
        'approved', 
        adminComment || 'Verification approved by admin'
      );
      
      // Refresh the list
      await fetchVerifications(currentPage);
      setSelectedRequest(null);
      setAdminComment('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve verification';
      setError(errorMessage);
    } finally {
      setReviewLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      if (!adminComment.trim()) {
        setError('Please provide a reason for rejection');
        return;
      }

      setReviewLoading(id);
      await verificationService.reviewVerification(
        id, 
        'rejected', 
        adminComment
      );
      
      // Refresh the list
      await fetchVerifications(currentPage);
      setSelectedRequest(null);
      setAdminComment('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject verification';
      setError(errorMessage);
    } finally {
      setReviewLoading(null);
    }
  };

  const handleDownloadDocument = (documentUrl: string, documentName: string) => {
    // Create a temporary link to download the document
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = documentName || 'document';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getIdTypeLabel = (idType: string) => {
    const typeMap: { [key: string]: string } = {
      national_id: 'National ID',
      passport: 'Passport',
      drivers_license: 'Driver\'s License',
      voters_card: 'Voter\'s Card'
    };
    
    return typeMap[idType] || idType;
  };

  const filteredRequests = requests.filter(request =>
    request.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Verification Requests</h1>
            <p className="text-gray-600 mt-2">Review and manage user verification requests</p>
          </div>
          <button
            onClick={() => fetchVerifications(currentPage)}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or ID number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {pagination && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Showing {requests.length} of {pagination.totalVerifications} verification requests
              </p>
            </div>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
            </div>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center p-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No verification requests found</p>
            <p className="text-gray-400 mt-2">
              {statusFilter !== 'all' ? `No ${statusFilter} verification requests` : 'No verification requests submitted yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User & ID Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {request.idNumber}
                          </div>
                          <div className="text-xs text-gray-400">
                            Agent: {getAgentDisplay(request.agent)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getIdTypeLabel(request.idType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(request.submittedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        {request.documents.length} document(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                      {request.adminComment && (
                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                          {request.adminComment}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request._id)}
                              disabled={reviewLoading === request._id}
                              className="text-green-600 hover:text-green-900 flex items-center disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {reviewLoading === request._id ? '...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setAdminComment('');
                              }}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Verification Details</h3>
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setAdminComment('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">User Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Full Name</label>
                        <p className="font-medium">{selectedRequest.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">ID Number</label>
                        <p className="font-medium">{selectedRequest.idNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">ID Type</label>
                        <p className="font-medium">{getIdTypeLabel(selectedRequest.idType)}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Agent</label>
                        <p className="font-medium">{getAgentDisplay(selectedRequest.agent)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Request Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Submitted</label>
                      <p className="font-medium">
                        {new Date(selectedRequest.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedRequest.reviewedAt && (
                      <div>
                        <label className="text-sm text-gray-600">Reviewed</label>
                        <p className="font-medium">
                          {new Date(selectedRequest.reviewedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                  <div className="space-y-3">
                    {selectedRequest.documents.map((doc, index) => (
                      <div key={doc.public_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <span className="font-medium">
                              {doc.originalName || `Document ${index + 1}`}
                            </span>
                            <div className="text-xs text-gray-500">
                              {doc.public_id}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDownloadDocument(doc.url, doc.originalName || `document_${index + 1}`)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Comment */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {selectedRequest.status === 'pending' ? 'Add Review Comment' : 'Admin Comment'}
                  </h4>
                  {selectedRequest.status === 'pending' ? (
                    <textarea
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      rows={3}
                      placeholder="Add comments about this verification request (required for rejection)..."
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-700">
                        {selectedRequest.adminComment || 'No comments provided'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions for pending requests */}
                {selectedRequest.status === 'pending' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={() => handleApprove(selectedRequest._id)}
                      disabled={reviewLoading === selectedRequest._id}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {reviewLoading === selectedRequest._id ? 'Approving...' : 'Approve Verification'}
                    </button>
                    <button
                      onClick={() => handleReject(selectedRequest._id)}
                      disabled={reviewLoading === selectedRequest._id || !adminComment.trim()}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      {reviewLoading === selectedRequest._id ? 'Rejecting...' : 'Reject Request'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}