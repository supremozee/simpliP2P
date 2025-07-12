import { auth } from "@/helpers/auths";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import useNotify from "./useNotify";

const useBulkUpload = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const { success, error: notifyError } = useNotify();
  const { mutateAsync: BulkUpload } = useMutation({
    onMutate() {
      setLoading(false);
      setErrorMessage(null);
    },
    mutationFn: async ({ orgId, data }: { orgId: string; data: File }) => {
      return auth.bulkUpload(orgId, data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess(response: any) {
      setErrorMessage("");
      setLoading(false);
      success(response?.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      notifyError(error?.message);
      setErrorMessage(error?.message);
      setLoading(false);
    },
  });
  const bulkUploadProduct = async (orgId: string, data: File) => {
    return BulkUpload({ orgId, data });
  };
  return {
    bulkUploadProduct,
    loading,
    errorMessage,
  };
};

export default useBulkUpload;
