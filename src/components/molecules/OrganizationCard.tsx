import React from 'react';
import Image from 'next/image';
import { MdEdit, MdAdd } from 'react-icons/md';
import { IoCheckmarkCircle } from 'react-icons/io5';

interface OrganizationCardProps {
  name?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  imageUrl?: string;
  online_status?: boolean;
  showPending?: boolean;
  isDeactivated?: boolean;
  isAddCard?: boolean;
  onClick: () => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  name,
  email,
  role,
  permissions,
  imageUrl = '/placeholder-user.png',
  online_status,
  showPending,
  isDeactivated,
  isAddCard,
  onClick,
}) => {
  if (isAddCard) {
    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center justify-center w-full h-[280px] p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <MdAdd className="w-8 h-8 text-primary" />
        </div>
        <p className="text-gray-600 font-medium">Add New Member</p>
        <p className="text-sm text-gray-500 mt-1">Click to invite a team member</p>
      </button>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer
        ${isDeactivated ? 'opacity-75 bg-gray-50' : ''}
      `}
    >
      {/* Status Indicator */}
      {!isDeactivated && !showPending && (
        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
          online_status ? 'bg-green-500' : 'bg-gray-300'
        }`} />
      )}
      
      {/* Member Status Badge */}
      {(showPending || isDeactivated) && (
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium
          ${showPending ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
        `}>
          {showPending ? 'Pending' : 'Deactivated'}
        </div>
      )}

      {/* Profile Image */}
      <div className="relative w-24 h-24 mb-4">
        <Image
          src={imageUrl}
          alt={name || 'Profile'}
          fill
          className="rounded-full object-cover"
        />
        <button 
          className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <MdEdit className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Member Info */}
      <div className="text-center">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 mt-1">{email}</p>
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {role}
          </span>
        </div>
      </div>

      {/* Permissions */}
      {permissions && permissions.length > 0 && (
        <div className="mt-4 space-y-2">
          {permissions.map((permission) => (
            <div key={permission} className="flex items-center text-sm text-gray-600">
              <IoCheckmarkCircle className="w-4 h-4 text-green-500 mr-2" />
              {permission.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationCard;