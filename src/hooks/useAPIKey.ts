
import { useState, useEffect } from 'react';

export const useAPIKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for any API key
    const geminiKey = localStorage.getItem('gemini_api_key');
    const openaiKey = localStorage.getItem('openai_api_key');
    
    // Prefer Gemini key if available, otherwise use OpenAI
    const storedKey = geminiKey || openaiKey;
    if (storedKey) {
      setApiKey(storedKey);
    }
    setIsLoading(false);
  }, []);

  const saveApiKey = (key: string, provider: 'gemini' | 'openai' = 'gemini') => {
    const storageKey = provider === 'gemini' ? 'gemini_api_key' : 'openai_api_key';
    localStorage.setItem(storageKey, key);
    setApiKey(key);
    
    // Also sync with the other components that might be using this
    window.dispatchEvent(new CustomEvent('apiKeyUpdated', { detail: { key, provider } }));
  };

  const removeApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('openai_api_key');
    setApiKey(null);
    
    // Notify other components
    window.dispatchEvent(new CustomEvent('apiKeyRemoved'));
  };

  const getApiKey = (provider: 'gemini' | 'openai' = 'gemini'): string | null => {
    const storageKey = provider === 'gemini' ? 'gemini_api_key' : 'openai_api_key';
    return localStorage.getItem(storageKey);
  };

  const hasApiKey = !!apiKey || !!localStorage.getItem('gemini_api_key') || !!localStorage.getItem('openai_api_key');

  return {
    apiKey,
    isLoading,
    saveApiKey,
    removeApiKey,
    getApiKey,
    hasApiKey
  };
};
