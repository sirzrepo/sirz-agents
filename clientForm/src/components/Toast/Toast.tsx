'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const toastContent = (
    <div className={`${styles.toast} ${styles[type]}`}>
      {type === 'success' && (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
    </div>
  );

  // Only create portal if we're in the browser
  if (typeof document === 'undefined') return null;
  
  return createPortal(toastContent, document.body);
};

export default Toast; 