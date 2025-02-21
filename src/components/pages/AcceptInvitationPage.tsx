/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect } from 'react';
import InputField from '../atoms/Input';
import Button from '../atoms/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Loader from '../molecules/Loader';
import useAcceptInvitation from '@/hooks/useAcceptInvitation';
import useStore from '@/store';

const AcceptInvitationSchema = z.object({
  token: z.string(),
  newPassword: z.string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type AcceptInvitationFormData = z.infer<typeof AcceptInvitationSchema>;

const AcceptInvitationPage = () => {
  const { currentOrg} = useStore();
  const { acceptInvitation, loading, errorMessage, successMessage, token, pathnameId } = useAcceptInvitation();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(AcceptInvitationSchema),
    defaultValues: { token: '' },
  });

  useEffect(() => {
    if (token) {
      setValue('token', token as string);
    }
  }, [token, setValue]);

  const password = watch('newPassword');
  const onSubmit = async (data: AcceptInvitationFormData) => {
    const { confirmPassword, ...payload } = data;
    await acceptInvitation(payload);
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
          <strong className='text-[24px] sm:text-[30px] font-[700]'>Accept Invitation</strong>
          <p className='text-[12px] sm:text-[12px] text-[#9E9E9E] text-center sm:text-left'>
            Enter your new password to accept invitation and Join organization
          </p>
        </div>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label='Password'
            type='password'
            value={password}
            placeholder='Enter your new password'
            {...register('newPassword')}
          />
          {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
          <InputField
            label='Confirm Password'
            type='password'
            placeholder='Confirm your new password'
            onPaste={(e) => e.preventDefault()}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <Button className='text-white rounded-[12px] justify-center items-center' type="submit">Accept Invitation</Button>
        </form>
      </div>
    </div>
  );
};

export default AcceptInvitationPage;