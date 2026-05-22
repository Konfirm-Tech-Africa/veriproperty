import React, { useState, useEffect } from 'react';
import { Download, Eye, Search, FileText, Calendar, DollarSign, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  planName: string;
  amount: number;
  currency: string;
  billingPeriod: {
    start: string;
    end: string;
  };
  dueDate: string;
  status: string;
  createdAt: string;
}

interface BillingHistoryResponse {
  success: boolean;
  data: Invoice[];
  totalPages: number;
  page: number;
  message?: string;
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export default function BillingHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

  const fetchInvoices = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(dateFilter !== 'all' && { period: dateFilter }),
      });

      const response = await fetch(`${API_BASE_URL}/subscription/invoices?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch billing history');
      }

      const data: BillingHistoryResponse = await response.json();

      if (data.success) {
        setInvoices(data.data);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page);
      } else {
        const errorMessage = isErrorWithMessage(data) ? data.message : 'Failed to fetch invoices';
        throw new Error(errorMessage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch billing history');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchInvoices(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchInvoices(1);
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/subscription/invoices/${invoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    window.open(`${API_BASE_URL}/subscription/invoices/${invoiceId}/view`, '_blank');
  };

  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'this_year', label: 'This Year' },
    { value: 'last_year', label: 'Last Year' },
  ];

  if (loading && invoices.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Billing History</h3>
        </div>
        <div className="flex justify-center items-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Billing History</h3>
          <p className="text-sm text-gray-600 mt-1">
            View and download your invoice history
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              type="submit"
              className="ml-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Search
            </button>
          </form>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 w-full sm:hidden"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:flex space-y-2 sm:space-y-0 sm:space-x-2`}>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                handleFilterChange();
              }}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                handleFilterChange();
              }}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2" />
            <span className="text-red-800 text-sm sm:text-base">{error}</span>
          </div>
          <button
            onClick={() => fetchInvoices()}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Invoices - Mobile Cards / Desktop Table */}
      <div className="sm:overflow-x-auto">
        {/* Desktop Table */}
        <table className="hidden sm:table w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Invoice</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Plan</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Billing Period</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Due Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 px-4 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No invoices found</p>
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? (
                    <p className="text-sm text-gray-400 mt-1">
                      Try adjusting your search or filters
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1">
                      Your billing history will appear here
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        #{invoice.invoiceNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(invoice.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-700 capitalize">
                      {invoice.planName}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(invoice.billingPeriod.start)} - {formatDate(invoice.billingPeriod.end)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`text-sm ${
                      new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' 
                        ? 'text-red-600 font-medium' 
                        : 'text-gray-600'
                    }`}>
                      {formatDate(invoice.dueDate)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewInvoice(invoice._id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(invoice._id)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-3">
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No invoices found</p>
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? (
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or filters
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-1">
                  Your billing history will appear here
                </p>
              )}
            </div>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice._id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">
                      #{invoice.invoiceNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(invoice.createdAt)}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                </div>

                {/* Plan and Amount */}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 capitalize text-sm">
                    {invoice.planName}
                  </span>
                  <div className="flex items-center">
                    <DollarSign className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="font-semibold text-gray-900 text-sm">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </span>
                  </div>
                </div>

                {/* Billing Period */}
                <div className="flex items-center text-xs text-gray-600">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(invoice.billingPeriod.start)} - {formatDate(invoice.billingPeriod.end)}
                </div>

                {/* Due Date */}
                <div className={`text-xs ${
                  new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' 
                    ? 'text-red-600 font-medium' 
                    : 'text-gray-600'
                }`}>
                  Due: {formatDate(invoice.dueDate)}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleViewInvoice(invoice._id)}
                    className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(invoice._id)}
                    className="flex items-center space-x-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded text-xs transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 pt-4 border-t border-gray-200 space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchInvoices(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => fetchInvoices(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      {invoices.length > 0 && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-gray-600">Total Invoices:</span>
              <span className="font-medium ml-2">{invoices.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Paid:</span>
              <span className="font-medium ml-2">
                {formatCurrency(
                  invoices
                    .filter(inv => inv.status === 'paid')
                    .reduce((sum, inv) => sum + inv.amount, 0),
                  invoices[0]?.currency || 'USD'
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Pending Payments:</span>
              <span className="font-medium ml-2">
                {formatCurrency(
                  invoices
                    .filter(inv => inv.status === 'pending')
                    .reduce((sum, inv) => sum + inv.amount, 0),
                  invoices[0]?.currency || 'USD'
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}