import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api/auths";

interface ExportDataParams {
  orgId: string;
  startDate: string;
  endDate: string;
  format: string;
  type:string
}

export default function useExportData({ orgId, startDate, endDate, format, type }: ExportDataParams) {
  return useQuery({
    queryKey: ['exportData', orgId, startDate, endDate, format, type],
    queryFn: () => auth.export(orgId, startDate, endDate, format, type),
    enabled: false, 
    refetchOnWindowFocus: false,
  });
}