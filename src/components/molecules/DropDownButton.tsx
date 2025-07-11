"use client";

import { useState, useRef, useEffect } from "react";
import {
  IoPersonOutline,
  IoHelpCircleOutline,
  IoLogOutOutline,
} from "react-icons/io5";

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="py-2">
            <li className="flex items-center px-4 py-2 text-sm #181819 hover:bg-gray-100 cursor-pointer">
              <IoPersonOutline className="mr-2" />
              Profile
            </li>
            <li className="flex items-center px-4 py-2 text-sm #181819 hover:bg-gray-100 cursor-pointer">
              <IoHelpCircleOutline className="mr-2" />
              Help and Support
            </li>
            <li className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer">
              <IoLogOutOutline className="mr-2" />
              Log out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
