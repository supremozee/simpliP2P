"use client";
import React from 'react';
import InputField from '../atoms/Input';
import Button from '../atoms/Button';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useResetPassword from '@/hooks/useResetPassword';
import Loader from '../molecules/Loader';
import { usePathname } from 'next/navigation';

const ResetPasswordSchema = z.object({
  token: z.string().nonempty('Token is required'),
  new_password: z.string().min(6, 'Password must be at least 6 characters long').nonempty('Password is required'),
  confirm_Password: z.string().min(6, 'Confirm Password must be at least 6 characters long').nonempty('Confirm Password is required'),
}).refine((data) => data.new_password === data.confirm_Password, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

const ResetPasswordPage = () => {
    const pathname = usePathname()
    const token = pathname.split('/').pop()
  const { resetPassword, loading, errorMessage, successMessage } = useResetPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token: token }
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {confirm_Password, ...payload} = data
    await resetPassword(payload);
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
            Enter your new password to reset your account password
          </p>
        </div>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label='Password'
            type='password'
            placeholder='Enter your new password'
            {...register('new_password')}
          />
          {errors.new_password && <p className="text-red-500">{errors.new_password.message}</p>}
          <InputField
            label='Confirm Password'
            type='password'
            placeholder='Confirm your new password'
            {...register('confirm_Password')}
          />
          {errors.confirm_Password && <p className="text-red-500">{errors.confirm_Password.message}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <Button className='text-white rounded-[12px]' type="submit">Reset Password</Button>
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

export default ResetPasswordPage;