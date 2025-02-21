import React from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle, IoArrowForward } from 'react-icons/io5';
import Button from '../atoms/Button';

interface HeroProps {
  onGetStarted: () => void;
  onRequestDemo: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, onRequestDemo }) => {
  return (
    <div className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-95 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)] z-20" />
        <svg
          className="absolute inset-0 w-full h-full z-0 opacity-30"
          style={{ filter: 'blur(40px)' }}
        >
          <defs>
            <pattern
              id="hero-pattern"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="rgba(79,70,229,0.2)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-30 container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Your <span className="text-primary">Procurement</span> Process
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Streamline your procurement workflow with our intelligent platform. 
              Reduce costs, improve efficiency, and make better decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Button
                onClick={onGetStarted}
                className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-full flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Get Started
                <IoArrowForward className="w-5 h-5" />
              </Button>
              <Button
                onClick={onRequestDemo}
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full w-full sm:w-auto justify-center"
              >
                Request Demo
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Easy Setup', value: '5 minutes' },
                { label: 'Support', value: '24/7' },
                { label: 'Security', value: 'Enterprise-grade' },
                { label: 'Updates', value: 'Regular' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-gray-300">
                  <IoCheckmarkCircle className="text-primary w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Stats/Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-lg blur-lg" />
              <div className="relative bg-white/10 backdrop-blur-lg rounded-lg p-8">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { value: '85%', label: 'Cost Reduction' },
                    { value: '60%', label: 'Time Saved' },
                    { value: '99.9%', label: 'Accuracy' },
                    { value: '24/7', label: 'Support' }
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                      <p className="text-sm text-gray-300">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 