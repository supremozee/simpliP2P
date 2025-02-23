"use client"
import React, { ReactNode, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface GlobalModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const AuthModal: React.FC<GlobalModalProps> = ({ 
  isOpen, 
  onClose, 
  children,
  size = 'md' 
}) => {
  const handleEscapeKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKeyPress);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKeyPress]);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm auth-modal w-full justify-center items-center p-4 overflow-y-auto"
      onClick={handleBackgroundClick}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`modal-content bg-white rounded-xl shadow-2xl ${sizeClasses[size]} w-full relative overflow-hidden`}
      >
        {children}
      </div>
      <style jsx>{`
        @keyframes modal-fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes modal-fade-out {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .modal-content {
          animation: modal-fade-in 0.2s ease-out forwards;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }

        .auth-modal {
          animation: fade-in 0.15s ease-out forwards;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default AuthModal;
