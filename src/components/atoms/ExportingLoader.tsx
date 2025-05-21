import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ExportingLoader = () => (
  <div className="absolute h-screen  w-full   flex items-center justify-center z-50">
    <div className="bg-primary rounded-lg p-4 flex items-center gap-3 justify-center min-w-[180px] shadow-lg">
      <AiOutlineLoading3Quarters className="w-5 h-5 text-white animate-spin" />
      <p className="text-sm font-medium text-white">Exporting...</p>
    </div>
  </div>
);

export default ExportingLoader