'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import InputField from '../atoms/Input';
import Button from '../atoms/Button';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    companyName: 'Crystal Enterprises',
    role: 'CEO',
    companyAddress: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    companyEmail: 'Crystalenterprises@gmail.com',
    password: '********',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-8 py-10 max-w-4xl mx-auto">
      <div className="w-full sm:w-2/3">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <form className="grid grid-cols-1 gap-4">
          <InputField
            name="companyName"
            type="text"
            label="Company Name"
            placeholder="Enter company name"
            value={profileData.companyName}
            onChange={handleInputChange}
          />
          <InputField
            name="role"
            type="text"
            label="Role"
            placeholder="Enter role"
            value={profileData.role}
            onChange={handleInputChange}
          />
          <InputField
            name="companyAddress"
            type="text"
            label="Company Address"
            placeholder="Enter company address"
            value={profileData.companyAddress}
            onChange={handleInputChange}
          />
          <InputField
            name="companyEmail"
            type="email"
            label="Company Email"
            placeholder="Enter company email"
            value={profileData.companyEmail}
            onChange={handleInputChange}
          />
          <InputField
            name="password"
            type="password"
            label="Password"
            placeholder="Enter password"
            value={profileData.password}
            onChange={handleInputChange}
          />
          <div className="text-right">
            <a href="#" className="text-blue-600 text-sm hover:underline">Change password</a>
          </div>
        </form>
      </div>

      <div className="w-full sm:w-1/3 mt-8 sm:mt-0 flex flex-col items-center">
        <div className="relative">
          <Image
            src="/profile-pic-placeholder.jpg"
            alt="Profile Picture"
            width={150}
            height={150}
            className="rounded-full object-cover"
          />
          <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 2.487a2.25 2.25 0 013.182 0l1.469 1.469a2.25 2.25 0 010 3.182l-13.5 13.5a9 9 0 01-3.799 2.251l-3.276.934.934-3.276a9 9 0 012.25-3.799l13.5-13.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6.75L17.25 4.5" />
            </svg>
          </button>
        </div>
        <div className="mt-8">
          <Button type="submit" className="bg-blue-700 text-white">Save</Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
