"use client";
import React from 'react';
import Button from '../atoms/Button';
import Link from 'next/link';
import useVerifyEmail from '@/hooks/useVerifyEmail';
import { usePathname } from 'next/navigation';
import Loader from '../molecules/Loader';
import Logo from '../atoms/Logo';

const VerifyAccountPage = () => {
    const pathname = usePathname()
    const { loading, success, verifyEmail } = useVerifyEmail();

  const handleVerify = async () => {
    const token = pathname.split('/').pop() || '';
    await verifyEmail({ token });
  };
  return (
    <div className='flex h-screen w-full font-roboto'>
        {loading && <Loader/>}
      <div className="bg-[url('/loginImage.png')] w-full sm:w-1/2 h-1/3 sm:h-full object-cover bg-cover sm:flex hidden flex-col justify-center items-center pt-10">
      <div className='sm:hidden block'>
           <Logo/>
      </div>
        <p className='w-[90%] sm:w-[600px] mt-10 sm:mt-28 text-white text-[14px] sm:text-[16px] text-center sm:text-left'>
        Verify Your account
        </p>
      </div>
      <div className='flex justify-center flex-col gap-4 w-full sm:w-1/2 p-5 sm:p-[150px]'>
        <div className='flex flex-col items-center justify-center'>
          <strong className='text-[24px] sm:text-[30px] font-[700]'>Verify Your Account</strong>
          <p className='text-[14px] sm:text-[12px] text-[#9E9E9E] text-center sm:text-left'>
            Click the button below to verify your account
          </p>
        </div>
        <div className='flex flex-col gap-4'>
          <Button className='text-white rounded-[12px]' onClick={handleVerify}>Verify Account</Button>
          {success && <p className='text-primary'>{success}</p>}
          <div className='flex justify-center items-center text-center'>
            <p>Already verified? </p>
            <Link href={'/login'} className='text-primary font-[500] underline'>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountPage;