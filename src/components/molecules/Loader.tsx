import React from 'react'
import Logo from '../atoms/Logo'

const Loader = () => {
  return (
    <div className='bg-black bg-opacity-20 w-full h-screen flex flex-col justify-center items-center fixed z-50'>
    <Logo animate={true}/>
    </div>
  )
}

export default Loader