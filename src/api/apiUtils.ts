
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
  
  export const getConfig = (oid?:string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    }
    if (oid) {
      headers.oid = oid;
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
  
  export const postFormDataConfig = (formData: FormData) => ({
    method: "POST" as const ,
    body: formData,
  });