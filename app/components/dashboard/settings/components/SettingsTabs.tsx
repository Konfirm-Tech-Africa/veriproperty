
import { User } from 'lucide-react';

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: User, mobileLabel: 'Profile' },
];

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="border-b border-gray-200">
      {/* Desktop Tabs */}
      <nav className="hidden sm:flex space-x-6 lg:space-x-8 px-4 lg:px-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IconComponent className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Tabs - Scrollable with icons only */}
      <nav className="sm:hidden flex space-x-4 px-4 overflow-x-auto scrollbar-hide py-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 py-3 px-3 rounded-lg font-medium text-xs transition-colors whitespace-nowrap flex-shrink-0 min-w-[60px] ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-center leading-tight">{tab.mobileLabel}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}