"use client";

import React, { useEffect, useState } from "react";
import Tabs from "../molecules/Tabs";
import OrganizationMembers from "../organisms/OrganizationMembers";
import OrganizationProfile from "../organisms/OrganizationProfile";
import AdministrativeManagements from "../organisms/AdminitrativeManagement/AdministrativeManagements";
import useUserPermissions from "@/hooks/useUserPermissions";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import useNotify from "@/hooks/useNotify";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("Organization Profile");
  const { getUserPermissions } = useUserPermissions();
  const router = useRouter();
  const { orgName } = useStore();
  const { error: showError } = useNotify();
  const { isCreator } = getUserPermissions();

  useEffect(() => {
    if (!isCreator) {
      showError("You don&apos;t have permission to access settings");
      router.push(`/${orgName}/dashboard`);
    }
  }, [isCreator, router, orgName, showError]);

  if (!isCreator) {
    return null;
  }

  const tabs = [
    "Organization Profile",
    "Member Management",
    "Administrative Control"
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Organization Profile":
        return <OrganizationProfile />;
      case "Member Management":
        return <OrganizationMembers />;
      case "Administrative Control":
        return <AdministrativeManagements />;
      default:
        return <OrganizationProfile />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Organization Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your organization&apos;s profile, members, and administrative settings
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-xl">
        <div className="border-b border-gray-200 p-2">
          <Tabs
            tabNames={tabs}
            active={activeTab}
            setActive={setActiveTab}
          />
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;