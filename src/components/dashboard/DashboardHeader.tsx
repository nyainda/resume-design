
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  Sparkles,
  Brain,
  BarChart3,
  Search,
  Bell,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface DashboardHeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentView, setCurrentView }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'ats', label: 'ATS Checker', icon: Brain },
    { id: 'tracking', label: 'Tracking', icon: BarChart3 },
    { id: 'jobs', label: 'Jobs', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-40 shadow-sm dark:shadow-gray-950/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 min-w-0 flex-1">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent truncate">
                  Resume Builder Pro
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">AI-Powered Career Tools</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={currentView === id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView(id)}
                  className={`flex items-center gap-1 xl:gap-2 text-xs xl:text-sm px-2 xl:px-3 ${
                    currentView === id 
                      ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-3 h-3 xl:w-4 xl:h-4" />
                  <span className="hidden xl:inline">{label}</span>
                </Button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 shrink-0">
            <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/50 dark:to-blue-900/50 text-green-800 dark:text-green-300 border-0 shadow-sm text-xs hidden sm:flex">
              <Sparkles className="w-3 h-3 mr-1" />
              Pro
            </Badge>
            
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-2">
              {theme === 'light' ? <Moon className="h-3 w-3 sm:h-4 sm:w-4" /> : <Sun className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 sm:px-3 py-1 border dark:border-gray-700 max-w-[120px] sm:max-w-none">
              <User className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline truncate">{user?.email}</span>
              <span className="sm:hidden">User</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut()}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 p-2"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
