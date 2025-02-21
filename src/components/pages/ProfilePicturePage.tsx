"use client"
import React from 'react';
import Button from '../atoms/Button';
import useUploadProfilePicture from '@/hooks/useUploadProfile';
import Loader from '../molecules/Loader';
import { FiUploadCloud } from 'react-icons/fi';


const ProfilePicturePage = () => {
  const { uploadProfilePicture, loading, errorMessage } = useUploadProfilePicture();
  const handleFileChange = async(event:React.ChangeEvent<HTMLInputElement>)=> {
if(event.target.files && event.target.files[0]) {
  await uploadProfilePicture(event.target.files[0])
}
  }
  return (
    <div className='flex h-screen w-full font-roboto'>
      {loading && <Loader />}
      <div className="bg-[url('/pcframe.png')] w-full sm:w-1/2 h-1/3 sm:h-full object-cover bg-cover sm:flex hidden flex-col">
      </div>
      <div className='flex justify-center flex-col gap-4 w-full sm:w-1/2 p-5 sm:p-[150px]'>
        <div className='flex flex-col items-center justify-center'>
          <strong className='text-[24px] sm:text-[30px] font-[700]'>Set your Profile Picture</strong>
          <p className='text-[16px] sm:text-[12px] text-[#9E9E9E] text-center sm:text-left'>
            Upload Company Logo/User image
          </p>
        </div>
        <div className='relative flex justify-center items-center'>
          <input
            className='w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-[#E5E5E5] flex items-center justify-center rounded-[15px] opacity-0 absolute cursor-pointer'
            type='file'
            onChange={handleFileChange}
          />
          <div className='w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-[#E5E5E5] flex items-center justify-center rounded-[15px]'>
            <FiUploadCloud className='text-gray-500 text-4xl' />
          </div>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className='flex flex-col gap-4 mt-4'>
          <Button kind='white' className='text-[#888888] justify-center items-center'>Skip</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicturePage;