
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface UseAutosaveOptions {
  data: any;
  onSave: () => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export const useAutosave = ({ data, onSave, delay = 2000, enabled = true }: UseAutosaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);
  const lastSavedData = useRef<string>('');

  const debouncedSave = useCallback(async () => {
    try {
      await onSave();
      console.log('Autosave completed successfully');
    } catch (error) {
      console.error('Autosave failed:', error);
      toast.error('Failed to autosave changes');
    }
  }, [onSave]);

  useEffect(() => {
    if (!enabled) return;

    const currentDataString = JSON.stringify(data);
    
    // Skip autosave on initial mount or if data hasn't changed
    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastSavedData.current = currentDataString;
      return;
    }

    if (currentDataString === lastSavedData.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for autosave
    timeoutRef.current = setTimeout(() => {
      debouncedSave();
      lastSavedData.current = currentDataString;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debouncedSave, delay, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
