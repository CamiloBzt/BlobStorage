import { useState, useCallback } from 'react';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback(
    (type: Notification['type'], message: string) => {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 8000);
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, hideNotification };
};
