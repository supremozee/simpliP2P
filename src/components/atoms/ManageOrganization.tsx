import React from 'react'
import Button from './Button'
import { FaPlus } from 'react-icons/fa'
import { MdOutlineArrowDropDown } from 'react-icons/md'

const ManageOrganization = () => {
  return (
    <Button className='flex items-center gap-1 justify-between bg-inherit text-[#181819]  rounded-[10px]'>
        <FaPlus />
        <MdOutlineArrowDropDown />
    </Button>
  )
}

export default ManageOrganization