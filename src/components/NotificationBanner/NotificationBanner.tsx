import { Notification } from '@/hooks/useNotification';
import { Icon } from 'pendig-fro-transversal-lib-react';
import React from 'react';

interface NotificationBannerProps {
  notification: Notification;
  onClose: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onClose,
}) => {
  const iconNames = {
    success: 'done' as const,
    error: 'errorOutline' as const,
    warning: 'warningAmber' as const,
    info: 'info' as const,
  };

  return (
    <div
      className={`notification-banner notification-banner--${notification.type}`}
    >
      <div className="notification-banner__content">
        <Icon
          $name={iconNames[notification.type]}
          $w="1.25rem"
          $h="1.25rem"
          className="notification-banner__icon"
        />
        {notification.message}
      </div>
      <button
        onClick={onClose}
        className="notification-banner__close-button"
        aria-label="Cerrar notificación"
      >
        <Icon $name="close" $w="1.25rem" $h="1.25rem" />
      </button>
    </div>
  );
};
