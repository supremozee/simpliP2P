import React from 'react'

const PurchaseOrderSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-6">
      <div className="flex justify-between items-center w-full border-b border-[#808080] pb-12">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        <div className="flex flex-col gap-2 w-1/3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 flex flex-col gap-8">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
      <div className="flex w-full justify-between items-center">
        <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-300 rounded w-1/4"></div>
          <div className="h-10 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseOrderSkeleton