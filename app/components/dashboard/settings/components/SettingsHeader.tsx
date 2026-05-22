
import { Download } from 'lucide-react';

interface SettingsHeaderProps {
  isSaving: boolean;
  onSave: () => void;
  onExport: () => void;
}

export default function SettingsHeader({ onExport }: SettingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
      {/* Title Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage your account preferences and system settings
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-3">
        {/* Export Button */}
        <button
          onClick={onExport}
          className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
        >
          <Download className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Export Settings</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>
    </div>
  );
}