"use client";
import { useState, useMemo } from "react";
import useStore from "@/store";
import useFetchMembers from "@/hooks/useFetchMembers";
import OrganizationCard from "../molecules/OrganizationCard";
import InviteUserForm from "./InviteUserForm";
import EditMemberForm from "./EditMemberForm";
import Tabs from "../molecules/Tabs";
import Button from "../atoms/Button";
import { IoPersonAdd, IoSearch } from "react-icons/io5";
import Input from "../atoms/Input";
import LoaderSpinner from "../atoms/LoaderSpinner";

const OrganizationMembers = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedMemberId, setSelectedMemberId, currentOrg } = useStore();
  const { data, isLoading } = useFetchMembers(currentOrg);
  
  const tabs = ["Active Members", "Pending Invitations", "Deactivated"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Filter and sort members based on tab and search query
  const filteredMembers = useMemo(() => {
    if (!data?.data?.users) return [];

    return data.data.users.filter((user) => {
      const matchesSearch = (
        user.first_name.toLowerCase() +
        " " +
        user.last_name.toLowerCase() +
        " " +
        user.email.toLowerCase() +
        " " +
        user.role.toLowerCase()
      ).includes(searchQuery.toLowerCase());

      switch (activeTab) {
        case "Active Members":
          return user.accepted_invitation && !user.deactivated_at && matchesSearch;
        case "Pending Invitations":
          return !user.accepted_invitation && matchesSearch;
        case "Deactivated":
          return user.deactivated_at && matchesSearch;
        default:
          return false;
      }
    }).sort((a, b) => {
      // Sort by role priority
      const roleOrder = { "Admin": 1, "Manager": 2, "Supervisor": 3, "Staff": 4 };
      const roleA = roleOrder[a.role as keyof typeof roleOrder] || 5;
      const roleB = roleOrder[b.role as keyof typeof roleOrder] || 5;
      return roleA - roleB;
    });
  }, [data?.data?.users, activeTab, searchQuery]);

  const handleEditMember = (memberId: string) => {
    const member = data?.data.users.find((member) => member?.id === memberId);
    if (member) {
      setSelectedMemberId(memberId);
      setShowEditMemberModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoaderSpinner size="lg" text="Loading members..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Organization Members</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your organization&apos;s team members and their roles
          </p>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <IoPersonAdd className="w-5 h-5" />
          <span>Invite Member</span>
        </Button>
      </div>

      {/* Search and Tabs Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="relative w-full sm:w-64">
          <Input
            name="search"
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <Tabs
          tabNames={tabs}
          active={activeTab}
          setActive={setActiveTab}
        />
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === "Active Members" && (
          <OrganizationCard
            onClick={() => setShowInviteModal(true)}
            isAddCard
          />
        )}
        {filteredMembers.map((user) => (
          <OrganizationCard
            key={user.id}
            onClick={() => handleEditMember(user.id)}
            name={`${user.first_name} ${user.last_name}`}
            email={user.email}
            role={user.role}
            permissions={user.permissions}
            imageUrl={user?.profile_picture || '/logo-black.png'}
            online_status={user.online_status}
            showPending={!user.accepted_invitation}
            isDeactivated={!!user.deactivated_at}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {searchQuery
              ? "No members found matching your search"
              : activeTab === "Pending Invitations"
              ? "No pending invitations"
              : activeTab === "Deactivated"
              ? "No deactivated members"
              : "No members found"}
          </p>
        </div>
      )}

      {/* Modals */}
      <InviteUserForm
        showModal={showInviteModal}
        setShowModal={setShowInviteModal}
      />
      <EditMemberForm
        showModal={showEditMemberModal}
        setShowModal={setShowEditMemberModal}
        memberId={selectedMemberId || ""}
      />
    </div>
  );
};

export default OrganizationMembers;