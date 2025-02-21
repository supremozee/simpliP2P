import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../atoms/Input';
import useFetchOrganizationById from '@/hooks/useFetchOrganizationById';
import useUpdateOrganization from '@/hooks/useUpdateOrganization';
import useStore from '@/store';
import Button from '../atoms/Button';
import Image from 'next/image';
import { MdModeEdit } from 'react-icons/md';
import useUploadOrganizationLogo from '@/hooks/useUploadOrganizationLogo';
import useUserPermissions from '@/hooks/useUserPermissions';
import useNotify from '@/hooks/useNotify';
import LoaderSpinner from '../atoms/LoaderSpinner';

const OrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  address: z.string().min(1, "Organization address is required"),
  creator_role: z.string().min(1, "Creator role is required"),
  tenant_code: z.string().optional(),
});

type OrganizationFormType = z.infer<typeof OrganizationSchema>;

const DEFAULT_LOGO = "/placeholder-org.png";

const OrganizationProfile = () => {
  const { currentOrg } = useStore();
  const { data, isLoading, isError, error } = useFetchOrganizationById(currentOrg);
  const { updateOrganization } = useUpdateOrganization(currentOrg);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadOrganizationLogo, loading: isUploading, errorMessage: uploadError } = useUploadOrganizationLogo();
  const { getUserPermissions } = useUserPermissions();
  const { error: showError, success: showSuccess } = useNotify();
  const { isCreator } = getUserPermissions();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<OrganizationFormType>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues: {
      name: '',
      address: '',
      creator_role: '',
      tenant_code: '',
    }
  });

  const organisation = data?.data;

  useEffect(() => {
    if (organisation) {
      reset({
        name: organisation.name || '',
        address: organisation.address || '',
        creator_role: organisation.creator_role || '',
        tenant_code: organisation.tenant_code || '',
      });
      setImagePreview(organisation.logo || null);
    }
  }, [organisation, reset]);

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
        <p className="text-sm mt-1">{error?.message || 'An unexpected error occurred'}</p>
      </div>
    );
  }

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCreator) {
      showError("You don't have permission to change the logo");
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    try {
      const response = await uploadOrganizationLogo(file, currentOrg);
      
      if (response?.status === 'success' && response.data?.url) {
        setImagePreview(response.data.url);
        setUploadPreview(null);
        showSuccess('Logo updated successfully');
      } else {
        throw new Error('Failed to upload logo');
      }
    } catch {
      showError('Failed to upload logo. Please try again.');
      setUploadPreview(null);
    }
  };

  const onSubmit = async (formData: OrganizationFormType) => {
    if (!isCreator) {
      showError("You don't have permission to update organization settings");
      return;
    }

    try {
      setIsUpdating(true);
      await updateOrganization(formData);
      showSuccess('Organization profile updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update organization profile';
      showError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Organization Profile</h2>
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
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}

          <Input
            type="text"
            label="Role"
            placeholder="Enter your role"
            {...register("creator_role")}
            disabled={!isCreator}
          />
          {errors.creator_role && <p className="text-red-500 text-sm mt-1">{errors.creator_role.message}</p>}

          <Input
            type="text"
            label="Organization Address"
            placeholder="Enter organization address"
            {...register("address")}
            disabled={!isCreator}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}

          <Input
            type="text"
            label="Tenant Code"
            placeholder="Enter tenant code"
            {...register("tenant_code")}
            disabled={!isCreator}
          />
          {errors.tenant_code && <p className="text-red-500 text-sm mt-1">{errors.tenant_code.message}</p>}
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden bg-gray-100">
              <Image
                src={uploadPreview || imagePreview || DEFAULT_LOGO}
                alt="Organization Logo"
                fill
                className="object-cover"
              />
              {isCreator && (
                <Button
                  type="button"
                  className="absolute bottom-2 right-2 rounded-full w-10 h-10 p-0 flex justify-center items-center bg-primary hover:bg-primary/90"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <MdModeEdit size={20} className="text-white" />
                </Button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleLogoChange}
              disabled={!isCreator || isUploading}
            />
          </div>
          {uploadError && (
            <p className="text-red-500 text-sm text-center">{uploadError}</p>
          )}
          {isUploading && (
            <div className="flex items-center gap-2">
              <LoaderSpinner size="sm" />
              <p className="text-sm text-gray-500">Uploading logo...</p>
            </div>
          )}
        </div>
      </div>

      {isCreator && (
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-4 py-2 text-white bg-primary hover:bg-primary/90"
            disabled={isUpdating || isUploading}
          >
            {isUpdating ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default OrganizationProfile;