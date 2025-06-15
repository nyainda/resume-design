
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Brain, 
  BarChart3, 
  Search, 
  User, 
  Bell, 
  Settings as SettingsIcon 
} from 'lucide-react';

interface MobileNavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentView, setCurrentView }) => {
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'ats', label: 'ATS', icon: Brain },
    { id: 'tracking', label: 'Tracking', icon: BarChart3 },
    { id: 'jobs', label: 'Jobs', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 py-2 shadow-sm dark:shadow-gray-950/20">
      <div className="flex space-x-1 overflow-x-auto hide-scrollbar">
        {navigationItems.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={currentView === id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView(id)}
            className={`flex items-center gap-1 whitespace-nowrap text-xs px-2 sm:px-3 py-1 sm:py-2 ${
              currentView === id 
                ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
