"use client";
import React from "react";
import InputField from "../atoms/Input";
import Button from "../atoms/Button";
import Link from "next/link";
import { z } from "zod";
import AuthModal from "../atoms/Modal/AuthModal";
import Logo from "../atoms/Logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "../molecules/Loader";
import useCreateOrganization from "@/hooks/useCreateOrganization";
import { OrganizationData } from "@/types";
import useStore from "@/store";
import OrSeparator from "../atoms/OrSeparator";
const OrganizationSchema = z.object({
  name: z.string().min(1, "Your Name is required"),
  address: z.string().min(1, "Your address is required"),
  creator_role: z.string().min(1, "Your role is required"),
});

type OrganizationFormData = z.infer<typeof OrganizationSchema>;

const CreateOrganizationPage = () => {
  const { orgName, userId } = useStore();
  const {
    organization,
    loading,
    successMessage,
    createOrganization,
    setCreateOrganization,
    errorMessage,
  } = useCreateOrganization();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(OrganizationSchema),
  });

  const onSubmit = async (data: OrganizationData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await organization(data);
    reset();
  };

  if (createOrganization) {
    return (
      <AuthModal onClose={() => setCreateOrganization(false)} isOpen size="sm">
        <div className="w-full px-6 py-8 flex flex-col items-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-primary text-center">
            Congratulations!
          </h2>

          <Logo theme="black" className="w-32" />

          <div className="text-center space-y-4">
            <p className="text-lg #181819">{successMessage}</p>
            <Link
              href={`/${orgName}/dashboard`}
              className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </AuthModal>
    );
  }
  return (
    <div className="flex h-auto w-full font-roboto">
      {loading && <Loader />}
      <div className="bg-[url('/hero-bg.png')] w-full sm:w-1/2 h-1/3 sm:h-auto object-cover bg-cover sm:flex hidden flex-col justify-center items-center pt-10">
        <p className="w-[90%] sm:w-[600px] mt-10 sm:mt-28 text-white font-bold text-[14px] sm:text-[16px] text-center sm:text-left">
          Create a new Organization by providing your company name, role, and
          contact information
        </p>
      </div>
      <div className="flex justify-center flex-col gap-4 w-full sm:w-1/2 p-5 sm:p-[150px]">
        <div className="flex flex-col items-center justify-center">
          <strong className="text-[24px] sm:text-[30px] font-[700]">
            Create Organization
          </strong>
          <p className="text-[16px] sm:text-[12px] text-[#9E9E9E] text-center sm:text-left">
            Set up your company&apos;s procurement system in minutes
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Name"
            placeholder="Name of your company"
            type="text"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          <InputField
            label="Company Address"
            placeholder="Ikeja Oba Akran"
            type="text"
            {...register("address")}
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}

          <InputField
            label="Creator's Role"
            type="text"
            placeholder="Role"
            {...register("creator_role")}
          />
          {errors.creator_role && (
            <p className="text-red-500">{errors.creator_role.message}</p>
          )}
          <p className="text-red-500 text-lg">{errorMessage}</p>
          <Button
            className="text-white rounded-[12px] justify-center"
            type="submit"
          >
            {loading ? "Processing..." : "Create Organization"}
          </Button>
        </form>
        <OrSeparator/>
        <Link
          href={`/${userId}`}
          className="text-primary text-center mt-5 text-lg underline"
        >
          View organizations
        </Link>
      </div>
    </div>
  );
};

export default CreateOrganizationPage;
