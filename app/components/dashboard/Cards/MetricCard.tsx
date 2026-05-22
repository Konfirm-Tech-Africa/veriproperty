"use client";
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Building, 
  DollarSign, 
  Users,
  Eye,
  Heart,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string;
    isHighlight?: boolean;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    subtitle?: string;
}

// Icon mapping for common metrics
const getDefaultIcon = (title: string) => {
    const iconConfig: { [key: string]: React.ReactNode } = {
        'Total Property': <Home className="w-5 h-5" />,
        'Total Properties': <Home className="w-5 h-5" />,
        'Total Unit': <Building className="w-5 h-5" />,
        'Total Units': <Building className="w-5 h-5" />,
        'Total Income': <DollarSign className="w-5 h-5" />,
        'Monthly Income': <DollarSign className="w-5 h-5" />,
        'Total Expense': <DollarSign className="w-5 h-5" />,
        'Monthly Expenses': <DollarSign className="w-5 h-5" />,
        'Total Users': <Users className="w-5 h-5" />,
        'Total Views': <Eye className="w-5 h-5" />,
        'Total Favorites': <Heart className="w-5 h-5" />,
        'Average Rating': <Star className="w-5 h-5" />,
        'Active Listings': <Calendar className="w-5 h-5" />,
        'Locations': <MapPin className="w-5 h-5" />
    };
    
    return iconConfig[title] || <Home className="w-5 h-5" />;
};

export default function MetricCard({ 
    title, 
    value, 
    isHighlight = false, 
    icon,
    trend,
    trendValue,
    subtitle 
}: MetricCardProps) {
    const displayIcon = icon || getDefaultIcon(title);
    
    const getTrendColor = () => {
        if (isHighlight) {
            return trend === 'up' ? 'text-green-300' : 
                   trend === 'down' ? 'text-red-300' : 'text-blue-300';
        }
        return trend === 'up' ? 'text-green-600' : 
               trend === 'down' ? 'text-red-600' : 'text-gray-400';
    };

    const getTrendIcon = () => {
        if (trend === 'up') {
            return <TrendingUp className="w-4 h-4" />;
        } else if (trend === 'down') {
            return <TrendingDown className="w-4 h-4" />;
        }
        return null;
    };

    return (
        <div className={`rounded-xl shadow-lg p-6 w-full transition-all duration-200 hover:shadow-xl ${
            isHighlight 
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                : 'bg-white text-gray-800 border border-gray-100'
        }`}>
            {/* Header with Icon and Title */}
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${
                    isHighlight ? 'bg-blue-500' : 'bg-blue-50'
                }`}>
                    <div className={isHighlight ? 'text-white' : 'text-blue-600'}>
                        {displayIcon}
                    </div>
                </div>
                
                {/* Trend Indicator */}
                {trend && trendValue && (
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        isHighlight 
                            ? trend === 'up' ? 'bg-green-500/20 text-green-300' : 
                              trend === 'down' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                            : trend === 'up' ? 'bg-green-50 text-green-700' : 
                              trend === 'down' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'
                    }`}>
                        {getTrendIcon()}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div>
                <h3 className={`text-sm font-semibold mb-2 ${
                    isHighlight ? 'text-blue-200' : 'text-gray-500'
                }`}>
                    {title}
                </h3>
                
                <p className={`text-2xl font-bold mb-1 ${
                    isHighlight ? 'text-white' : 'text-gray-900'
                }`}>
                    {value}
                </p>
                
                {subtitle && (
                    <p className={`text-xs ${
                        isHighlight ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Trend line for visual effect */}
            {trend && (
                <div className="mt-4 h-1 rounded-full overflow-hidden">
                    <div className={`h-full ${
                        trend === 'up' ? 'bg-green-500' : 
                        trend === 'down' ? 'bg-red-500' : 'bg-gray-300'
                    }`}></div>
                </div>
            )}
        </div>
    );
}