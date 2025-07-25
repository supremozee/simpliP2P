import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../atoms/Modal";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import useInviteMember from "@/hooks/useInviteMember";
import useStore from "@/store";
import { IoShieldCheckmark } from "react-icons/io5";
import { Permission } from "@/types";
import Select from "../atoms/Select";
import CreateBranch from "./CreateBranch";
import CreateDepartment from "./CreateDepartment";
import useFetchDepartment from "@/hooks/useFetchDepartments";
import useFetchBranch from "@/hooks/useFetchBranch";
import PermissionSelect from "../molecules/PermissionSelect";

const InviteFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  branch_id: z.string().min(1, "Branch is required"),
  department_id: z.string().min(1, "Department is required"),
  permission: z
    .array(z.custom<Permission>())
    .min(1, "Permission level is required"),
});

type InviteFormData = z.infer<typeof InviteFormSchema>;

interface InviteProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const InviteMemberForm: React.FC<InviteProps> = ({
  showModal = false,
  setShowModal,
}) => {
  const { inviteMember, loading } = useInviteMember();
  const { currentOrg } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<InviteFormData>({
    resolver: zodResolver(InviteFormSchema),
  });
  const { data: departmentData, isLoading: loadingData } =
    useFetchDepartment(currentOrg);
  const { data: branchData, isLoading: branchLoading } =
    useFetchBranch(currentOrg);
  const departments = departmentData?.data?.departments || [];
  const branches = branchData?.data?.branches || [];
  const departmentId = watch("department_id");
  const branchId = watch("branch_id");
  const permissions = watch("permission") || [];

  const onSubmit = async (data: InviteFormData) => {
    await inviteMember(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
        branch_id: data.branch_id,
        department_id: data.department_id,
        permissions: data.permission,
      },
      currentOrg
    );

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
              <h2 className="text-xl font-semibold text-gray-900">
                Invite Team Member
              </h2>
              <p className="text-sm text-gray-500">
                Add a new member to your organization
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="First Name"
                type="text"
                placeholder="Enter first name"
                {...register("first_name")}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Last Name"
                type="text"
                placeholder="Enter last name"
                {...register("last_name")}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

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

          <div className="relative">
            <Select
              label="Department"
              options={departments}
              {...register("department_id")}
              required
              value={departmentId}
              error={errors.department_id?.message}
              loading={loadingData}
              onChange={(value) => setValue("department_id", value)}
              component={<CreateDepartment add={true} />}
            />
          </div>

          <div className="relative">
            <Select
              label="Branch"
              options={branches}
              {...register("branch_id")}
              value={branchId}
              required
              error={errors.branch_id?.message}
              loading={branchLoading}
              onChange={(value) => setValue("branch_id", value)}
              component={<CreateBranch add={true} />}
            />
          </div>

          <PermissionSelect
            value={permissions}
            onChange={(value) => setValue("permission", value)}
            error={errors.permission?.message}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              className="px-4 py-2 #181819 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded-lg"
              disabled={loading}
            >
              {loading ? "Sending Invitation..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default InviteMemberForm;
