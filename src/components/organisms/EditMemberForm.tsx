import React from 'react';
import Modal from '../atoms/Modal';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import useStore from '@/store';
import useEditMember from '@/hooks/useEditMembers';
import useDeactivateMember from '@/hooks/useDeactivateMembers';
import useFetchMemberById from '@/hooks/useFetchMemberById';
import useReactivateMember from '@/hooks/useReactivateMembers';
import { IoShieldCheckmark } from 'react-icons/io5';
import { Permission } from '@/types';

const PERMISSIONS: { value: Permission; label: string; description: string }[] = [
  {
    value: "manage_users",
    label: "Manage Users",
    description: "Can manage users and their permissions"
  },
  {
    value: "manage_suppliers",
    label: "Manage Suppliers",
    description: "Can manage suppliers and their information"
  },
  {
    value: "all_permissions",
    label: "All Permissions",
    description: "Full access to all features and settings"
  }
];

const EditMemberSchema = z.object({
  role: z.string().min(1, "Role is required"),
  permissions: z.array(z.enum(["manage_users", "manage_suppliers", "all_permissions"]))
    .min(1, "At least one permission is required")
});

type EditMemberData = {
  role: string;
  permissions: ["manage_users" | "manage_suppliers" | "all_permissions"];
};

interface EditMemberProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  memberId: string;
}

const EditMemberForm: React.FC<EditMemberProps> = ({ showModal = false, setShowModal, memberId }) => {
  const { currentOrg, selectedMemberId } = useStore();
  const { editMember, loading } = useEditMember();
  const { deactivateMember } = useDeactivateMember();
  const { reactivateMember } = useReactivateMember();
  const { data } = useFetchMemberById(currentOrg, memberId);
  const member = data?.data?.member;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditMemberData>({
    resolver: zodResolver(EditMemberSchema),
    defaultValues: {
      role: member?.role || "",
      permissions: member?.permissions?.filter(p => p === "manage_users" || p === "manage_suppliers") as ["manage_users" | "manage_suppliers"]
    }
  });

  const handleDeactivate = () => {
    deactivateMember(currentOrg, memberId);
    setShowModal(false);
  };

  const handleReactivate = () => {
    reactivateMember(currentOrg, memberId);
    setShowModal(false);
  };

  const onSubmit = (data: EditMemberData) => {
    editMember({
      role: data.role,
      permissions: data.permissions
    }, currentOrg, selectedMemberId);
    
    reset();
    setShowModal(false);
  };

  return (
    <Modal
      onClose={() => setShowModal(false)}
      isOpen={showModal}
      contentClassName="max-w-2xl"
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <IoShieldCheckmark className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Member</h2>
              <p className="text-sm text-gray-500">
                Update member role and permissions
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="Role"
              type="text"
              placeholder="Enter role (e.g. Manager, Team Lead, etc.)"
              {...register("role")}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permissions
            </label>
            <div className="space-y-3">
              {PERMISSIONS.map((permission) => (
                <label
                  key={permission.value}
                  className="relative flex items-start p-4 cursor-pointer rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        {...register("permissions")}
                        value={permission.value}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="ml-3 font-medium text-gray-900">{permission.label}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{permission.description}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.permissions && (
              <p className="text-red-500 text-sm mt-1">{errors.permissions.message}</p>
            )}
          </div>

          <div className="flex justify-between">
            <div>
              {member?.deactivated_at ? (
                <Button
                  type="button"
                  onClick={handleReactivate}
                  className="px-4 py-2 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg"
                >
                  Reactivate Member
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleDeactivate}
                  className="px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                >
                  Deactivate Member
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded-lg"
                disabled={loading}
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditMemberForm;