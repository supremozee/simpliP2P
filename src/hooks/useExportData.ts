import { useMutation } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import useNotify from "./useNotify";

interface ExportDataParams {
  orgId: string;
  startDate: string;
  endDate: string;
  format: string;
  type: string;
}

export default function useExportData({
  orgId,
  startDate,
  endDate,
  format,
  type,
}: ExportDataParams) {
  const { error: showError } = useNotify();

  return useMutation({
    mutationKey: ["exportData", orgId, startDate, endDate, format, type],
    mutationFn: async () => {
      try {
        return await auth.export(orgId, startDate, endDate, format, type);
      } catch {
        showError("Export failed");
      }
    },
  });
}
