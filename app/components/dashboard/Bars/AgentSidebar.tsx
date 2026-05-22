"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, User, LogOut, LucideIcon, Menu, X, TableProperties, Plus, Settings, Crown } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';
import { PropertyGuruLogo } from './SuperAdminSidebar';

interface NavigationItem {
    name: string;
    href: string;
    icon?: LucideIcon;
}

interface SidebarProps {
    currentPage: string;
    onNavigate?: (page: string) => void; 
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard/agent', icon: LayoutDashboard },
  { name: 'Properties', href: '/dashboard/agent/properties', icon: TableProperties },
  { name: 'Add Property', href: '/dashboard/agent/properties/add', icon: Plus },
  { name: 'Subscription', href: '/dashboard/agent/subscription', icon: Crown },
  { name: 'Settings', href: '/dashboard/agent/settings', icon: Settings },
  { name: 'Logout', href: '/auth/login', icon: LogOut },
];


export default function AgentSidebar({ currentPage, onNavigate }: SidebarProps) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useUser();

    const handleNavigation = (item: NavigationItem) => {
        router.push(item.href);
        
        // Close mobile menu after navigation
        setIsMobileMenuOpen(false);
        
        if (onNavigate) {
            onNavigate(item.name);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                    <PropertyGuruLogo/>
                    </div>
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-transparent bg-opacity-50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Mobile & Desktop */}
            <aside className={`
                bg-white shadow-md h-screen fixed top-0 left-0 z-40
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:w-64
                ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
            `}>
                {/* Desktop Logo */}
                <div className="hidden lg:flex items-center p-4 ">
                    <PropertyGuruLogo/>
                </div>

                {/* Mobile Header inside sidebar */}
                <div className="lg:hidden flex items-center justify-between p-4 ">
                    <PropertyGuruLogo/>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close menu"
                    >
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex flex-col h-[calc(100vh-80px)]">
                    <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item)}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 w-full text-left cursor-pointer text-sm lg:text-base ${
                                    currentPage === item.name
                                        ? 'bg-red-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                                }`}
                                aria-current={currentPage === item.name ? 'page' : undefined}
                            >
                                {item.icon && <item.icon size={20} />}
                                <span className="flex-1">{item.name}</span>
                            </button>
                        ))}
                    </nav>
                    
                    {/* User Info Section - Desktop Only */}
                    <div className="hidden lg:block p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0 bg-red">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "Agent"}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || "Agent Email"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Spacer */}
            <div className="lg:hidden h-16" />
        </>
    );
}