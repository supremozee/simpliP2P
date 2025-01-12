/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotData, verifyData, LoginFormData, LoginResponse, RegisterFormData, RegisterResponse, ResetFormData, InitiateGoogleResponse, CallbackType, CallbackResponse, ResetResponse } from "@/types"
import { BASE_URL } from "./base-url"
import { apiRequest } from "./apiRequest"
import Cookies from "js-cookie"
const auth = {
  register: async (registerData:RegisterFormData):Promise<any>=> {
   const response:RegisterResponse = await apiRequest(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
   })
   return response
  },
  login: async (data: LoginFormData): Promise<any> => {
    const response:LoginResponse = await apiRequest(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    Cookies.set('simpliToken', response.data?.access_token, {
      domain: 'localhost',
      path: "/",
      secure: true,
      sameSite: "strict", 
      expires: 7
    });
    Cookies.set('simpliToken', response.data?.access_token, {
      domain: 'simplip2p.vercel.app',
      path: "/",
      secure: true,
      sameSite: "strict", 
      expires: 7
    });

    return response;
  },
  verifyEmail: async(token:verifyData):Promise<any> => {
    const response = await apiRequest(`${BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(token)
    });
    return response;
  },
  forgotPassword:async(email:forgotData):Promise<any> => {
    const response = await apiRequest(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email)
    });
    return response;
  },
  resetPassword:async(data:ResetFormData):Promise<any> => {
    const response:ResetResponse = await apiRequest(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response;
  },
  initiateGoogle: async (): Promise<any> => {
    const response:InitiateGoogleResponse = await apiRequest(`${BASE_URL}/auth/google/initiate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  },
  handleGoogleCallback: async(code:CallbackType):Promise<any>=> {
    const response:CallbackResponse = await apiRequest(`${BASE_URL}/auth/google/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(code)
    });
    Cookies.set('simpliToken', response.data?.token, {
      domain: 'localhost',
      path: "/",
      secure: true,
      sameSite: "strict", 
      expires: 7
    });
    Cookies.set('simpliToken', response.data?.token, {
      domain: 'simplip2p.vercel.app',
      path: "/",
      secure: true,
      sameSite: "strict", 
      expires: 7
    });
    return response;
  },
  uploadProfilePicture:async(formData:FormData): Promise<any>=> {
     const response = await apiRequest(`${BASE_URL}/user/profile-picture`, {
      method: "POST",
      body: formData
    });
    return response
  }
}
export { auth}