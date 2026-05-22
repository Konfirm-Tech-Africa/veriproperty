"use client";
import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import Image from 'next/image';

export default function Topbar() {
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Globe size={16} />
                <span>English</span>
                <ChevronDown size={16} />
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-800 font-semibold">kamrul</span>
                    <Image
                        src="/user-avatar.png"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-gray-300"
                    />
                </div>
                <div className="text-sm text-gray-500">
                    <p>TID: 25545</p>
                </div>
            </div>
        </header>
    );
}
