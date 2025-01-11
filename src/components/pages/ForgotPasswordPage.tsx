"use client"
import React from 'react';
import InputField from '../atoms/Input';
import Button from '../atoms/Button';
import Link from 'next/link';
import { z } from 'zod';
import useForgotPassword from '@/hooks/useForgotPassword';
import { useForm } from 'react-hook-form';
import Loader from '../molecules/Loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotData } from '@/types';
const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').nonempty('Email is required'),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>
const ForgotPasswordPage = () => {
  const { forgotPassword, loading, errorMessage, successMessage } = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: forgotData) => {
    await forgotPassword(data);
  };

  return (
    <div className='flex h-screen w-full font-roboto'>
       {loading && <Loader />}
      <div className="bg-[url('/loginImage.png')] w-full sm:w-1/2 h-1/3 sm:h-full object-cover bg-cover sm:flex hidden flex-col justify-center items-center pt-10">
        <p className='w-[90%] sm:w-[600px] mt-10 sm:mt-28 text-white text-[14px] sm:text-[16px] text-center sm:text-left'>
          Figma ipsum component variant main layer. Create flatten create effect move strikethrough. Union export plugin bullet effect hand arrange align. Project project boolean arrow scale. Rectangle device clip hand figma content frame underline content.
        </p>
      </div>
      <div className='flex justify-center flex-col gap-4 w-full sm:w-1/2 p-5 sm:p-[150px]'>
        <div className='flex flex-col items-center justify-center'>
          <strong className='text-[24px] sm:text-[30px] font-[700]'>Reset Your Password</strong>
          <p className='text-[10px] sm:text-[12px] text-[#9E9E9E] text-center sm:text-left'>
            Enter your email to receive a password reset link
          </p>
        </div>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label='Email'
            placeholder='email@gmail.com'
            type='email'
            {...register('email')}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <Button className='text-white rounded-[12px]'>Reset</Button>
          <div className='flex justify-center items-center text-center'>
            <p>Remembered your password? </p>
            <Link href={'/login'} className='text-primary font-[500] underline'>
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;