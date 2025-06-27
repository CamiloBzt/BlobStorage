import { Toast } from 'pendig-fro-transversal-lib-react';
import { ToastOptions } from 'pendig-fro-transversal-lib-react/dist/components/Toast-unique/IToast';
import { useCallback, useState } from 'react';

export interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export const useNotification = () => {
  // Mantener el estado para el NotificationBanner si aún se necesita
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback(
    (type: Notification['type'], message: string) => {
      // Configurar las opciones del Toast según el tipo
      const toastOptions: ToastOptions = {
        $duration: 5000,
        $showCloseButton: true,
        $type: 'soft',
        $shape: 'rounded',
        $position: 'top-right',
        $borderLeft: true,
        $color:
          type === 'success'
            ? 'primary'
            : type === 'error'
            ? 'red'
            : type === 'warning'
            ? 'warning'
            : 'gray',
      };

      // Mostrar el Toast
      Toast.show(message, toastOptions);

      // También actualizar el estado si se necesita para otros componentes
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 5000);
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return { notification, showNotification, hideNotification };
};
