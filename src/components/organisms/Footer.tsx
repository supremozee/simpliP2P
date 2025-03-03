import React from 'react';
import Link from 'next/link';
import Logo from '../atoms/Logo';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { IoMail, IoCall, IoLocation } from 'react-icons/io5';
import useUserPermissions from '@/hooks/useUserPermissions';

const Footer = () => {
  const { checkPermission } = useUserPermissions();

  return (
    <footer className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Logo and Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Logo />
              <span className="text-xl font-bold text-gray-900">simpliP2P</span>
            </div>
            <p className="text-gray-600">
              Simplifying procurement processes for organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
                </li>
                <li>
                  <Link href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</Link>
                </li>
                <li>
                  <Link href="#faq" className="text-gray-600 hover:text-primary transition-colors">F.A.Q&apos;s</Link>
                </li>
                {checkPermission(['manage_suppliers']) && (
                  <li>
                    <Link href="/suppliers" className="text-gray-600 hover:text-primary transition-colors">Suppliers</Link>
                  </li>
                )}
                {checkPermission(['manage_products']) && (
                  <li>
                    <Link href="/products" className="text-gray-600 hover:text-primary transition-colors">Products</Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Stay Connected */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Stay Connected</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-2 text-gray-600">
                  <FaFacebook className="w-5 h-5" />
                  <span>SIMPLIP2P_OFFICIAL</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <FaInstagram className="w-5 h-5" />
                  <span>SIMPLIP2P_OFFICIAL</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <FaLinkedin className="w-5 h-5" />
                  <span>SIMPLIP2P_OFFICIAL</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <IoCall className="w-5 h-5" />
                  <span>+1 123 4567 8890</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <IoLocation className="w-5 h-5" />
                  <span>10, Agboola Aina Street, Off Toyin Street, Ikeja</span>
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <IoMail className="w-5 h-5" />
                  <span>Help@simplip2p.COM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; 2025 SIMPLIP2P. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;