
import React from 'react';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  show: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type, show }) => {
  if (!show) {
    return null;
  }

  const typeStyles = {
    success: {
      bg: 'bg-green-500',
      icon: <CheckCircleIcon className="w-6 h-6 mr-3 flex-shrink-0" />,
    },
    error: {
      bg: 'bg-red-500',
      icon: <XCircleIcon className="w-6 h-6 mr-3 flex-shrink-0" />,
    },
  };

  const styles = typeStyles[type];

  return (
    <div
      className={`toast-notification fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center text-white px-6 py-3 rounded-lg shadow-lg ${styles.bg}`}
      role="alert"
    >
      {styles.icon}
      <p className="font-semibold">{message}</p>
    </div>
  );
};

export default Toast;
