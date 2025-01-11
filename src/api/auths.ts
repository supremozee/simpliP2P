/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotData, LoginFormData, LoginResponse, RegisterFormData, RegisterResponse, ResetFormData } from "@/types"
import { BASE_URL } from "./base-url"
import { apiRequest } from "./apiRequest"
import Cookies from "js-cookie"
const auth = {
  register: async (registerData:RegisterFormData):Promise<RegisterResponse | any>=> {
   await apiRequest(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
   })
  },
  login: async (data: LoginFormData): Promise<any> => {
    const response:LoginResponse = await apiRequest(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    Cookies.set('simpliToken', response.data.access_token, {
      domain: 'localhost',
      path: "/",
      secure: true,
      sameSite: "strict", 
      expires: 7
    });
    Cookies.set('simpliToken', response.data.access_token, {
      domain: '',
      path: "/",
      secure: true,
      sameSite: "strict", 
      expires: 7
    });

    return response;
  },
  verifyEmail: async(token:forgotData):Promise<any> => {
    const response = await apiRequest(`${BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(token)
    });
    return response;
  },
  forgotPassword:async(email:string):Promise<any> => {
    const response = await apiRequest(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email)
    });
    return response;
  },
  resetPassword:async(data:ResetFormData):Promise<any> => {
    const response = await apiRequest(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response;
  },
  initiateGoogle: async (): Promise<any> => {
    const response = await apiRequest(`${BASE_URL}/auth/google/initiate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  },
  handleGoogleCallback: async(code:string):Promise<any>=> {
    const response = await apiRequest(`${BASE_URL}/auth/google/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(code)
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