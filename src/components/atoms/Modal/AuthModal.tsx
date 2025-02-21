"use client"
import React, { ReactNode, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface GlobalModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const AuthModal: React.FC<GlobalModalProps> = ({ isOpen, onClose, children }) => {
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
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyPress);
    };
  }, [isOpen, handleEscapeKeyPress]);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex bg-black bg-opacity-50 auth-modal w-full justify-center h-full items-center"
      onClick={handleBackgroundClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-content bg-white h-full rounded-md shadow-lg max-w-lg w-full">
        {children}
      </div>
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(0%);
          }
          to {
            transform: translateY(40%);
          }
        }

        .modal-content {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>,
    document.body
  );
};

export default AuthModal;
