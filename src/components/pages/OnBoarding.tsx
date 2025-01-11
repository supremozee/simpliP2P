import Button from '@/components/atoms/Button';
import React from 'react';
import Logo from '../atoms/Logo';
import { cn } from '@/utils/cn';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Image from 'next/image';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const steps = [
  {
    number: 1,
    title: 'Effortless Supplier Management',
    description: 'Easily add, edit, and evaluate suppliers to ensure top-notch performance and reliability.'
  },
  {
    number: 2,
    title: 'Seamless Purchase Order Tracking',
    description: 'Track and approve purchase orders with just a few clicks. Never lose sight of your orders again.'
  },
  {
    number: 3,
    title: 'Real-Time Budget Insights',
    description: 'Stay on budget with our dynamic tracking and alert system.'
  }
];

const OnBoarding = () => {
  const isLargeScreen = useMediaQuery("(min-width: 640px)");
   const router = useRouter()
  return (
    <div
      className={cn(
        "relative bg-cover bg-center w-full min-h-screen flex justify-center flex-col items-center sm:px-[70px] px-5 sm:gap-[187px]",
        isLargeScreen ? "bg-[url('/happy-young-african-businessman.png')]" : "bg-[url('/happy-young-african-businessman-sm.png')]"
      )}
    >
      <div className='bg-black bg-opacity-60 min-h-screen w-full absolute top-0 right-0 bottom-0'></div>
      <div>
        {isLargeScreen ? (
          <>
            <div className='absolute top-0 right-0 p-5 z-10'>
              <Logo />
            </div>
            <div className='flex flex-col gap-8  w-[964px] mt-5'>
              <strong className='text-[30px] font-bold leading-10 z-10'>Streamline Your Procurement Process<br /> with SimpliP2P Prosoft</strong>
              <p className='text-[18px] font-[500] z-10'>SimpliP2P Prosoft brings all your procurement needs into one platform. From supplier management to invoice processing, our intuitive interface and robust analytics help you save time, reduce costs, and make data-driven decisions with confidence.</p>
              <Button width='book' fontSize='12px'> Let&apos;s go</Button>
              <div className='flex z-10 mt-[187px] gap-10 ml-14'>
                {steps.map((step, idx) => (
                  <div key={idx} className='flex w-full gap-5 flex-col relative '>
                    <div className='bg-primary rounded-full absolute -left-12 w-[40px] h-[40px] flex justify-center items-center font-bold text-[20px]'>{step.number}</div>
                    <h1 className='text-[24px] font-[600] leading-6'>{step.title}</h1>
                    <p className='leading-none text-[14px] font-[400]'>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className='min-h-screen flex-col flex justify-center items-center w-full mt-[10rem] mb-[2rem]'>
            <Image
                src={'/big-logo.png'}
                alt='Big Logo'
                width={200}
                height={200}
                className='z-10'
            />
            <div className='flex flex-col gap-5 items-center w-full justify-center font-roboto'>
                <h1 className='font-bold text-white z-10 text-center text-[30px] '>Streamline Your Procurement Process</h1>
                <p className='text-[12px] font-[400] text-justify text-white leading-4 w-full z-10 mb-20'>SimpliP2P Prosoft brings all your procurement needs into one platform. From supplier management to invoice processing, our intuitive interface and robust analytics help you save time, reduce costs, and make data-driven decisions with confidence.</p>
                <Button 
                onClick={()=>router.push('/login')}
                 width='book' radius='full' kind='tertiary' fontSize='12px'> <span className='text-[#2D2D2D] text-[15px] flex justify-center items-center gap-2'>Let&apos;s go<MdKeyboardArrowRight size={13} className='font-bold' /></span></Button>
                <div className='flex flex-col z-10 gap-10'>
                {steps.map((step, idx) => (
                  <div key={idx} className='flex w-full flex-col relative bg-white justify-center items-center rounded-lg px-12 py-5 gap-4 '>
                    <div className='bg-primary rounded-full absolute top-6 left-7 right-0 h-[40px] w-[40px] flex justify-center items-center font-bold text-[20px]'>{step.number}</div>
                    <h1 className='ml-7 text-[21px] text-start font-[600] font-roboto leading-none text-[#2D2D2D]'>{step.title}</h1>
                    <p className='ml-7 leading-none text-[14px] font-[400] text-start text-[#AAAAAA]'>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnBoarding;