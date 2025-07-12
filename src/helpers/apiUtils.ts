import { VerifySubDomain, VerifySubDomainHeader } from "@/types";

// apiUtils.ts
export const postConfig = <T>(data: T, oid?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (oid) {
    headers.oid = oid;
  }
  return {
    method: "POST" as const,
    headers,
    body: JSON.stringify(data),
  };
};
export const postVerifySubdomainConfig = (subDomain:VerifySubDomain, X:VerifySubDomainHeader) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if(X) {
    headers["x-signature"] = X.x_signature;
    headers["x-timestamp"] = X.x_timestamp
  }

  return {
    method: "POST" as const,
    headers,
    body:JSON.stringify(subDomain)
  };
};
  
export const getConfig = (oid?:string, token?:string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }
  if (oid) {
    headers.oid = oid;
  }
  if(token) {
    headers["X-Resource-Token"] = token;
  }
  return {
    method: "GET" as const,
    headers
  }
};
  
export const putConfig = <T> ( data: T,oid?:string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (oid) {
    headers.oid = oid; 
  }
  return {
    method: "PUT" as const,
    headers,
    body: JSON.stringify(data),
  }
};
  
export const patchConfig =<T> (data?: T) => ({
  method: "PATCH" as const,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
  
export const deleteConfig = (oid?:string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (oid) {
    headers.oid = oid;
  }
  return {
   method: "DELETE" as const,
  headers,
  };
}
  
export const postFormDataConfig = (file: FormData) => ({
  method: "POST" as const ,
  body: file,
});
export const postFileDataConfig = (file:File) => ({
  method: "POST" as const ,
  body: file,
});