import React from 'react'
import Button from '../atoms/Button'
import { useRouter } from 'next/navigation';
import { MdError, MdRefresh, MdHome } from 'react-icons/md';

interface ErrorComponentProps {
  text?: string;
  error?: boolean;
  onRetry?: () => void;
}

const ErrorComponent = ({ text, error = true, onRetry }: ErrorComponentProps) => {
  const router = useRouter();

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-tertiary p-4'>
      <div className='bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center'>
        {/* Error Icon */}
        <div className='flex justify-center mb-4'>
          <MdError className='text-red-500 text-6xl' />
        </div>
        
        {/* Error Message */}
        <h3 className='text-xl font-semibold text-gray-800 mb-2'>Something went wrong</h3>
        <p className='text-gray-600 mb-6'>
          {text || "Oops... something went wrong. Please try again."}
        </p>
        
        {/* Action Buttons */}
        {error && (
          <div className='flex flex-col gap-3'>
            {onRetry ? (
              <Button 
                onClick={onRetry}
                className='bg-primary hover:bg-tertiary text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors'
              >
                <MdRefresh className='text-lg' />
                Reload
              </Button>
            ): (
               <Button 
                onClick={() => router.replace("/login")}
                className='flex-1 bg-tertiary hover:bg-tertiary/20 text-primary py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors'
              >
                <MdHome className='text-lg' />
                Login Again
              </Button>
            )}
            
            <div className='flex gap-2'>
              
              {/* <Button 
                onClick={() => router.replace("/support")}
                className='flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 px-4 rounded-lg transition-colors'
              >
                Support
              </Button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorComponent