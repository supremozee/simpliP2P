// constants.ts
import { BASE_URL } from "./base-url";

export const AUTH_ENDPOINTS = {
  SIGNUP: `${BASE_URL}/auth/signup`,
  LOGIN: `${BASE_URL}/auth/login`,
  VERIFY_EMAIL: `${BASE_URL}/auth/verify-email`,
  REFRESH_TOKEN: `${BASE_URL}/auth/refresh-token`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/initiate-reset-password`,
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  INITIATE_GOOGLE: `${BASE_URL}/auth/google/initiate`,
  GOOGLE_CALLBACK: `${BASE_URL}/auth/google/callback`,
  LOGOUT:`${BASE_URL}/auth/logout`,
  LOGOUT_ALL: `${BASE_URL}/auth/logout-all`,
  VERIFY_SUBDOMAIN: `${BASE_URL}/subdomains/verify`
};

export const USER_ENDPOINTS = {
  PROFILE_PICTURE: `${BASE_URL}/users/me/profile-picture`,
  USER_DETAILS: `${BASE_URL}/users/me`,
  UPDATE_USER: `${BASE_URL}/users/me`,
  PURCHASE_ITEMS: `${BASE_URL}/purchase-items`,
  UPDATE_ITEM:(itemId:string)=> `${BASE_URL}/purchase-items/${itemId}`,
  DELETE_ITEM: (itemId:string)=>`${BASE_URL}/purchase-items/${itemId}`,
  GET_ITEMS_BY_PRNUMBER: `${BASE_URL}/purchase-items/`,
  FINALISE_REQUISITION: `${BASE_URL}/purchase-requisitions/finalize`,
  COMMENTS: `${BASE_URL}/comments`,
  BUDGETS: `${BASE_URL}/budgets`,
  FILE_MANAGER: `${BASE_URL}/files/upload`
}
export const ORGANIZATION_ENDPOINTS = {
  ORGANIZATIONS: `${BASE_URL}/organisations`,
  EXPORT: (orgId:string)=> `${BASE_URL}/organisations/${orgId}/export`,
  EXPORT_SELECTED: (orgId:string)=> `${BASE_URL}/organisations/${orgId}/export/selected`,
  BULK_UPLOAD: (orgId:string)=> `${BASE_URL}/organisations/${orgId}/products/upload/bulk`,
  DASHBOARD: (orgId: string) => `${BASE_URL}/organisations/${orgId}/dashboard`,
  INVITE_MEMBER: (orgId: string) => `${BASE_URL}/organisations/${orgId}/invite-member`,
  ACCEPT_INVITATION: (orgId: string) => `${BASE_URL}/organisations/${orgId}/accept-invitation`,
  MEMBERS: (orgId: string) => `${BASE_URL}/organisations/${orgId}/members`,
  MEMBER_BY_ID: (orgId: string, memberId: string) => `${BASE_URL}/organisations/${orgId}/members/${memberId}`,
  DEACTIVATE_MEMBER: (orgId: string, memberId: string) => `${BASE_URL}/organisations/${orgId}/members/${memberId}/deactivate`,
  REACTIVATE_MEMBER: (orgId: string, memberId: string) => `${BASE_URL}/organisations/${orgId}/members/${memberId}/reactivate`,
  SUPPLIERS: (orgId: string) => `${BASE_URL}/organisations/${orgId}/suppliers`,
  SUPPLIER_BY_ID: (orgId: string, supplierId: string) => `${BASE_URL}/organisations/${orgId}/suppliers/${supplierId}`,
  REQUISITIONS: (orgId: string) => `${BASE_URL}/organisations/${orgId}/requisitions`,
  REQUISITIONS_BY_ID: (orgId: string, reqId:string) => `${BASE_URL}/organisations/${orgId}/requisitions/${reqId}`,
  REQUISITIONS_SAVED_FOR_LATER: (orgId: string) => `${BASE_URL}/organisations/${orgId}/requisitions/saved`,
  UPDATE_REQUISITION_STATUS: (orgId: string, reqId:string) =>`${BASE_URL}/organisations/${orgId}/requisitions/${reqId}/approval`,
  UPDATE_ORDER_STATUS: (orgId: string, orderId:string) =>`${BASE_URL}/organisations/${orgId}/orders/${orderId}/status`,
  AUDIT_LOGS: (orgId: string) => `${BASE_URL}/organisations/${orgId}/audit-logs`,
  AUDIT_LOGS_BY_USER: (orgId: string, userId: string) => `${BASE_URL}/organisations/${orgId}/audit-logs/${userId}`,
  PRODUCTS: (orgId: string) => `${BASE_URL}/organisations/${orgId}/products`,
  PRODUCT_BY_ID: (orgId: string, productId: string) => `${BASE_URL}/organisations/${orgId}/products/${productId}`,
  BRANCHES: (orgId: string) => `${BASE_URL}/organisations/${orgId}/branches`,
  BRANCH_BY_ID: (orgId: string, branchId: string) => `${BASE_URL}/organisations/${orgId}/branches/${branchId}`,
  DEPARTMENTS: (orgId: string) => `${BASE_URL}/organisations/${orgId}/departments`,
  DEPARTMENT_BY_ID: (orgId: string, departmentId: string) => `${BASE_URL}/organisations/${orgId}/departments/${departmentId}`,
  CATEGORY: (orgId: string) => `${BASE_URL}/organisations/${orgId}/categories`,
  CATEGORY_BY_ID: (orgId: string, categoryId: string) => `${BASE_URL}/organisations/${orgId}/categories/${categoryId}`,
  EDIT_CATEGORY: (orgId:string, categoryId:string) => `${BASE_URL}/organisations/${orgId}/categories/${categoryId}`,
  EDIT_BRANCH: (orgId: string, branchId: string) => `${BASE_URL}/organisations/${orgId}/branches/${branchId}`,
DELETE_BRANCH: (orgId: string, branchId: string) => `${BASE_URL}/organisations/${orgId}/branches/${branchId}`,
EDIT_DEPARTMENT: (orgId: string, departmentId: string) => `${BASE_URL}/organisations/${orgId}/departments/${departmentId}`,
DELETE_DEPARTMENT: (orgId: string, departmentId: string) => `${BASE_URL}/organisations/${orgId}/departments/${departmentId}`,
  DELETE_CATEGORY: (orgId: string, categoryId: string) => `${BASE_URL}/organisations/${orgId}/categories/${categoryId}`,
  INITIALIZE_PURCHASE_REQUISITION: ()=> `${BASE_URL}/purchase-requisitions/initialize`,
  SAVED_FOR_LATER: (orgId:string)=> `${BASE_URL}/organisations/${orgId}/requisitions/saved`,
  ORDERS: (orgId:string)=> `${BASE_URL}/organisations/${orgId}/orders`,
  ORDER_BY_ID: (orgId:string, id:string)=> `${BASE_URL}/organisations/${orgId}/orders/${id}`,
  VIEW_PO:(orderId:string)=>`${BASE_URL}/purchase-orders/${orderId}`
};
