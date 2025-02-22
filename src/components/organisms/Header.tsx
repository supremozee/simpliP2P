import React from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../atoms/Logo';
import Button from '../atoms/Button';
import { motion } from 'framer-motion';

const Header = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold text-white">simpliP2P</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Testimonials
            </a>
            <a href="#request-demo" className="text-gray-300 hover:text-white transition-colors">
              Request Demo
            </a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleLogin}
              className="text-white hover:text-primary  px-6 py-2 transition-colors"
            >
              Login
            </Button>
            <Button
              onClick={handleSignUp}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 