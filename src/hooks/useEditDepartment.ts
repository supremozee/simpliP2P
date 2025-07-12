/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/helpers/auths";
import { EditDepartment } from "@/types";

export default function useEditDepartment() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: EditDepartmentMutation, isPending: isUpdateDepartment } =
    useMutation({
      mutationFn: async ({
        orgId,
        departmentId,
        data,
      }: {
        orgId: string;
        departmentId: string;
        data: EditDepartment;
      }) => {
        return auth.editDepartment(orgId, departmentId, data);
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["fetchDepartment"] });
        queryClient.invalidateQueries({ queryKey: ["organizationDashboard"] });
        if (response && response.status === "success") {
          notifySuccess(response.message);
        } else {
          notifyError(response.message);
        }
      },
      onError: (err: any) => {
        const message =
          err.response?.data?.message ||
          err.message ||
          "An error occurred during department update. Please try again.";
        notifyError(message);
      },
    });

  const editDepartment = async (
    orgId: string,
    departmentId: string,
    data: EditDepartment
  ) => {
    await EditDepartmentMutation({ orgId, departmentId, data });
  };

  return { editDepartment, isUpdateDepartment };
}
