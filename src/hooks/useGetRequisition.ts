import useStore from "@/store";
import useFetchPurchaseRequisition from "./useFetchPurchaseRequisition";
import useFetchRequsitionsSavedForLater from "./useFetchRequistionsSavedForLater";

export const useGetRequisitions = () => {
  const { currentOrg, pr } = useStore();

  // Fetch data for different requisition states
    const { data:allRequisitionsData, isLoading:isAllRequisitionsLoading } = useFetchPurchaseRequisition(currentOrg);
  const { data: savedRequisitionsData, isLoading: isLoadingSavedRequisitions } = useFetchRequsitionsSavedForLater(currentOrg);
  const { data: pendingRequisitionsData, isLoading: isPendingLoading } = useFetchPurchaseRequisition(currentOrg, "PENDING");
  const { data: approvedRequisitionsData, isLoading: isApprovedLoading } = useFetchPurchaseRequisition(currentOrg, "APPROVED");
  const { data: rejectedRequisitionsData, isLoading: isRejectedLoading } = useFetchPurchaseRequisition(currentOrg, "REJECTED");
  const { data: requestRequisitionsData, isLoading: isRequestLoading } = useFetchPurchaseRequisition(currentOrg, "REQUEST_MODIFICATION");

  const allRequisitions = allRequisitionsData?.data?.requisitions || []
  const savedRequisitions = savedRequisitionsData?.data?.requisitions || [];
  const pendingRequisitions = pendingRequisitionsData?.data?.requisitions || [];
  const approvedRequisitions = approvedRequisitionsData?.data?.requisitions || [];
  const rejectedRequisitions = rejectedRequisitionsData?.data?.requisitions || [];
  const requestRequisitions = requestRequisitionsData?.data?.requisitions || [];

  const showForSavedOnly = savedRequisitions.find((req)=>req.pr_number === pr?.pr_number)


  const isDisabled =
    approvedRequisitions.find((req) => req.pr_number === pr?.pr_number) ||
    pendingRequisitions.find((req) => req.pr_number === pr?.pr_number) ||
    rejectedRequisitions.find((req) => req.pr_number === pr?.pr_number);

  return {
    allRequisitions,
    savedRequisitions,
    pendingRequisitions,
    approvedRequisitions,
    rejectedRequisitions,
    requestRequisitions,
    isLoadingSavedRequisitions,
    isPendingLoading,
    isApprovedLoading,
    isRejectedLoading,
    isRequestLoading,
    isAllRequisitionsLoading,
    showForSavedOnly,
    isDisabled,
  };
};