import React from 'react';
import { motion } from 'framer-motion';
import Button from '../atoms/Button';
import Image from 'next/image';

interface HeroProps {
  onGetStarted: () => void;
  onRequestDemo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onRequestDemo }) => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Let&apos;s give your{' '}
              <span className="text-primary">P2P Transactions</span>{' '}
              a Boost
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of users making secure and seamless peer-to-peer exchanges
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={onGetStarted}
                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-all"
              >
                Get Started
              </Button>
              <Button
                onClick={onRequestDemo}
                className="bg-gray-800 text-white px-8 py-3 rounded-xl hover:bg-gray-700 transition-all"
              >
                Request Demo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/dashboard-preview.png"
                alt="Dashboard Preview"
                width={800}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute w-full h-full z-[-1]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/hero-bg.png')] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" />
      </div>
    </section>
  );
};

export default Hero; 