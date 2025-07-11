import React, { useState } from "react";
import Image from "next/image";
import { MdEdit, MdAdd } from "react-icons/md";
import { IoCheckmarkCircle, IoChevronDown, IoChevronUp } from "react-icons/io5";

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
  imageUrl = "/placeholder-user.png",
  online_status,
  showPending,
  isDeactivated,
  isAddCard,
  onClick,
}) => {
  const [showAllPermissions, setShowAllPermissions] = useState(false);
  const PERMISSIONS_TO_SHOW = 3;

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
        <p className="text-sm text-gray-500 mt-1">
          Click to invite a team member
        </p>
      </button>
    );
  }

  const displayPermissions = showAllPermissions
    ? permissions
    : permissions?.slice(0, PERMISSIONS_TO_SHOW);

  const formatPermission = (permission: string) => {
    return permission
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer
        ${isDeactivated ? "opacity-75 bg-gray-50" : ""}
      `}
    >
      {/* Status Indicator */}
      {!isDeactivated && !showPending && (
        <div
          className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
            online_status ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      )}

      {/* Member Status Badge */}
      {(showPending || isDeactivated) && (
        <div
          className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium
          ${
            showPending
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }
        `}
        >
          {showPending ? "Pending" : "Deactivated"}
        </div>
      )}

      {/* Profile Image */}
      <div className="relative w-24 h-24 mb-4">
        <Image
          src={imageUrl}
          alt={name || "Profile"}
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
        <div className="mt-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium #181819">Permissions</span>
            <span className="text-xs text-gray-500">{permissions.length}</span>
          </div>
          <div className="space-y-2 bg-gray-50 rounded-lg p-3">
            {displayPermissions?.map((permission) => (
              <div
                key={permission}
                className="flex items-center text-sm text-gray-600 bg-white rounded-md px-3 py-2 shadow-sm"
              >
                <IoCheckmarkCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="line-clamp-1">
                  {formatPermission(permission)}
                </span>
              </div>
            ))}
            {permissions.length > PERMISSIONS_TO_SHOW && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllPermissions(!showAllPermissions);
                }}
                className="flex items-center justify-center w-full text-sm text-primary hover:text-primary/80 transition-colors py-1"
              >
                {showAllPermissions ? (
                  <>
                    Show Less <IoChevronUp className="ml-1 w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show More ({permissions.length - PERMISSIONS_TO_SHOW} more){" "}
                    <IoChevronDown className="ml-1 w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationCard;
