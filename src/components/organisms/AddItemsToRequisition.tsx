import React, { useEffect, useState } from 'react'
import { PiInfoFill } from "react-icons/pi";
import OpenInventory from './OpenInventory';
import { usePathname } from 'next/navigation';
const AddItemsToRequisition = () => {
  const pathname = usePathname()
  const [domId, setDomId] = useState("modal-root")
  useEffect(() => {
    const isInitializeRequisition = pathname.includes("initialize-requisition")
    const isSaveForLaterRequisitionOrInitialize = pathname.includes("purchase-requisitions")
    
    if(isInitializeRequisition) {
      setDomId("dee")
    } else if(isSaveForLaterRequisitionOrInitialize) {
      setDomId("modal-root")
    }
  }, [pathname]); 
  return (
    <section className='flex justify-between w-full sm:px-4 py-3  bg-white rounded-[10px] border border-[#808080]'>
        <div className='flex items-center gap-2'>
            <PiInfoFill size={24} color='#1764FE' />
              <h2 className='sm:text-sm text-[10px] leading-none'>Add items to this purchase request</h2>
        </div>
        <div className='flex sm:gap-4 text-white'>
            <OpenInventory dom={domId}/>
            {/* <AddNewItem/> */}
        </div>
    </section>
  )
}

export default AddItemsToRequisition