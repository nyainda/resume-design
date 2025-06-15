
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Palette, Save, User } from 'lucide-react';

interface Preferences {
  theme: string;
  defaultTemplate: number;
  autoSave: boolean;
  notifications: boolean;
  language: string;
}

const PersonalizationPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'light',
    defaultTemplate: 0,
    autoSave: true,
    notifications: true,
    language: 'en'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // Load from localStorage for now
      const stored = localStorage.getItem('user_preferences');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      // Save to localStorage for now
      localStorage.setItem('user_preferences', JSON.stringify(preferences));
      
      toast({
        title: "Success",
        description: "Preferences saved successfully"
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof Preferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personalization</h2>
      </div>

      <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-xl">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-gray-700 dark:text-gray-300 font-medium">Theme</Label>
              <Select 
                value={preferences.theme} 
                onValueChange={(value) => updatePreference('theme', value)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="light" className="hover:bg-gray-100 dark:hover:bg-gray-700">Light</SelectItem>
                  <SelectItem value="dark" className="hover:bg-gray-100 dark:hover:bg-gray-700">Dark</SelectItem>
                  <SelectItem value="auto" className="hover:bg-gray-100 dark:hover:bg-gray-700">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultTemplate" className="text-gray-700 dark:text-gray-300 font-medium">Default Template</Label>
              <Select 
                value={preferences.defaultTemplate.toString()} 
                onValueChange={(value) => updatePreference('defaultTemplate', parseInt(value))}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="0" className="hover:bg-gray-100 dark:hover:bg-gray-700">Modern Professional</SelectItem>
                  <SelectItem value="1" className="hover:bg-gray-100 dark:hover:bg-gray-700">Executive Leadership</SelectItem>
                  <SelectItem value="2" className="hover:bg-gray-100 dark:hover:bg-gray-700">Classic Corporate</SelectItem>
                  <SelectItem value="3" className="hover:bg-gray-100 dark:hover:bg-gray-700">Creative Designer</SelectItem>
                  <SelectItem value="4" className="hover:bg-gray-100 dark:hover:bg-gray-700">Tech Specialist</SelectItem>
                  <SelectItem value="5" className="hover:bg-gray-100 dark:hover:bg-gray-700">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-gray-700 dark:text-gray-300 font-medium">Language</Label>
              <Select 
                value={preferences.language} 
                onValueChange={(value) => updatePreference('language', value)}
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="en" className="hover:bg-gray-100 dark:hover:bg-gray-700">English</SelectItem>
                  <SelectItem value="es" className="hover:bg-gray-100 dark:hover:bg-gray-700">Spanish</SelectItem>
                  <SelectItem value="fr" className="hover:bg-gray-100 dark:hover:bg-gray-700">French</SelectItem>
                  <SelectItem value="de" className="hover:bg-gray-100 dark:hover:bg-gray-700">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <Label className="text-gray-900 dark:text-white font-medium">Auto Save</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically save changes as you type
                </p>
              </div>
              <Switch 
                checked={preferences.autoSave}
                onCheckedChange={(checked) => updatePreference('autoSave', checked)}
                className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <Label className="text-gray-900 dark:text-white font-medium">Notifications</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications about updates
                </p>
              </div>
              <Switch 
                checked={preferences.notifications}
                onCheckedChange={(checked) => updatePreference('notifications', checked)}
                className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>

          <Button 
            onClick={savePreferences} 
            disabled={saving}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizationPanel;
