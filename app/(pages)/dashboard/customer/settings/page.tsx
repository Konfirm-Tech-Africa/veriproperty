"use client";
import React, { useState } from 'react';
import SettingsHeader from '@/app/components/dashboard/settings/components/SettingsHeader';
import SettingsTabs from '@/app/components/dashboard/settings/components/SettingsTabs';
import ProfileSettings from '@/app/components/dashboard/settings/components/ProfileSettings';
import EditProfileSettings from '@/app/components/dashboard/settings/components/EditProfileSettings';


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleTabChange = async (tabId: string) => {
    setIsLoading(true);
    setActiveTab(tabId);
    // Simulate loading for complex settings components
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsLoading(false);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving settings...');
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const handleExportSettings = () => {
    const settingsData = {
      exportedAt: new Date().toISOString()
    };
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `property-guru-settings-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'edit-profile':
        return <EditProfileSettings />;
      case 'notifications':
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <SettingsHeader 
        isSaving={isSaving}
        onSave={handleSaveSettings}
        onExport={handleExportSettings}
      />
      
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-lg">
        <SettingsTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <div className="p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}