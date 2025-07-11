import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../atoms/Input";
import useFetchOrganizationById from "@/hooks/useFetchOrganizationById";
import useUpdateOrganization from "@/hooks/useUpdateOrganization";
import useStore from "@/store";
import Button from "../atoms/Button";
import Image from "next/image";
import { MdModeEdit } from "react-icons/md";
import useUploadOrganizationLogo from "@/hooks/useUploadOrganizationLogo";
import useUserPermissions from "@/hooks/useUserPermissions";
import useNotify from "@/hooks/useNotify";
import LoaderSpinner from "../atoms/LoaderSpinner";
import useGetUser from "@/hooks/useGetUser";
import { cn } from "@/utils/cn";

const OrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  address: z.string().min(1, "Organization address is required"),
});

type OrganizationFormType = z.infer<typeof OrganizationSchema>;

const OrganizationProfile = () => {
  const { currentOrg } = useStore();
  const { data, isLoading, isError, error } =
    useFetchOrganizationById(currentOrg);
  const { updateOrganization } = useUpdateOrganization(currentOrg);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    uploadOrganizationLogo,
    loading: isUploading,
    errorMessage: uploadError,
  } = useUploadOrganizationLogo();
  const { getUserPermissions } = useUserPermissions();
  const { error: showError, success: showSuccess } = useNotify();
  const { isCreator } = getUserPermissions();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OrganizationFormType>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const handleUploadLogo = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        setIsImageLoading(true);
        await uploadOrganizationLogo(file, currentOrg);
      } catch {
      } finally {
        setIsImageLoading(false);
      }
    }
  };

  const organisation = data?.data;
  const { user } = useGetUser();
  const getUserRole = user?.data?.user_organisations?.find(
    (org) => org.org_id === currentOrg
  );

  useEffect(() => {
    if (organisation) {
      setValue("name", organisation.name || "");
      setValue("address", organisation.address || "");
    }
  }, [organisation, setValue]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderSpinner size="lg" text="Loading organization details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">Error loading organization</p>
        <p className="text-sm mt-1">
          {error?.message || "An unexpected error occurred"}
        </p>
      </div>
    );
  }

  const onSubmit = async (formData: OrganizationFormType) => {
    if (!isCreator) {
      showError("You don't have permission to update organization settings");
      return;
    }

    try {
      setIsUpdating(true);
      await updateOrganization(formData);
      showSuccess("Organization profile updated successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update organization profile";
      showError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-primary">
          Organization Profile
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Input
            type="text"
            label="Organization Name"
            placeholder="Enter organization name"
            {...register("name")}
            disabled={!isCreator}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}

          <Input
            type="text"
            label="Role"
            value={getUserRole?.role}
            name="role"
            placeholder="Enter your role"
            disabled={true}
          />

          <Input
            type="text"
            label="Organization Address"
            placeholder="Enter organization address"
            {...register("address")}
            disabled={!isCreator}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}

          <Input
            type="text"
            label="Organization Code"
            placeholder="Enter Organization Code"
            value={organisation?.tenant_code}
            name="tenant_code"
            disabled={true}
          />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-[300px] h-[300px]">
            <div
              className={cn(
                "w-full h-full rounded-full flex justify-center flex-col items-center overflow-hidden",
                "border-4 border-gray-100 shadow-lg"
              )}
            >
              {isImageLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <LoaderSpinner size="lg" />
                </div>
              ) : (
                <Image
                  src={getUserRole?.logo || "/logo-black.png"}
                  alt="Organization Logo"
                  width={200}
                  height={200}
                  className="object-cover bg-contain w-full h-full rounded-full"
                />
              )}
            </div>
            {isCreator && (
              <Button
                type="button"
                className="absolute right-2 bottom-2 w-[40px] h-[40px] rounded-full p-0 flex justify-center items-center bg-primary hover:bg-primary/90 shadow-lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <MdModeEdit size={24} className="text-white" />
              </Button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleUploadLogo}
              disabled={!isCreator || isUploading}
            />
          </div>
          {uploadError && (
            <p className="text-red-500 text-sm text-center">{uploadError}</p>
          )}
          {isUploading && (
            <div className="flex items-center gap-2">
              <LoaderSpinner size="sm" />
              <span className="text-sm text-gray-600">Uploading logo...</span>
            </div>
          )}
        </div>
      </div>

      {isCreator && (
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-6 py-2 text-white bg-primary hover:bg-primary/90 rounded-lg"
            disabled={isUpdating || isUploading}
          >
            {isUpdating ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default OrganizationProfile;
