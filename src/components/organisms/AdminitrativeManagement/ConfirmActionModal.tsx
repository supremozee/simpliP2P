"use client";

import React from 'react';
import Modal from '@/components/atoms/Modal';
import Button from '@/components/atoms/Button';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => Promise<void>;
  isProcessing?: boolean;
}

const ConfirmActionModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  confirmText,
  onConfirm,
  isProcessing = false
}: ConfirmActionModalProps) => {
  
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 text-center flex flex-col gap-2 px-10 py-10">
        <strong className="text-[24px] text-[#2D2D2D] mb-4 font-bold">{title}</strong>
        <p className='text-[#2D2D2D] text-[16px] font-[400]'>{message}</p>
        <div className="flex gap-10 mt-4 w-full justify-center">
          <Button 
            onClick={onClose} 
            className="bg-[#EEEEEE] text-black py-2 flex justify-center items-center rounded-md"
            disabled={isProcessing}
          >
            <span className="text-[12px]">Cancel</span>
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="bg-[#F10000] py-2 flex justify-center items-center text-white rounded-md"
            disabled={isProcessing}
          >
            <span className="text-[12px]">{isProcessing ? "Processing..." : confirmText}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmActionModal;