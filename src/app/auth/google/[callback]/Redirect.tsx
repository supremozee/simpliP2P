/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useNotify from '@/hooks/useNotify';
import { useGoogleLogin } from '@/hooks/useGoogleLogin';
import Loader from '@/components/molecules/Loader';

const GoogleCallback = () => {
  const router = useRouter();
  const { success, error } = useNotify();
  const { handleCallback } = useGoogleLogin();
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        try {
           handleCallback(code);
          success( "Login successful");
          router.push('/'); 
        } catch (err: any) {
          const errorMessage = err.response?.error || "An unknown error occurred";
          error(errorMessage);
          console.error("Google callback failed:", errorMessage);
        }
      }
    };

    handleGoogleCallback();
  }, []);

  return <Loader />;
};

export default GoogleCallback;