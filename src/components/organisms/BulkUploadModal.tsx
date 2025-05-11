import React, { useState, useRef } from 'react';
import { FiUpload, FiDownload, FiX } from 'react-icons/fi';
import Button from '../atoms/Button';
import { motion } from 'framer-motion';
import useBulkUpload from '@/hooks/useBulkUpload';
import useStore from '@/store';
import Modal from '../atoms/Modal';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentOrg } = useStore();
  const { bulkUploadProduct, loading, errorMessage } = useBulkUpload();

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      alert("Please upload an Excel or CSV file");
      return false;
    }
    return true;
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const template = `name,description,unitPrice,currency,stockQty,stockQtyAlert,unitOfMeasure,category,productCode,image_url
Sample Product 1,Product description here,1000,NGN,50,10,pcs,Electronics,PROD-001,https://example.com/image.jpg
Sample Product 2,Another product description,2500,NGN,100,20,pcs,Office Supplies,PROD-002,`;

    const blob = new Blob([template], { type: 'text/xlsx' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory_upload_template.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await bulkUploadProduct(currentOrg, selectedFile);
      setSelectedFile(null);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bulk Upload Inventory">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Upload Your Inventory Data</h2>
          <p className="text-sm text-gray-600">
            Upload your inventory data in bulk using an Excel or CSV file. Make sure to follow the required format.
          </p>
        </div>

        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden"
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv" 
          />
          
          <div className="flex flex-col items-center justify-center py-5">
            {selectedFile ? (
              <>
                <div className="text-green-500 text-4xl mb-3">
                  <FiUpload />
                </div>
                <p className="text-sm font-semibold text-gray-700">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <button 
                  className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  <FiX className="mr-1" /> Remove file
                </button>
              </>
            ) : (
              <>
                <FiUpload className="text-gray-400 text-4xl mb-4" />
                <h3 className="text-gray-700 font-medium mb-2">Drag and drop your file here</h3>
                <p className="text-gray-500 text-sm mb-3">or click to browse</p>
                <p className="text-xs text-gray-400">Supports Excel (.xlsx, .xls) and CSV files</p>
              </>
            )}
          </div>
        </div>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-red-50 text-red-600 p-3 rounded-md text-sm"
          >
            {errorMessage}
          </motion.div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={downloadTemplate}
            kind="white"
            className="flex items-center justify-center"
          >
            <FiDownload className="mr-2" /> Download Template
          </Button>
          
          <Button
            onClick={handleUpload}
            className="flex-1 bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Uploading...
              </div>
            ) : (
              <>
                <FiUpload className="mr-2" /> Upload Inventory
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-2 text-sm">Required Format</h3>
          <div className="bg-white p-3 rounded-md border border-gray-200 overflow-x-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              name,description,unitPrice,currency,stockQty,stockQtyAlert,unitOfMeasure,category,productCode,image_url
            </pre>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Make sure your file follows this exact column structure. The image_url is optional.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default BulkUploadModal;