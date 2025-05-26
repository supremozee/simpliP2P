/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ModalProps {
  showModal: boolean
  setShowModal: (showModal:boolean)=>void
  supplierId?:string
  add?:boolean;
}

export interface NavLink {
  label: string;
  path?: string;
  icon?: React.ComponentType<{ size: number; className?: string }>;
  subLinks?: {
    label: string;
    path: string;
  }[];
}

export interface Metadata {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// auth
export type RegisterFormData = {
    first_name: string;
    last_name: string;
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
  export interface OrganizationData {
    name: string,
    address: string,
    creator_role: string
  }
  export interface ResetFormData { 
    token:string;
    new_password: string;
  }
  export interface UserOrganisation {
    org_id: string;
    name: string;
    role: string;
    logo: string;
    permissions: Permission[];
    is_creator:boolean;
    accepted_invitation: string;
}
export interface Organization {
  name: string;
  tenant_code?: string;
  address: string;
  logo?: string;
  creator_role?: string;
}

export interface OrganizationResponse {
  status: string;
  message: string;
  data: Organization;
}
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture:string;
    phone: string;
    provider?: string;
    user_organisations: UserOrganisation[];
}

export interface UserProfileResponse {
    status: string;
    message: string;
    data: User;
}
  
  export interface LoginResponse {
    status: string;
    message: string;
    data: {
      user: User;
      access_token: string;
      refresh_token: string;
    };
  }
  export interface Logout {
    refresh_token: string;
  }
  export interface LogoutAll {
    userId: string;
  }
  export interface ResetResponse {
    status: string;
    message: string;
    data: null;
  }
  export interface InitiateGoogleResponse {
    status: string;
    message: string;
    data: {
      url: string;
    };
  }
  export interface CallbackResponse {
    status: string;
    message: string;
    data: {
      access_token: string;
      refresh_token:string;
    };
  }
  export interface CreateOrganizationResponse {
    status: string;
    message: string;
    data: {
      name: string;
      id:string
    };
  }
  export interface CallbackType {
    code:string
  }

  //organization


  export interface Metrics {
    totalSuppliers: number;
    totalProducts: number;
    pendingPurchaseOrders: number;
  }
  
  export interface OrganizationDashboardByIdData {
    orgId: string;
    metrics: Metrics;
  }
  
  export interface OrganizationDashboardByIdResponse {
    status: string;
    message: string;
    data: OrganizationDashboardByIdData;
  }
  

  export type Permission = 
  | "manage_users"
  | "create_users"
  | "get_users"
  | "manage_suppliers"
  | "create_suppliers"
  | "get_suppliers"
  | "update_suppliers"
  | "delete_suppliers"
  | "manage_departments"
  | "manage_budgets"
  | "manage_products"
  | "create_products"
  | "get_products"
  | "manage_purchase_orders"
  | "create_purchase_orders"
  | "get_purchase_orders"
  | "manage_purchase_requisitions"
  | "create_purchase_requisitions"
  | "get_purchase_requisitions"
  | "org_member"
  | "all_permissions"| 
   "create_budgets" |
  "delete_budgets" |
  "update_budgets"


export interface inviteMemberData {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department_id:string;
  branch_id:string;
  permissions:string[];
}

export interface inviteMemberResponse {
  status: string;
  message: string;
  data: {
    member: UserMember;
  };
}

export interface UserMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string;
  permissions: Permission[];
  department: string;
  last_login: string | null;
  online_status: boolean;
  profile_picture: string;
  accepted_invitation: boolean;
  deactivated_at: string | null;
}

export interface Owner {
  id: string;
  name: string;
  address: string;
}
  
  export interface FetchMembersResponse {
    status: string;
    message: string;
    data: {
      organisation: Owner;
      users: UserMember[];
    };
  }
  export interface FetchMemberByIdResponse {
    status: string;
    message: string;
    data: {
      member: UserMember;
    }
     
  }
  export interface AcceptInvitationData {
    token: string;
    newPassword: string;
  }
  export interface AcceptInvitationResponse {
    status: string;
    message: string;
  } 
  export interface EditMemberData {
    role: string;
    permissions: Permission[];
  }
  export interface EditMemberResponse {
    status:string;
    message: string;
    data:inviteMemberData;
  }
  export interface Address {
    street: string 
    city: string 
    state: string
    country: string
    zip_code?: string 
  }
  interface BankDetails {
      bank_name: string,
      account_number: string,
      account_name: string,
      swift_code?:string;
      bank_key?:string
  }
  export interface CreateSupplierData {
    full_name: string;
    email: string;
    phone: string;
    address: Address;
    category: string;
    rating: number;
    bank_details: BankDetails
    lead_time:string;
    payment_term:string
  }
  export interface Supplier {
    id: string;
    supplier_no:string;
    full_name: string;
    lead_time:string;
    created_at:string;
    email: string;
    phone: string;
    address:Address;
    category: Category;
    rating: string;
    bank_details: BankDetails
    payment_term:string;
  }
  
  export interface FetchSuppliersResponse {
    status: string;
    message: string;
    data: Supplier[];
    metadata: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  }

  export interface UpdateSupplierData {
    full_name?: string;
    email?: string;
    phone?: string;
    address?:Address ;
    category?: string;
    rating?: number;
    bank_details:BankDetails
  }
  export interface UpdateSupplierResponse {
    status: string;
    message: string;
    data: Supplier;
  }
  export interface FetchSupplierByIdResponse {
    status: string;
    message: string;
    data: Supplier & {
      created_at: string,
        updated_at: string,
        deleted_at: string,
    };
  }
  export interface DeleteSupplierResponse {
    status: string;
    message: string;
    data: null;
  }
  export interface RefreshToken {
    oldRefreshToken:string;
  }
  export interface RefreshTokenResponse {
    status: string;
    message: string;
    data: {
      access_token: string;
      refresh_token: string;
    };
  }
  export interface ErrorResponse {
      message: string,
      error: string,
      statusCode: number
  }


  //purchase requisition 
  export interface Organisation {
    id: string;
  }
  export interface CreatedBy {
    id: string;
  }
  export interface Items {
    product_id?:string;
    item_name: string
    pr_quantity: number,
    unit_price: number
    image_url?:string;
  }
  export interface RequisitionItems {
    id?:string;
    item_name: string
    pr_quantity: number,
    unit_price: number
    image_url?:string;
    currency?:string;
    status?: 'APPROVED' | 'PENDING' | 'REJECTED' | 'REQUESTED MODIFICATION' | "SAVED_FOR_LATER" | "INITIALIZED"
  }
  export interface Requisition {
    department: {
      id:string
      name:string
    };
    branch:{
      id:string
      name:string
      address:string;
    };
    supplier: Supplier
    requestor_phone: string;
    requestor_email:string;
    requestor_name: string;
    request_description: string;
    quantity: number;
    currency:string;
    estimated_cost: number;
    justification: string;
    needed_by_date: string;
    total_items: number,
    organisation: Organisation;
    created_by: CreatedBy;
    pr_number: string;
    approval_justification: string | null;
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'REQUESTED MODIFICATION' | 'SAVED_FOR_LATER' | 'INITIALIZED'
    items: RequisitionItems[];
  }
  export interface CreatePurchaseRequisitionData {
    department: string;
    requestor_phone: string;
    requestor_name: string;
    request_description: string;
    branch:string;
    quantity: number;
    estimated_cost: number;
    justification: string;
    needed_by_date: string;
  }
  export interface CreatePurchaseRequisitionResponse {
    status: string;
    message: string;
    data: {
      requisition: Requisition
    }
  }
  export interface FetchPurchaseRequisition {
    status: string;
    message: string;
    data: {
      requisitions: Requisition[];
    }
  }
  export interface FetchPurchaseRequisitionById {
    status: string;
    message: string;
    data: {
      requisition: Requisition;
    }
  }
interface Role {
  role:string
}
 export  interface AuditLog {
    id:string
    entity_type:string,
    entity_id: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    changed_fields: any,
    previous_values: any,
    description: string,
    created_at: string,
    user: {
        id: string,
        first_name: string,
        last_name: string,
    userOrganisations: Role[],
    }
}
  
  interface AuditLogsData {
    logs: AuditLog[];
    metadata: Metrics;
  }
  
  export interface AuditLogsResponse {
    status: string;
    message: string;
    data: AuditLogsData;
  }

  export interface ProductData {
    name: string;
    description: string;
    unitPrice: number;
    currency?:string;
    productCode?:string;
    unitOfMeasure?:string;
    stockQty?: number;
    stockQtyAlert?: number;
    category: string;
    image_url?: string;
  }
  
  export interface ProductResponse {
    status: string;
    message: string;
    data: {
      name: string;
      description: string;
      unitPrice: number;
      stockQty: number;
      stockQtyAlert: number;
      category: Category;
      productCode: string | null;
      unitOfMeasure?:string;
      currency?:string
      id: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
  }

  export interface FetchProduct {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    inv_number: string,
    description: string;
    currency:string
    unitPrice: number;
    stockQty: number;
    stockQtyAlert: number;
    category: Category;
    productCode: string | null;
    unitOfMeasure: string | null;
    image_url: string | null;
  }
  
  export interface FetchProductsResponse {
    status: string;
    message: string;
    data: FetchProduct[];
    metadata: Metadata
  }

  //branch 

  export interface CreateBranch {
    name: string,
    address: string
  }
  export interface Branch {
    id?: string;
    status?:string
    created_at?: string;
    updated_at?: string;
    name: string;
    address?: string;
  }
  export interface CreateBranchResponse {
    status: string;
    message: string;
    data: Branch;
  }
  export interface FetchBranchResponse {
    status: string;
    message: string;
    data: {
      branches: Branch[];
      metadata: Metadata;
    };
  }
  export interface CreateDepartment {
    name: string;
    department_code?: string;
    description?: string;
    hod_id?: string | undefined;
  }
  export interface Department {
    id?: string;
    name: string;
    status?:string;
    organisation?: {
      id: string;
      tenant_code?: string;
      address:string;
      logo:string
    };
    head_of_department?: {
      first_name: string;
      last_name: string;
    };
  }
  export interface FetchDepartmentResponse {
    status: string;
    message: string;
    data: {
      departments: Department[];
      metadata: Metadata;
    };
  }
  export interface CreateCategory {
     name: string;
  }
  export interface Category {
    id?: string,
    status?:string;
    created_at?: string,
    updated_at?: string,
    name: string,
    deactivated_at?: string | null
  }
  export interface FetchCategoryResponse {
    status: string;
    message: string;
    data: {
      categories: Category[];
      metadata: Metadata;
    };
  }
  export interface FetchCategoryByIdResponse {
    status: string;
    message: string;
    data: {
      categories: Category;
    };
  }

  export interface InitializePurchaseRequisition {
      organisationId: string,
      branchId?: string,
      departmentId?: string
  }
  export interface InitializeRequisitionResponse {
    status: string,
    message: string,
    data: {
      id:string
      pr_number:string
    };
  }
  export interface PurchaseItems {
    pr_id: string,
    product_id?: string,
    image_url?: string
    item_name?: string,
    pr_quantity?: number,
    unit_price?: number
    currency?:string | undefined
  }
  export interface AllItems {
    id: string,
    created_at: string,
    updated_at: string,
    item_name: string,
    currency:string;
    description:string;
    unit_price: number,
    image_url: string | null,
    pr_quantity: number,
    po_quantity: number | null,
    status: "APPROVED" | "PENDING" | "REJECTED" | "REQUESTED_MODIFICATION",
    purchase_requisition: {
        id: string,
        pr_number: string
    },
    purchase_order: null,
      product: {
          id: string         }
  }
  export interface CreateItemResponse {
    status: string,
    message: string,
    data: {
     item: AllItems
    }
  }
  export interface FetchAllItems {
    status: string,
    message: string,
    data: {
        data: AllItems[],
        metadata: Metadata
    }
  }
  export interface UpdateData {
    unit_price: number;
    status?: "APPROVED" | "PENDING" | "REJECTED" | "REQUESTED_MODIFICATION" | "SAVED_FOR_LATER" ;
    pr_quantity?: number | undefined;
    image_url?: string | undefined;
  }

  export interface PurchaseRequisition {
    id: string;
    created_at: string;
    updated_at: string;
    pr_number: string;
    requestor_phone: string;
    requestor_email:string;
    requestor_name: string;
    request_description: string;
    quantity: number;
    total_items:number;
    estimated_cost: number;
    justification: string;
    status: "APPROVED" | "PENDING" | "REJECTED" | "REQUESTED_MODIFICATION" | "SAVED_FOR_LATER";
    approval_justification: string | null;
    needed_by_date: string;
    currency: string;
  }
  
  export interface Item {
    id: string;
    created_at: string;
    updated_at: string;
    item_name: string;
    unit_price: string;
    image_url: string | null;
    pr_quantity: number;
    po_quantity: number | null;
    status: "APPROVED" | "PENDING" | "REJECTED" | "REQUESTED_MODIFICATION";
    purchase_requisition: PurchaseRequisition;
    purchase_order: null;
    product: null;
  }
  
  export interface FetchItemByIdResponse {
    status: string;
    message: string;
    data: {
      item: Item;
    };
  }
  export interface FinalizePurchaseRequisition {
    pr_number: string;
    department_id: string;
    branch_id: string;
    requestor_phone: string;
    requestor_email:string;
    requestor_name: string;
    request_description: string;
    quantity?: number; 
    estimated_cost?: number; 
    justification: string;
    needed_by_date: string;
  }
  export interface PurchaseRequisitionSavedForLater {
    pr_number: string;
    department_id: string;
    requestor_phone: string;
    requestor_email:string;
    requestor_name: string;
    request_description: string;
    justification: string;
    needed_by_date: string; 
  }
  
  export interface PurchaseOrder {
    request_id: string;
    supplier_id: string;
    total_amount: number;
    attachment?:string
  }

  export interface Order {
    id: string;
    created_at: string;
    updated_at: string;
    po_number: string;
    total_amount: string;
    currency:string
    status: string;
    attachment: string;
    supplier: Supplier;
    purchase_requisition: PurchaseRequisition;
  }
  
  export interface FetchOrdersResponse {
    status: string;
    message: string;
    data: {
      orders: Order[];
      metadata: Metadata;
    };
  }
  export interface FetchOrderResponseById {
    status: string;
    message: string;
    data: {
      order: Order;
    };
  }
  export interface updateRequisitionStatus {
    supplier_id:string;
    budget_id:string;
    status: string,
    approval_justification: string;
    action_type: "approve" | "reject" | "approve_and_create_po"
  }
  export interface updateOrderStatus {
    status: string,
  }
  export interface Comment {
    entity_type: "purchase_order" | "purchase_requisition";
    entity_id: string;
    text: string;
  }
export interface CreatedBy {
  first_name: string;
  last_name: string;
}

export interface AllComment{
  id: string;
  created_at: string;
  updated_at: string;
  entity_type: "purchase_order" | "purchase_requisition" | "budget";
  entity_id: string;
  text: string;
  created_by: CreatedBy;
}

//budget

export interface CreateBudget {
  name: string;
  amount: number;
  currency?: string;
  branchId: string;
  departmentId: string;
  categoryId: string;
}
export interface Budget {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  currency: string;
  balance: string;
  amount_allocated: string;
  amount_remaining: string;
  amount_reserved: string;
  amount_available: string;
  active: boolean;
  branch: Branch;
  department: Department;
}


export interface FetchBudgetByIdResponse {
  status: string;
  message: string;
  data: {
    budget: Budget;
  };
}
export interface FileResponse {
  status: string;
  message: string;
  url: string;
}

export interface ViewPOItem {
  id: string;
  created_at: string;
  updated_at: string;
  item_name: string;
  unit_price: string;
  currency: string;
  image_url: string | null;
  pr_quantity: number;
  po_quantity: number | null;
  status: string;
}


export interface ViewPOOrganisation {
  name: string;
  logo: string;
}

export interface ViewPOResponse {
    id: string;
    created_at: string;
    updated_at: string;
    po_number: string;
    total_amount: string;
    currency: string;
    status: string;
    attachment: string | null;
    supplier: Supplier;
    branch:Branch;
    items: ViewPOItem[];
    organisation: ViewPOOrganisation;
}

export interface ExportSelected {
  entity: string, 
  format: "excel" | "csv", 
  ids: string[]
}
