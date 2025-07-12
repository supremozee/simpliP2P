import useStore from "@/store";
import useRequisitionsData from "./useRequisitionsData";
import useFetchRequsitionsSavedForLater from "./useFetchRequistionsSavedForLater";
import { Requisition } from "@/types";

interface UseGetRequisitionsOptions {
  enablePagination?: boolean;
  page?: number;
  pageSize?: number;
}

export const useGetRequisitions = (options: UseGetRequisitionsOptions = {}) => {
  const { currentOrg, pr } = useStore();
  const { enablePagination = false, page = 1, pageSize = 20 } = options;

  // Fetch data for different requisition states using the new dual-fetch approach
  const {
    paginatedData: allRequisitionsPagedData,
    allData: allRequisitionsCompleteData,
    isPaginatedLoading: isAllRequisitionsLoading,
    isAllDataLoading: isAllRequisitionsCompleteLoading,
  } = useRequisitionsData(
    currentOrg,
    undefined,
    enablePagination ? page : 1,
    enablePagination ? pageSize : 10000
  );

  const {
    paginatedData: pendingRequisitionsPagedData,
    allData: pendingRequisitionsCompleteData,
    isPaginatedLoading: isPendingLoading,
  } = useRequisitionsData(
    currentOrg,
    "PENDING",
    enablePagination ? page : 1,
    enablePagination ? pageSize : 10000
  );

  const {
    paginatedData: approvedRequisitionsPagedData,
    allData: approvedRequisitionsCompleteData,
    isPaginatedLoading: isApprovedLoading,
  } = useRequisitionsData(
    currentOrg,
    "APPROVED",
    enablePagination ? page : 1,
    enablePagination ? pageSize : 10000
  );

  const {
    paginatedData: rejectedRequisitionsPagedData,
    allData: rejectedRequisitionsCompleteData,
    isPaginatedLoading: isRejectedLoading,
  } = useRequisitionsData(
    currentOrg,
    "REJECTED",
    enablePagination ? page : 1,
    enablePagination ? pageSize : 10000
  );

  const {
    paginatedData: requestRequisitionsPagedData,
    allData: requestRequisitionsCompleteData,
    isPaginatedLoading: isRequestLoading,
  } = useRequisitionsData(
    currentOrg,
    "REQUEST_MODIFICATION",
    enablePagination ? page : 1,
    enablePagination ? pageSize : 10000
  );

  // Still use the existing hook for saved requisitions as it's different
  const { data: savedRequisitionsData, isLoading: isLoadingSavedRequisitions } =
    useFetchRequsitionsSavedForLater(currentOrg);

  // Extract requisitions data - use paginated for display, complete for counts
  const allRequisitions = enablePagination
    ? allRequisitionsPagedData?.data?.requisitions || []
    : allRequisitionsCompleteData?.data?.requisitions || [];

  const allRequisitionsComplete =
    allRequisitionsCompleteData?.data?.requisitions || [];
  const savedRequisitions = savedRequisitionsData?.data?.requisitions || [];

  const pendingRequisitions = enablePagination
    ? pendingRequisitionsPagedData?.data?.requisitions || []
    : pendingRequisitionsCompleteData?.data?.requisitions || [];

  const pendingRequisitionsComplete =
    pendingRequisitionsCompleteData?.data?.requisitions || [];

  const approvedRequisitions = enablePagination
    ? approvedRequisitionsPagedData?.data?.requisitions || []
    : approvedRequisitionsCompleteData?.data?.requisitions || [];

  const approvedRequisitionsComplete =
    approvedRequisitionsCompleteData?.data?.requisitions || [];

  const rejectedRequisitions = enablePagination
    ? rejectedRequisitionsPagedData?.data?.requisitions || []
    : rejectedRequisitionsCompleteData?.data?.requisitions || [];

  const rejectedRequisitionsComplete =
    rejectedRequisitionsCompleteData?.data?.requisitions || [];

  const requestRequisitions = enablePagination
    ? requestRequisitionsPagedData?.data?.requisitions || []
    : requestRequisitionsCompleteData?.data?.requisitions || [];

  const requestRequisitionsComplete =
    requestRequisitionsCompleteData?.data?.requisitions || [];

  const showForSavedOnly = savedRequisitions.find(
    (req: Requisition) => req.pr_number === pr?.pr_number
  );

  const isDisabled =
    approvedRequisitionsComplete.find(
      (req: Requisition) => req.pr_number === pr?.pr_number
    ) ||
    pendingRequisitionsComplete.find(
      (req: Requisition) => req.pr_number === pr?.pr_number
    ) ||
    rejectedRequisitionsComplete.find(
      (req: Requisition) => req.pr_number === pr?.pr_number
    );

  // Pagination metadata (available when pagination is enabled)
  const paginationMetadata = enablePagination
    ? {
        allRequisitionsMeta: allRequisitionsPagedData?.data?.metadata,
        pendingRequisitionsMeta: pendingRequisitionsPagedData?.data?.metadata,
        approvedRequisitionsMeta: approvedRequisitionsPagedData?.data?.metadata,
        rejectedRequisitionsMeta: rejectedRequisitionsPagedData?.data?.metadata,
        requestRequisitionsMeta: requestRequisitionsPagedData?.data?.metadata,
      }
    : undefined;

  return {
    // Display data (paginated if enabled, complete otherwise)
    allRequisitions,
    savedRequisitions,
    pendingRequisitions,
    approvedRequisitions,
    rejectedRequisitions,
    requestRequisitions,

    // Complete data for accurate counts and comprehensive search
    allRequisitionsComplete,
    pendingRequisitionsComplete,
    approvedRequisitionsComplete,
    rejectedRequisitionsComplete,
    requestRequisitionsComplete,

    // Loading states
    isLoadingSavedRequisitions,
    isPendingLoading,
    isApprovedLoading,
    isRejectedLoading,
    isRequestLoading,
    isAllRequisitionsLoading,
    isAllRequisitionsCompleteLoading,

    // Pagination metadata
    paginationMetadata,

    // Legacy props for compatibility
    showForSavedOnly,
    isDisabled,
  };
};
