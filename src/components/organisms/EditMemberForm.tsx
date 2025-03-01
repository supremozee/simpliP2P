import React, { useEffect } from 'react';
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
import { Permission, UserMember } from '@/types';
import PermissionSelect from '../molecules/PermissionSelect';

const EditMemberSchema = z.object({
  role: z.string().min(1, "Role is required"),
  permissions: z.array(z.custom<Permission>()).min(1, "At least one permission is required")
});

type EditMemberData = z.infer<typeof EditMemberSchema>;

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
  const member = data?.data?.member as UserMember | undefined;

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<EditMemberData>({
    resolver: zodResolver(EditMemberSchema),
    defaultValues: {
      role: "",
      permissions: []
    }
  });

  // Update form when member data is loaded
  useEffect(() => {
    if (member) {
      reset({
        role: member.role,
        permissions: member.permissions
      });
    }
  }, [member, reset]);

  const permissions = watch("permissions") || [];

  const handleDeactivate = () => {
    deactivateMember(currentOrg, memberId);
    setShowModal(false);
  };

  const handleReactivate = () => {
    reactivateMember(currentOrg, memberId);
    setShowModal(false);
  };

  const onSubmit = (formData: EditMemberData) => {
    editMember(formData, currentOrg, selectedMemberId);
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

          <PermissionSelect
            value={permissions}
            onChange={(value) => setValue("permissions", value)}
            error={errors.permissions?.message}
          />

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