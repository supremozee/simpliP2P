import {  FetchMembersResponse } from '@/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
interface PrData {
  pr_number: string;
  id: string;
}
interface SimpliP2PStore {
  hideCreatePrText: string;
  setHidePrText:(hide:string)=> void;
  upload: string,
  setUpload: (file: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  pr:PrData |  null;
  setPr:(pr: PrData | null)=>void;
  errorMessage:string;
  setErrorMessage:(error:string)=>void;
  deactivated: boolean;
  setDeactivated: (value: boolean) => void;
  error: boolean;
  setError: (value: boolean) => void;
  currentOrg: string;
  setCurrentOrg: (orgId: string) => void;
  orgName: string;
  setOrgName: (name: string) => void;
  productId: string;
  setProductId: (productId: string) => void;
  selectedMemberId: string;
   setSelectedMemberId: (memberId: string)=>void
  supplierId: string;
  setSupplierId:(orgId: string)=>void;
 members: FetchMembersResponse | null;
 setMembers: (members: FetchMembersResponse) => void;
 onToggle: boolean;
  setOnToggle: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  format: string;
  setFormat: (format: string) => void;
  type: string;
  setType: (type: string) => void;
  isUpdateSupplierOpen: boolean;
  setIsUpdateSupplierOpen: (value: boolean) => void;
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  userId: string;
  setUserId: (userId:string)=>void
}

const useStore = create<SimpliP2PStore>()(
  devtools(
    persist(
    (set) => ({
      isActive: true,
      setIsActive: (isActive) => {
        set({isActive: isActive})
      },
      hideCreatePrText: "",
      setHidePrText: (hide:string)=> {
        set({hideCreatePrText: hide})
      },
      upload:'',
      setUpload: (file: string) => {
        set({ upload: file });
      },
      isOpen: false,
      setIsOpen: (value: boolean,) => {
        set({ isOpen: value });
      },
      pr: null,
      setPr: (pr: PrData | null) => {
        set({ pr: pr });
      },
      deactivated: false,
      setDeactivated: (value: boolean) => {
        set({ deactivated: value });
      },
      errorMessage:"",
      setErrorMessage: (value: string) => {
        set({ errorMessage: value})
      },
      loading: false,
      setLoading: (value: boolean) => {
        set({ loading: value });
      },
      error: false,
      setError: (value: boolean) => {
        set({ error: value });
      },
      orgName: "",
      setOrgName: (name: string) => {
        set({ orgName: name });
        if (name) {
          Cookies.set("orna", name, {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
          });
        } else {
          Cookies.remove("orna", { path: "/" });
        }
      },
      productId: "",
      setProductId: (productId: string) => {
        set({ productId: productId });
      },
      currentOrg: "",
      setCurrentOrg: (orgId: string) => {
        set({ currentOrg: orgId });
      },
      selectedMemberId: "",
      setSelectedMemberId: (memberId: string) => {
        set({ selectedMemberId: memberId });
      },
      userId: "",
      setUserId: (userId:string)=> {
        set({userId: userId})
      },
      supplierId: "",
      setSupplierId: (supplierId: string) => {
        set({ supplierId: supplierId });
      },
       members: null,
       setMembers: (members) => set({ members }),
       onToggle: false,
        setOnToggle: (value: boolean) => {
          set({ onToggle: value });
        },
        startDate: '',
        setStartDate: (date: string) => set({ startDate: date }),
        endDate: '',
        setEndDate: (date: string) => set({ endDate: date }),
        format: 'csv',
        setFormat: (format: string) => set({ format: format }),
        type: '',
        setType: (type: string) => set({ type: type }),
        isUpdateSupplierOpen: false,
        setIsUpdateSupplierOpen: (value: boolean) => set({ isUpdateSupplierOpen: value }),
    }),
    {
      name: 'pcp',
      partialize: (state) => ({ 
        pr: state.pr, 
        onToggle: state.onToggle,
        currentOrg: state.currentOrg,
        orgName: state.orgName,
        isActive: state.isActive,
        userId:state.userId
      }),
    }
  )
)
);

export default useStore;