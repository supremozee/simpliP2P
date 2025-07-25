/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  forgotData,
  verifyData,
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  RegisterResponse,
  ResetFormData,
  InitiateGoogleResponse,
  CallbackType,
  CallbackResponse,
  ResetResponse,
  OrganizationData,
  CreateOrganizationResponse,
  UserProfileResponse,
  OrganizationDashboardByIdResponse,
  inviteMemberResponse,
  inviteMemberData,
  FetchMembersResponse,
  AcceptInvitationData,
  EditMemberData,
  CreateSupplierData,
  FetchSuppliersResponse,
  UpdateSupplierData,
  UpdateSupplierResponse,
  FetchSupplierByIdResponse,
  RefreshToken,
  DeleteSupplierResponse,
  RefreshTokenResponse,
  CreatePurchaseRequisitionData,
  ProductData,
  ProductResponse,
  FetchProductsResponse,
  User,
  CreateBranch,
  CreateDepartment,
  Logout,
  LogoutAll,
  CreateCategory,
  InitializePurchaseRequisition,
  PurchaseItems,
  UpdateData,
  FinalizePurchaseRequisition,
  PurchaseRequisitionSavedForLater,
  OrganizationResponse,
  Organization,
  PurchaseOrder,
  updateRequisitionStatus,
  Comment,
  updateOrderStatus,
  CreateBudget,
  ExportSelected,
  EditDepartment,
  EditBranch,
  EditCategory,
  VerifySubDomainHeader,
  VerifySubDomain,
} from "@/types";
import { apiRequest } from "./apiRequest";
import { setCookies } from "@/utils/setCookies";
import {
  AUTH_ENDPOINTS,
  ORGANIZATION_ENDPOINTS,
  USER_ENDPOINTS,
} from "./route";
import {
  deleteConfig,
  getConfig,
  patchConfig,
  postConfig,
  postVerifySubdomainConfig,
  putConfig,
} from "./apiUtils";
import Cookies from "js-cookie";
const auth = {
  register: async (
    registerData: RegisterFormData
  ): Promise<RegisterResponse> => {
    return apiRequest(AUTH_ENDPOINTS.SIGNUP, postConfig(registerData));
  },

  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await apiRequest(AUTH_ENDPOINTS.LOGIN, postConfig(data));
    setCookies(response.data.access_token, response?.data?.refresh_token);
    return response;
  },

  verifyEmail: async (token: verifyData): Promise<any> => {
    return apiRequest(AUTH_ENDPOINTS.VERIFY_EMAIL, postConfig(token));
  },

  createOrganization: async (
    data: OrganizationData
  ): Promise<CreateOrganizationResponse> => {
    return apiRequest(ORGANIZATION_ENDPOINTS.ORGANIZATIONS, postConfig(data));
  },

  refreshToken: async (
    refreshToken: RefreshToken
  ): Promise<RefreshTokenResponse> => {
    const response = await apiRequest(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      postConfig(refreshToken)
    );
    setCookies(response.data.access_token, response?.data?.refresh_token);
    return response;
  },

  forgotPassword: async (email: forgotData): Promise<any> => {
    return apiRequest(AUTH_ENDPOINTS.FORGOT_PASSWORD, postConfig(email));
  },

  resetPassword: async (data: ResetFormData): Promise<ResetResponse> => {
    return apiRequest(AUTH_ENDPOINTS.RESET_PASSWORD, postConfig(data));
  },

  initiateGoogle: async (): Promise<InitiateGoogleResponse> => {
    return apiRequest(AUTH_ENDPOINTS.INITIATE_GOOGLE, getConfig());
  },

  handleGoogleCallback: async (
    code: CallbackType
  ): Promise<CallbackResponse> => {
    const response = await apiRequest(
      AUTH_ENDPOINTS.GOOGLE_CALLBACK,
      postConfig(code)
    );
    setCookies(response.data.access_token, response?.data?.refresh_token);
    return response;
  },

  uploadProfilePicture: async (image: File): Promise<any> => {
    const token = Cookies.get("accessToken");
    const formData = new FormData();
    formData.append("file", image);
    const response = await fetch(USER_ENDPOINTS.PROFILE_PICTURE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT add Content-Type - browser will set it with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  },

  uploadOrganizationLogo: async (image: File, orgId: string): Promise<any> => {
    const token = Cookies.get("accessToken");
    const formData = new FormData();
    formData.append("file", image);
    const response = await fetch(
      `${ORGANIZATION_ENDPOINTS.ORGANIZATIONS}/${orgId}/logo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT add Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  },

  getUserDetails: async (): Promise<UserProfileResponse> => {
    return apiRequest(USER_ENDPOINTS.USER_DETAILS, getConfig());
  },

  updateUser: async (data: User): Promise<any> => {
    return apiRequest(USER_ENDPOINTS.UPDATE_USER, putConfig(data));
  },

  organizationDashboardById: async (
    orgId: string
  ): Promise<OrganizationDashboardByIdResponse> => {
    return apiRequest(ORGANIZATION_ENDPOINTS.DASHBOARD(orgId), getConfig());
  },
  organizationById: async (orgId: string): Promise<OrganizationResponse> => {
    return apiRequest(
      `${ORGANIZATION_ENDPOINTS.ORGANIZATIONS}/${orgId}`,
      getConfig()
    );
  },
  updateOrganization: async (
    orgId: string,
    data: Organization
  ): Promise<any> => {
    return apiRequest(
      `${ORGANIZATION_ENDPOINTS.ORGANIZATIONS}/${orgId}`,
      putConfig(data)
    );
  },
  inviteMember: async (
    data: inviteMemberData,
    orgId: string
  ): Promise<inviteMemberResponse> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.INVITE_MEMBER(orgId),
      postConfig(data)
    );
  },
  logout: async (data: Logout): Promise<any> => {
    return apiRequest(AUTH_ENDPOINTS.LOGOUT, postConfig(data));
  },
  logoutAll: async (data: LogoutAll): Promise<any> => {
    return apiRequest(AUTH_ENDPOINTS.LOGOUT_ALL, postConfig(data));
  },
  acceptInvitation: async (
    data: AcceptInvitationData,
    orgId: string
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.ACCEPT_INVITATION(orgId),
      postConfig(data)
    );
  },

  fetchMembers: async (orgId: string): Promise<FetchMembersResponse> => {
    return apiRequest(ORGANIZATION_ENDPOINTS.MEMBERS(orgId), getConfig());
  },

  editMembers: async (
    data: EditMemberData,
    orgId: string,
    membersId: string
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.MEMBER_BY_ID(orgId, membersId),
      patchConfig(data)
    );
  },

  fetchMemberById: async (orgId: string, memberId: string): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.MEMBER_BY_ID(orgId, memberId),
      getConfig()
    );
  },

  deactivateMember: async (orgId: string, memberId: string): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.DEACTIVATE_MEMBER(orgId, memberId),
      patchConfig()
    );
  },

  reactivateMember: async (orgId: string, memberId: string): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.REACTIVATE_MEMBER(orgId, memberId),
      patchConfig()
    );
  },

  createSupplier: async (
    data: CreateSupplierData,
    orgId: string
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.SUPPLIERS(orgId),
      postConfig(data)
    );
  },

  fetchSuppliers: async (
    orgId: string,
    page?: number,
    pageSize?: number
  ): Promise<FetchSuppliersResponse> => {
    return apiRequest(
      `${ORGANIZATION_ENDPOINTS.SUPPLIERS(orgId)}?page=${page}&pageSize=${
        pageSize || 100
      }`,
      getConfig()
    );
  },

  updateSupplier: async (
    orgId: string,
    supplierId: string,
    data: UpdateSupplierData
  ): Promise<UpdateSupplierResponse> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.SUPPLIER_BY_ID(orgId, supplierId),
      putConfig(data)
    );
  },

  deleteSupplier: async (
    orgId: string,
    supplierId: string
  ): Promise<DeleteSupplierResponse> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.SUPPLIER_BY_ID(orgId, supplierId),
      deleteConfig()
    );
  },

  fetchSupplierById: async (
    orgId: string,
    supplierId: string
  ): Promise<FetchSupplierByIdResponse> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.SUPPLIER_BY_ID(orgId, supplierId),
      getConfig()
    );
  },
  auditLogForOrg: async (
    orgId: string,
    pageSize?: number,
    page?: number
  ): Promise<any> => {
    return apiRequest(
      `${ORGANIZATION_ENDPOINTS.AUDIT_LOGS(
        orgId
      )}?page=${page}&pageSize=${pageSize}`,
      getConfig()
    );
  },

  auditLogsByUser: async (
    orgId: string,
    userId: string,
    pageSize?: number,
    page?: number
  ): Promise<any> => {
    return apiRequest(
      `${ORGANIZATION_ENDPOINTS.AUDIT_LOGS_BY_USER(
        orgId,
        userId
      )}?page=${page}&pageSize=${pageSize}`,
      getConfig()
    );
  },

  createProduct: async (
    orgId: string,
    productData: ProductData
  ): Promise<ProductResponse> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.PRODUCTS(orgId),
      postConfig(productData)
    );
  },

  fetchProducts: async (
    orgId: string,
    page: number = 1,
    pageSize: number = 100
  ): Promise<FetchProductsResponse> => {
    return apiRequest(
      `${ORGANIZATION_ENDPOINTS.PRODUCTS(
        orgId
      )}?page=${page}&pageSize=${pageSize}`,
      getConfig()
    );
  },

  deleteProduct: async (
    orgId: string,
    productId: string
  ): Promise<{ status: string; message: string; data: null }> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.PRODUCT_BY_ID(orgId, productId),
      deleteConfig()
    );
  },

  updateProduct: async (
    orgId: string,
    productId: string,
    productData: ProductData
  ): Promise<ProductResponse> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.PRODUCT_BY_ID(orgId, productId),
      putConfig(productData)
    );
  },

  fetchProductById: async (
    orgId: string,
    productId: string
  ): Promise<ProductResponse> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.PRODUCT_BY_ID(orgId, productId),
      getConfig()
    );
  },

  createBranch: async (data: CreateBranch, orgId: string): Promise<any> => {
    return apiRequest(ORGANIZATION_ENDPOINTS.BRANCHES(orgId), postConfig(data));
  },

  fetchBranch: async (orgId: string): Promise<any> => {
    return apiRequest(ORGANIZATION_ENDPOINTS.BRANCHES(orgId), getConfig());
  },

  fetchBranchById: async (orgId: string, branchId: string): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.BRANCH_BY_ID(orgId, branchId),
      getConfig()
    );
  },

  createDepartment: async (
    data: CreateDepartment,
    orgId: string
  ): Promise<any> => {
    const response = await apiRequest(
      ORGANIZATION_ENDPOINTS.DEPARTMENTS(orgId),
      postConfig(data)
    );
    return response;
  },

  fetchDepartment: async (orgId: string): Promise<any> => {
    return apiRequest(ORGANIZATION_ENDPOINTS.DEPARTMENTS(orgId), getConfig());
  },

  fetchDepartmentById: async (
    orgId: string,
    departmentId: string
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.DEPARTMENT_BY_ID(orgId, departmentId),
      getConfig()
    );
  },
  createCategory: async (data: CreateCategory, orgId: string): Promise<any> => {
    return apiRequest(ORGANIZATION_ENDPOINTS.CATEGORY(orgId), postConfig(data));
  },
  fetchCategory: async (
    orgId: string,
    page: number = 1,
    pageSize: number = 100
  ): Promise<any> => {
    return apiRequest(
      `${ORGANIZATION_ENDPOINTS.CATEGORY(
        orgId
      )}?page=${page}&pageSize=${pageSize}`,
      getConfig()
    );
  },

  fetchCategoryById: async (
    orgId: string,
    categoryId: string
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.CATEGORY_BY_ID(orgId, categoryId),
      getConfig()
    );
  },
  deleteCategory: async (orgId: string, categoryId: string): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.DELETE_CATEGORY(orgId, categoryId),
      deleteConfig()
    );
  },

  editCategory: async (
    orgId: string,
    categoryId: string,
    data: EditCategory
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.EDIT_CATEGORY(orgId, categoryId),
      putConfig(data)
    );
  },
  editBranch: async (
    orgId: string,
    branchId: string,
    data: EditBranch
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.EDIT_BRANCH(orgId, branchId),
      putConfig(data)
    );
  },

  deleteBranch: async (orgId: string, branchId: string): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.DELETE_BRANCH(orgId, branchId),
      deleteConfig()
    );
  },

  editDepartment: async (
    orgId: string,
    departmentId: string,
    data: EditDepartment
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.EDIT_DEPARTMENT(orgId, departmentId),
      putConfig(data)
    );
  },

  deleteDepartment: async (
    orgId: string,
    departmentId: string
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.DELETE_DEPARTMENT(orgId, departmentId),
      deleteConfig()
    );
  },
  initializePurchaseRequisition: async (
    data: InitializePurchaseRequisition
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.INITIALIZE_PURCHASE_REQUISITION(),
      postConfig(data)
    );
  },
  createRequisition: async (
    data: CreatePurchaseRequisitionData,
    orgId: string
  ): Promise<any> => {
    return await apiRequest(
      ORGANIZATION_ENDPOINTS.REQUISITIONS(orgId),
      postConfig(data)
    );
  },
  updateRequisitionStatus: async (
    orgId: string,
    reqId: string,
    data: updateRequisitionStatus
  ): Promise<any> => {
    return await apiRequest(
      ORGANIZATION_ENDPOINTS.UPDATE_REQUISITION_STATUS(orgId, reqId),
      patchConfig(data)
    );
  },
  updateOrderStatus: async (
    orgId: string,
    orderId: string,
    data: updateOrderStatus
  ): Promise<any> => {
    return await apiRequest(
      ORGANIZATION_ENDPOINTS.UPDATE_ORDER_STATUS(orgId, orderId),
      patchConfig(data)
    );
  },
  fetchRequisition: async (
    orgId: string,
    status?: string,
    page?: number,
    pageSize?: number
  ): Promise<any> => {
    let url = `${ORGANIZATION_ENDPOINTS.REQUISITIONS(orgId)}?page=${
      page || 1
    }&pageSize=${pageSize || 20}`;

    if (status) {
      url += `&status=${status}`;
    }

    return await apiRequest(url, getConfig());
  },
  fetchRequisitionById: async (orgId: string, reqId: string): Promise<any> => {
    return await apiRequest(
      ORGANIZATION_ENDPOINTS.REQUISITIONS_BY_ID(orgId, reqId),
      getConfig()
    );
  },
  fetchRequistionsBySavedForLater: async (orgId: string): Promise<any> => {
    return await apiRequest(
      ORGANIZATION_ENDPOINTS.REQUISITIONS_SAVED_FOR_LATER(orgId),
      getConfig()
    );
  },
  purchaseItems: async (data: PurchaseItems, orgId: string): Promise<any> => {
    const config = postConfig(data, orgId);
    const response = await apiRequest(USER_ENDPOINTS.PURCHASE_ITEMS, config);
    return response;
  },
  removeItems: async (itemId: string, orgId: string): Promise<any> => {
    const config = deleteConfig(orgId);
    const response = await apiRequest(
      USER_ENDPOINTS.DELETE_ITEM(itemId),
      config
    );
    return response;
  },
  fetchAllItemById: async (orgId: string, id: string): Promise<any> => {
    const config = getConfig(orgId);
    const response = await apiRequest(
      `${USER_ENDPOINTS.PURCHASE_ITEMS}/${id}`,
      config
    );
    return response;
  },
  UpdateItem: async (
    orgId: string,
    id: string,
    data: UpdateData
  ): Promise<any> => {
    const config = putConfig(data, orgId);
    const response = await apiRequest(USER_ENDPOINTS.UPDATE_ITEM(id), config);
    return response;
  },
  fetchAllItemsByPrNumber: async (
    orgId: string,
    pr_number: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<any> => {
    const config = getConfig(orgId);
    const response = await apiRequest(
      `${USER_ENDPOINTS.GET_ITEMS_BY_PRNUMBER}?pr_number=${pr_number}&page=${page}&pageSize=${pageSize}`,
      config
    );
    return response;
  },
  finaliseRequistion: async (
    orgId: string,
    data: FinalizePurchaseRequisition
  ): Promise<any> => {
    const config = putConfig(data, orgId);
    const response = await apiRequest(
      USER_ENDPOINTS.FINALISE_REQUISITION,
      config
    );
    return response;
  },
  savedForLater: async (
    orgId: string,
    data: PurchaseRequisitionSavedForLater
  ): Promise<any> => {
    return apiRequest(
      ORGANIZATION_ENDPOINTS.SAVED_FOR_LATER(orgId),
      postConfig(data)
    );
  },
  allOrders: async (
    orgId: string,
    status?: string,
    page?: number,
    pageSize?: number
  ): Promise<any> => {
    let url = `${ORGANIZATION_ENDPOINTS.ORDERS(orgId)}?page=${
      page || 1
    }&pageSize=${pageSize || 20}`;

    if (status) {
      url += `&status=${status}`;
    }

    return await apiRequest(url, getConfig());
  },
  fetchOrderById: async (orgId: string, orderId: string): Promise<any> => {
    return await apiRequest(
      ORGANIZATION_ENDPOINTS.ORDER_BY_ID(orgId, orderId),
      getConfig()
    );
  },
  viewPO: async (token: string, orderId: string): Promise<any> => {
    return await apiRequest(
      ORGANIZATION_ENDPOINTS.VIEW_PO(orderId),
      getConfig("", token)
    );
  },
  createOrder: async (orgId: string, data: PurchaseOrder): Promise<any> => {
    return await apiRequest(
      `${ORGANIZATION_ENDPOINTS.ORDERS(orgId)}`,
      postConfig(data)
    );
  },
  createComment: async (orgId: string, data: Comment): Promise<any> => {
    return await apiRequest(USER_ENDPOINTS.COMMENTS, postConfig(data, orgId));
  },
  singleComment: async (orgId: string, entityId: string): Promise<any> => {
    return await apiRequest(
      `${USER_ENDPOINTS.COMMENTS}/entities/${entityId}`,
      getConfig(orgId)
    );
  },
  createBudget: async (orgId: string, data: CreateBudget): Promise<any> => {
    return await apiRequest(USER_ENDPOINTS.BUDGETS, postConfig(data, orgId));
  },
  fetchBudget: async (orgId: string): Promise<any> => {
    return await apiRequest(USER_ENDPOINTS.BUDGETS, getConfig(orgId));
  },
  fetchBudgetById: async (orgId: string, id: string): Promise<any> => {
    return await apiRequest(
      `${USER_ENDPOINTS.BUDGETS}/${id}`,
      getConfig(orgId)
    );
  },
  fileManager: async (image: File) => {
    const token = Cookies.get("accessToken");
    const formData = new FormData();
    formData.append("file", image);
    const response = await fetch(USER_ENDPOINTS.FILE_MANAGER, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // <-- include the token here
        // Do NOT add Content-Type
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  },
  export: async (
    orgId: string,
    startDate: string,
    endDate: string,
    format: string,
    type: string
  ): Promise<any> => {
    try {
      const url = `${ORGANIZATION_ENDPOINTS.EXPORT(
        orgId
      )}/${type}?startDate=${startDate}&endDate=${endDate}&format=${format}`;
      const blob = await apiRequest(url, getConfig(orgId), "blob");
      const url2 = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url2;
      a.download = `export_${type}_${new Date().toISOString().split("T")[0]}.${
        format === "excel" ? "xlsx" : format
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url2);
      document.body.removeChild(a);
      return { success: true };
    } catch (error) {
      console.error("Export error:", error);
      throw error;
    }
  },
  exportSelected: async (
    orgId: string,
    exportData: ExportSelected
  ): Promise<any> => {
    try {
      const url = `${ORGANIZATION_ENDPOINTS.EXPORT_SELECTED(orgId)}`;
      const blob = await apiRequest(url, postConfig(exportData), "blob");
      const url2 = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url2;
      a.download = `export_${new Date().toISOString().split("T")[0]}.${
        exportData.format === "excel" ? "xlsx" : exportData.format
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url2);
      document.body.removeChild(a);
      return { success: true };
    } catch (error) {
      console.error("Export error:", error);
      throw error;
    }
  },
  bulkUpload: async (orgId: string, file: File) => {
    const token = Cookies.get("accessToken");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(
      `https://backend-uw62.onrender.com/organisations/${orgId}/products/upload/bulk`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // <-- include the token here
          // Do NOT add Content-Type
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  },
  verifySubDomain: async (
    subDomain: VerifySubDomain,
    X: VerifySubDomainHeader
  ) => {
    const res = await apiRequest(
      `${AUTH_ENDPOINTS.VERIFY_SUBDOMAIN}`,
      postVerifySubdomainConfig(subDomain, X)
    );
    return res;
  },
};

export { auth };
