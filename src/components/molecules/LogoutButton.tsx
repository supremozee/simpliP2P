import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { cn } from "@/utils/cn";
import ConfirmActionModal from "@/components/organisms/AdminitrativeManagement/ConfirmActionModal";
import useLogoutAll from "@/hooks/useLogoutAll";
import useStore from "@/store";
import Button from "../atoms/Button";

interface LogoutButtonProps {
  onClick?: () => void;
  isCollapsed?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClick,
  isCollapsed,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { logoutAll } = useLogoutAll();
  const { userId } = useStore();

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsProcessing(true);
    await logoutAll({ userId });
    setIsProcessing(false);
  };

  return (
    <>
      <Button
        onClick={handleLogoutClick}
        className={cn(
          "w-full flex items-center gap-3 p-2 rounded-lg bg-tertiary/70 justify-center",
          "text-red-600 hover:bg-red-50 transition-all duration-200",
          "group focus:outline-none focus:ring-2 focus:ring-red-100",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        <FiLogOut className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
        {!isCollapsed && (
          <span className="text-sm font-medium">Sign Out All</span>
        )}
      </Button>

      <ConfirmActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sign Out All"
        message="Confirm sign out? You'll need to re-select your organization on your next login."
        confirmText="Sign Out All"
        onConfirm={handleConfirmLogout}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default LogoutButton;
