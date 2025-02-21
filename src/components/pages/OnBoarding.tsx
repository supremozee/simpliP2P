import React from 'react';
import Hero from '../organisms/Hero';
import Features from '../organisms/Features';
import DemoRequest from '../organisms/DemoRequest';
import { useRouter } from 'next/navigation';
const OnBoarding = () => {
  const router = useRouter();
  const handleGetStarted = () => {
    router.push('/login');
  };
  const handleRequestDemo = () => {
    document.getElementById('request-demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <Hero onGetStarted={handleGetStarted} onRequestDemo={handleRequestDemo} />
      <Features />
      <DemoRequest />
    </main>
  );
};

export default OnBoarding;