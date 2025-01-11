// auth
export type RegisterFormData = {
    first_name: string;
    last_name: string;
    company_name: string;
    company_role: string;
    company_address: string;
    email: string;
    password: string;
    phone: string;
  };

  export interface RegisterResponse {
    status: string;
    message: string;
    data: Record<string, string>;
  }
  export interface LoginFormData { 
    email:string;
    password: string;
  }
  export interface forgotData { 
    email:string;
  }
  export interface verifyData { 
    token:string;
  }
  export interface ResetFormData { 
    token:string;
    new_password: string;
  }
  export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name: string;
    company_role: string;
    company_address: string;
    profile_picture: string | null;
    role: string;
    provider: string;
    is_verified: boolean;
    verified_at: string;
  }
  
  export interface LoginResponse {
    status: string;
    message: string;
    data: {
      user: User;
      access_token: string;
    };
  }