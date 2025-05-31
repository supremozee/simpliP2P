/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";

export default function useDeleteDepartment() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: DeleteDepartmentMutation, isPending: isDeleting } = useMutation({
    mutationFn: async ({ orgId, departmentId }: { orgId: string; departmentId: string }) => {
      return auth.deleteDepartment(orgId, departmentId);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['fetchDepartments'] });
      queryClient.invalidateQueries({ queryKey: ['organizationDashboard'] });
      if (response && response.status === 'success') {
        notifySuccess(response.message || 'Department deleted successfully');
      } else {
        notifyError(response.message || 'Failed to delete department');
      }
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || 'An error occurred while deleting the department. Please try again.';
      notifyError(message);
    },
  });

  const deleteDepartment = async (orgId: string, departmentId: string) => {
    await DeleteDepartmentMutation({ orgId, departmentId });
  };

  return { deleteDepartment, isDeleting };
}