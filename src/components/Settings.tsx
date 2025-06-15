import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Key, 
  Bell, 
  Shield,
  Save,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Lock
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  const [testingOpenai, setTestingOpenai] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadSettings();
    
    // Listen for API key updates from other components
    const handleApiKeyUpdate = (event: CustomEvent) => {
      const { key, provider } = event.detail;
      if (provider === 'gemini') {
        setGeminiApiKey(key);
      } else if (provider === 'openai') {
        setOpenaiApiKey(key);
      }
    };

    const handleApiKeyRemoved = () => {
      setGeminiApiKey('');
      setOpenaiApiKey('');
    };

    window.addEventListener('apiKeyUpdated', handleApiKeyUpdate as EventListener);
    window.addEventListener('apiKeyRemoved', handleApiKeyRemoved);

    return () => {
      window.removeEventListener('apiKeyUpdated', handleApiKeyUpdate as EventListener);
      window.removeEventListener('apiKeyRemoved', handleApiKeyRemoved);
    };
  }, []);

  const loadSettings = async () => {
    try {
      const storedGeminiKey = localStorage.getItem('gemini_api_key');
      const storedOpenaiKey = localStorage.getItem('openai_api_key');
      
      if (storedGeminiKey) {
        setGeminiApiKey(storedGeminiKey);
      }
      if (storedOpenaiKey) {
        setOpenaiApiKey(storedOpenaiKey);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setChangingPassword(true);
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email!,
        password: currentPassword
      });

      if (signInError) {
        toast.error('Current password is incorrect');
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error('Failed to update password: ' + error.message);
        return;
      }

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const saveGeminiApiKey = async () => {
    if (!geminiApiKey.trim()) {
      toast.error('Please enter a valid Gemini API key');
      return;
    }

    if (!geminiApiKey.startsWith('AIza')) {
      toast.error('Invalid Gemini API key format. It should start with "AIza"');
      return;
    }

    setSaving(true);
    try {
      localStorage.setItem('gemini_api_key', geminiApiKey);
      
      window.dispatchEvent(new CustomEvent('apiKeyUpdated', { 
        detail: { key: geminiApiKey, provider: 'gemini' } 
      }));
      
      toast.success('Gemini API key saved successfully!');
    } catch (error) {
      console.error('Error saving Gemini API key:', error);
      toast.error('Failed to save Gemini API key');
    } finally {
      setSaving(false);
    }
  };

  const saveOpenaiApiKey = async () => {
    if (!openaiApiKey.trim()) {
      toast.error('Please enter a valid OpenAI API key');
      return;
    }

    if (!openaiApiKey.startsWith('sk-')) {
      toast.error('Invalid OpenAI API key format. It should start with "sk-"');
      return;
    }

    setSaving(true);
    try {
      localStorage.setItem('openai_api_key', openaiApiKey);
      
      window.dispatchEvent(new CustomEvent('apiKeyUpdated', { 
        detail: { key: openaiApiKey, provider: 'openai' } 
      }));
      
      toast.success('OpenAI API key saved successfully!');
    } catch (error) {
      console.error('Error saving OpenAI API key:', error);
      toast.error('Failed to save OpenAI API key');
    } finally {
      setSaving(false);
    }
  };

  const testGeminiConnection = async () => {
    if (!geminiApiKey) {
      toast.error('Please enter your Gemini API key first');
      return;
    }

    setTestingGemini(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, this is a test message.'
            }]
          }]
        })
      });

      if (response.ok) {
        toast.success('Gemini API connection successful!');
      } else {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        toast.error('Gemini API connection failed. Please check your API key.');
      }
    } catch (error) {
      console.error('Error testing Gemini connection:', error);
      toast.error('Failed to test Gemini API connection');
    } finally {
      setTestingGemini(false);
    }
  };

  const testOpenaiConnection = async () => {
    if (!openaiApiKey) {
      toast.error('Please enter your OpenAI API key first');
      return;
    }

    setTestingOpenai(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Hello, this is a test.' }],
          max_tokens: 5
        })
      });

      if (response.ok) {
        toast.success('OpenAI API connection successful!');
      } else {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        toast.error('OpenAI API connection failed. Please check your API key.');
      }
    } catch (error) {
      console.error('Error testing OpenAI connection:', error);
      toast.error('Failed to test OpenAI API connection');
    } finally {
      setTestingOpenai(false);
    }
  };

  const removeAllApiKeys = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('openai_api_key');
    setGeminiApiKey('');
    setOpenaiApiKey('');
    
    window.dispatchEvent(new CustomEvent('apiKeyRemoved'));
    
    toast.success('All API keys removed successfully');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <SettingsIcon className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account preferences and integrations
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred color scheme
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4" />
                  <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={toggleTheme}
                  />
                  <Moon className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={changePassword} 
                  disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full md:w-auto"
                >
                  {changingPassword ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4 mr-2" />
                  )}
                  {changingPassword ? 'Changing Password...' : 'Change Password'}
                </Button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Password Requirements:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>At least 6 characters long</li>
                  <li>Different from your current password</li>
                  <li>Use a combination of letters, numbers, and symbols for better security</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                AI Integrations
                {(geminiApiKey || openaiApiKey) && (
                  <div className="flex items-center gap-1 ml-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Gemini API Key Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Required for AI-powered resume optimization and job description parsing
                  </p>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="gemini-key"
                        type={showGeminiKey ? "text" : "password"}
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        placeholder="AIza..."
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                      >
                        {showGeminiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <Button 
                      onClick={saveGeminiApiKey} 
                      disabled={saving || !geminiApiKey}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                  
                  {geminiApiKey && (
                    <Button 
                      variant="outline" 
                      onClick={testGeminiConnection}
                      disabled={testingGemini}
                      className="mt-2"
                    >
                      {testingGemini ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Test Gemini Connection
                    </Button>
                  )}
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    How to get your Gemini API key:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy and paste the key here</li>
                  </ol>
                </div>
              </div>

              {/* OpenAI API Key Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="openai-key">OpenAI API Key (Optional)</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Alternative AI provider for resume optimization
                  </p>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="openai-key"
                        type={showOpenaiKey ? "text" : "password"}
                        value={openaiApiKey}
                        onChange={(e) => setOpenaiApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                      >
                        {showOpenaiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <Button 
                      onClick={saveOpenaiApiKey} 
                      disabled={saving || !openaiApiKey}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                  
                  {openaiApiKey && (
                    <Button 
                      variant="outline" 
                      onClick={testOpenaiConnection}
                      disabled={testingOpenai}
                      className="mt-2"
                    >
                      {testingOpenai ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Test OpenAI Connection
                    </Button>
                  )}
                </div>
                
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
                    How to get your OpenAI API key:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-orange-800 dark:text-orange-200">
                    <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a></li>
                    <li>Sign in with your OpenAI account</li>
                    <li>Click "Create new secret key"</li>
                    <li>Copy and paste the key here</li>
                  </ol>
                </div>
              </div>

              {/* Remove Keys Section */}
              {(geminiApiKey || openaiApiKey) && (
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={removeAllApiKeys}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Remove All API Keys
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Notification preferences will be available after the database types are updated. 
                  You can currently view and manage your notifications from the notifications center.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
