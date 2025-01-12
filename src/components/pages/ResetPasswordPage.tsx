"use client";
import React, { useEffect } from 'react';
import InputField from '../atoms/Input';
import Button from '../atoms/Button';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useResetPassword from '@/hooks/useResetPassword';
import Loader from '../molecules/Loader';

const ResetPasswordSchema = z.object({
  token: z.string(),
  new_password: z.string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirm_password: z.string().min(6, 'Confirm Password must be at least 6 characters long')
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

const ResetPasswordPage = () => {
  const { resetPassword, loading, errorMessage, successMessage, token } = useResetPassword();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token: '' },
  });
  useEffect(() => {
    if (token) {
      setValue('token', token);
    }
  }, [token, setValue]);
  const password = watch('new_password');
  const onSubmit = async (data: ResetPasswordFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {confirm_password, ...payload} = data
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
          <p className='text-[12px] sm:text-[12px] text-[#9E9E9E] text-center sm:text-left'>
            Enter your new password to reset your account password
          </p>
        </div>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label='Password'
            type='password'
            value={password}
            placeholder='Enter your new password'
            {...register('new_password')}
          />
          {errors.new_password && <p className="text-red-500">{errors.new_password.message}</p>}
          <InputField
            label='Confirm Password'
            type='password'
            placeholder='Confirm your new password'
            {...register('confirm_password')}
          />
          {errors.confirm_password && <p className="text-red-500">{errors.confirm_password.message}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <Button className='text-white rounded-[12px]' type="submit">Reset Password</Button>
        </form>
        <div className='flex justify-center items-center text-center'>
            <p>Remembered your password? </p>
            <Link href={'/login'} className='text-primary font-[500] underline'>
              Log in
            </Link>
          </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;