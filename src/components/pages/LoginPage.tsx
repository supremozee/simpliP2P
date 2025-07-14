"use client";
import React from "react";
import InputField from "../atoms/Input";
import Button from "../atoms/Button";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useLogin from "@/hooks/useLogin";
import Loader from "../molecules/Loader";
import LoginWithGoogle from "../molecules/LoginWithGoogle";
import OrSeparator from "../atoms/OrSeparator";
const LoginPage = () => {
  const { login, loading, errorMessage } = useLogin();
  const LoginSchema = z.object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(6, "Password must be at least 6 characters long"),
  });
  type LoginFormData = z.infer<typeof LoginSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });
  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };
  return (
    <div className="flex h-screen w-full font-roboto">
      {loading && <Loader />}
      <div className="bg-[url('/loginImage.png')] w-full sm:w-1/2 h-1/3 sm:h-full object-cover bg-cover lg:flex hidden flex-col justify-center items-center pt-10">
        <p className="w-[90%] sm:w-[600px] mt-10 sm:mt-28 text-white text-[14px] sm:text-[16px] text-center sm:text-left"></p>
      </div>
      <div className="flex justify-center flex-col gap-4 w-full lg:w-1/2 p-5 lg:p-[100px]">
        <div className="flex flex-col items-center justify-center">
          <strong className="text-[36px] sm:text-[30px] font-[700]">
            Welcome Back
          </strong>
          <p className="text-[16px] sm:text-[12px] text-[#9E9E9E] text-center sm:text-left">
            Log in to manage your procurement process effortlessly
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Email"
            placeholder="Enter your email"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <Link
            href={"/forgot-password"}
            className="font-bold text-end text-primary underline text-[12px]"
          >
            Forgot Password?
          </Link>
          <Button
            className="text-white rounded-[12px] justify-center"
            type="submit"
          >
            {loading ? "Processing..." : "Login"}
          </Button>
          <OrSeparator />
        </form>
        <LoginWithGoogle />
        <div className="flex justify-center items-center text-center">
          <p>Don’t have an account? </p>
          <Link
            href={"/register"}
            className="text-primary font-[500] underline ml-0.5"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
