import React from 'react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';

interface ConfirmRejectProps {
  isOpen: boolean;
  onClose: () => void;
  requisition: { id: string; name: string };
  handleConfirm: (requisitionId: string) => void;
}

const ConfirmReject = ({ isOpen, onClose, requisition, handleConfirm }: ConfirmRejectProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 text-center flex flex-col gap-2 px-10 py-10">
        <strong className="text-[24px] text-[#2D2D2D] mb-4 font-bold">Reject {requisition.name}</strong>
        <p className='text-[#2D2D2D] text-[16px] font-[400]'>Are you sure you want to reject {requisition.name}?</p>
        <div className="flex gap-10 mt-4 w-full justify-center">
          <Button onClick={onClose} className="bg-[#EEEEEE] text-black py-2 flex justify-center items-center text-white rounded-md">
            Cancel
          </Button>
          <Button onClick={() => handleConfirm(requisition.id)} className="bg-[#F10000] py-2 flex justify-center items-center text-white rounded-md">
            Reject
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmReject;