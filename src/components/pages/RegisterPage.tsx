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
import useRegister from "@/hooks/useRegister";
import Loader from "../molecules/Loader";
import useNotify from "@/hooks/useNotify";
import LoginWithGoogle from "../molecules/LoginWithGoogle";
import OrSeparator from "../atoms/OrSeparator";
import Image from "next/image";
const RegisterSchema = z
  .object({
    first_name: z.string().min(1, "First Name is required"),
    last_name: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    confirm_password: z.string().min(6, "Please confirm your password"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to our terms",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof RegisterSchema>;

const RegisterPage = () => {
  const {
    register: registerUser,
    loading,
    errorMessage,
    successSignup,
    setSuccessSignup,
  } = useRegister();
  const { error } = useNotify();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const password = watch("password");
  const onSubmit = async (data: RegisterFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm_password, agreeToTerms, ...payload } = data;
    if (!data.agreeToTerms) {
      error("You must agree to our terms");
      return;
    }
    await registerUser(payload);
    reset();
  };

  if (successSignup) {
    return (
      <AuthModal onClose={() => setSuccessSignup(false)} isOpen>
        <div className="w-full h-[339px] justify-center items-center flex flex-col gap-10 rounded-t-[17px] text-black">
          <p className="font-bold text-primary text-[28px] mt-5 translate-x-1 transition-all animate-pulse">
            Welcome To SimpliP2P!
          </p>
          <Logo theme="black" />
          <p className="text-center text-xl">
            A confirmation mail was sent to your mail, please click on it to
            verify your account. Thank you! <br />
            <br />
            <Link
              href="/create-organization"
              className="text-[#346D4D] ml-2 underline font-bold"
            >
              Kindly click here to Create organization after confirmation
            </Link>
          </p>
        </div>
      </AuthModal>
    );
  }
  return (
    <div className="flex h-screen w-full font-roboto">
      {loading && <Loader />}
      <section className="flex w-full">
        {/* Image Side - Hidden on mobile */}
        <div className="hidden md:flex w-1/2 h-full">
          <Image
            src={"/loginImage.png"}
            alt="Sign up image"
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Form Side */}
        <div className="flex justify-center w-full md:w-1/2 flex-col gap-4 p-8 sm:px-20 overflow-y-auto min-h-screen">
          <div className="flex flex-col items-center justify-center mt-[30rem]">
            <strong className="text-[24px] sm:text-[30px] font-[700] text-center">
              Create an Account
            </strong>
            <p className="text-[14px] sm:text-[16px] text-tertiary text-center mt-2">
              Set up your company&apos;s procurement system in minutes
            </p>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <InputField
              label="First Name"
              placeholder="First Name"
              type="text"
              {...register("first_name")}
            />
            {errors.first_name && (
              <p className="text-red-500">{errors.first_name.message}</p>
            )}

            <InputField
              label="Last Name"
              placeholder="Last Name"
              type="text"
              {...register("last_name")}
            />
            {errors.last_name && (
              <p className="text-red-500">{errors.last_name.message}</p>
            )}
            <InputField
              label="Email"
              placeholder="johndoe@gmail.com"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            <InputField
              label="Phone Number"
              placeholder="07000000000"
              type="tel"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}

            <InputField
              label="Password"
              value={password || ""}
              type="password"
              placeholder="********"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="********"
              {...register("confirm_password")}
              onPaste={(e) => e.preventDefault()}
            />
            {errors.confirm_password && (
              <p className="text-red-500">{errors.confirm_password.message}</p>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("agreeToTerms")}
                className="mr-2"
              />
              <label htmlFor="agreeToTerms" className="text-sm #181819">
                I agree to the terms and conditions
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-500">{errors.agreeToTerms.message}</p>
            )}

            <p className="text-red-500 text-lg">{errorMessage}</p>
            <Button
              className="text-white rounded-[12px] justify-center"
              type="submit"
            >
              {loading ? "Processing..." : "Create Account"}
            </Button>
          </form>
          <OrSeparator />
          <LoginWithGoogle />
          <div className="flex justify-center items-center text-center">
            <p>Already have an account? </p>
            <Link href={"/login"} className="text-primary font-[500] underline">
              Sign in
            </Link>
          </div>
          <Link
            href={"/"}
            className="text-primary text-center mt-5 text-lg underline"
          >
            Go Back Home
          </Link>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
