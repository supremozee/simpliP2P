import React from 'react'
import { PiInfoFill } from "react-icons/pi";
import OpenInventory from './OpenInventory';
import AddNewItem from './AddNewItem';
const AddItemsToRequisition = () => {
  return (
    <section className='flex justify-between w-full px-4 py-2 bg-white rounded-[10px] border border-[#808080]'>
        <div className='flex items-center gap-2'>
            <PiInfoFill size={24} color='#1764FE' />
              <h2>Add items to this purchase request</h2>
        </div>
        <div className='flex gap-4 text-white'>
            <OpenInventory/>
            <AddNewItem/>
        </div>
    </section>
  )
}

export default AddItemsToRequisition