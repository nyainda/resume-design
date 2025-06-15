
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Key, Sparkles, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useAPIKey } from '@/hooks/useAPIKey';
import { toast } from 'sonner';

interface AIIntegrationProps {
  onOptimizeResume?: (resumeData: any) => Promise<any>;
  onGenerateContent?: (prompt: string) => Promise<string>;
}

const AIIntegration: React.FC<AIIntegrationProps> = ({ onOptimizeResume, onGenerateContent }) => {
  const { apiKey, saveApiKey, removeApiKey, getApiKey, hasApiKey } = useAPIKey();
  const [newApiKey, setNewApiKey] = useState('');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyProvider, setKeyProvider] = useState<'gemini' | 'openai'>('gemini');

  const handleSaveApiKey = () => {
    if (!newApiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    // Basic validation
    if (keyProvider === 'gemini' && !newApiKey.startsWith('AIza')) {
      toast.error('Invalid Gemini API key format');
      return;
    }

    if (keyProvider === 'openai' && !newApiKey.startsWith('sk-')) {
      toast.error('Invalid OpenAI API key format');
      return;
    }

    saveApiKey(newApiKey, keyProvider);
    setNewApiKey('');
    toast.success(`${keyProvider === 'gemini' ? 'Gemini' : 'OpenAI'} API key saved successfully!`);
  };

  const testApiKey = async () => {
    const currentKey = getApiKey(keyProvider);
    if (!currentKey) {
      toast.error('No API key found to test');
      return;
    }

    setIsTestingKey(true);
    try {
      if (keyProvider === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${currentKey}`, {
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
          toast.success('Gemini API key is working!');
        } else {
          toast.error('Gemini API key test failed');
        }
      } else if (keyProvider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Hello, this is a test.' }],
            max_tokens: 5
          })
        });

        if (response.ok) {
          toast.success('OpenAI API key is working!');
        } else {
          toast.error('OpenAI API key test failed');
        }
      }
    } catch (error) {
      toast.error('API key test failed');
    } finally {
      setIsTestingKey(false);
    }
  };

  const generateSampleContent = async () => {
    const currentKey = getApiKey(keyProvider);
    if (!currentKey) {
      toast.error('Please add an API key first');
      return;
    }

    try {
      let content = '';
      if (keyProvider === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${currentKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: 'Write a professional summary for a software engineer with 3 years of experience in React and Node.js'
              }]
            }]
          })
        });

        const data = await response.json();
        content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sample content generated';
      } else if (keyProvider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ 
              role: 'user', 
              content: 'Write a professional summary for a software engineer with 3 years of experience in React and Node.js'
            }],
            max_tokens: 150
          })
        });

        const data = await response.json();
        content = data.choices?.[0]?.message?.content || 'Sample content generated';
      }

      toast.success('AI content generated successfully!');
      console.log('Generated content:', content);
    } catch (error) {
      toast.error('Failed to generate content');
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Integration
          {hasApiKey && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={keyProvider} onValueChange={(value) => setKeyProvider(value as 'gemini' | 'openai')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gemini">Gemini AI</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
          </TabsList>

          <TabsContent value="gemini" className="space-y-4">
            <div className="space-y-2">
              <Label>Gemini API Key</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="AIza..."
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                />
                <Button onClick={handleSaveApiKey} size="sm">
                  <Key className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
              <p className="text-xs text-gray-600">
                Get your free API key from{' '}
                <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google AI Studio
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="openai" className="space-y-4">
            <div className="space-y-2">
              <Label>OpenAI API Key</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                />
                <Button onClick={handleSaveApiKey} size="sm">
                  <Key className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
              <p className="text-xs text-gray-600">
                Get your API key from{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  OpenAI Platform
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {hasApiKey && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={testApiKey}
              disabled={isTestingKey}
              className="flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              {isTestingKey ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generateSampleContent}
              className="flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Generate Sample
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={removeApiKey}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <AlertCircle className="w-3 h-3" />
              Remove Key
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>AI Features Available:</strong>
          <ul className="mt-1 space-y-0.5">
            <li>• Intelligent resume content generation</li>
            <li>• ATS optimization suggestions</li>
            <li>• Professional summary writing</li>
            <li>• Experience bullet point enhancement</li>
            <li>• Skills matching and recommendations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIIntegration;
