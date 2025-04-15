import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '../atoms/Input'; 
import Button from '../atoms/Button';
import Modal from "../atoms/Modal";
import useCreateSupplier from '@/hooks/useCreateSupplier';
import useStore from '@/store';
import StarRating from "../atoms/StarRating";
import Select from "../atoms/Select";
import useFetchCategories from "@/hooks/useFetchCategories";
import CreateCategory from "./CreateCategory";
import { useState, useEffect, useMemo } from "react";
import { City, Country, State } from 'country-state-city';
import { FaPlus, FaUserTie } from "react-icons/fa";
import 'react-phone-input-2/lib/style.css'
import PhoneInput from 'react-phone-input-2';

const paymentTermOptions = [
  { id: "pia", name: "Payment in Advance" },
  { id: "cod", name: "Cash on Delivery" },
  { id: "loc", name: "Line of Credit" },
  { id: "nt00", name: "Payment Immediately" },
  { id: "nt15", name: "15 days payment after invoice" },
  { id: "nt30", name: "30 days payment after invoice" },
  { id: "nt45", name: "45 days payment after invoice" },
  { id: "nt60", name: "60 days payment after invoice" },
  { id: "nt90", name: "90 days payment after invoice" },
  { id: "nt120", name: "120 days payment after invoice" }
];

const CreateSupplierSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  phone: z.string()
  .min(6, "Phone number is too short")
  .regex(/^\d+$/, "Phone number must contain only numbers"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  payment_term: z.string().min(1, "Payment term is required"),
  lead_time: z.string().min(1, "Lead time is required"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zip_code: z.string().max(5, "ZIP/Postal code must be at most 5 characters").optional(),
  }),
  bank_details: z.object({
    account_number: z.string().min(1, "Account number is required"),
    bank_name: z.string().min(1, "Bank name is required"),
    account_name: z.string().min(1, "Account name is required"),
  })
});

type SupplierFormData = z.infer<typeof CreateSupplierSchema>;

const CreateSupplier = ({ add, custom, create, onClick }: 
  { add?: boolean; custom?: boolean, create?:boolean, onClick?:()=>void }) => {
  const { currentOrg } = useStore();
  const { createSupplier, loading, errorMessage, successCreate } = useCreateSupplier();
  const { data: categoryData, isLoading: categoryLoading } = useFetchCategories(currentOrg);
  
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [v, setV] = useState<string | undefined>(undefined)
  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue, watch, trigger } = useForm<SupplierFormData>({
    resolver: zodResolver(CreateSupplierSchema),
    mode: "onChange"
  });

  const countries = useMemo(() => Country.getAllCountries(), []);
  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry);
  }, [selectedCountry]);

  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState);
  }, [selectedCountry, selectedState]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (onClick && !isOpen) {
      onClick();
    }
  };

  const onSubmit = async (data: SupplierFormData) => {
    try {
      await createSupplier(data, currentOrg);
      setTimeout (()=> {
        reset();
        toggleModal();
      }, 1500)
    } catch (error) {
      console.error("Error creating supplier:", error);
    }
  };

  const categories = categoryData?.data.categories || [];
  const rating = watch("rating", 0);
  const category = watch("category");

  const handleNextStep = async () => {
    let isStepValid = false;
    
    switch (step) {
      case 1:
        isStepValid = await trigger(["full_name", "phone", "email", "category", "rating"]);
        break;
      case 2:
        isStepValid = await trigger(["address"]);
        break;
    }

    if (isStepValid) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    const countryName = Country.getCountryByCode(countryCode)?.name || '';
    setValue("address.country", countryName);
    setSelectedState('');
    setValue("address.state", '');
    setValue("address.city", '');
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    const stateName = State.getStateByCodeAndCountry(stateCode, selectedCountry)?.name || '';
    setValue("address.state", stateName);
    setValue("address.city", '');
  };

  // Effect to handle modal opening when create prop changes
  useEffect(() => {
    if (create) {
      setIsOpen(true);
    }
  }, [create]);

  return (
    <>
      {add && (
        <button
          title="Add New"
          type="button"
          onClick={toggleModal}
          className="w-[18px] h-[18px] text-white rounded-full flex justify-center text-center items-center bg-primary"
        >
          <FaPlus size={10} />
        </button>
      )}
      
      {custom && (
        <Button
          className="w-full py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
          onClick={toggleModal}
        >
          <span className="text-primary">
            <FaUserTie className="w-5 h-5" />
          </span>
          <span className="text-gray-700">Add New Supplier</span>
        </Button>
      )}
      
      {create !== undefined && (
        <Button
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-lg px-3 py-2 transition-all"
          onClick={toggleModal}
        >
          <FaPlus className="w-4 h-4" />
          <span className="text-white">Create Supplier</span>
        </Button>
      )}
      
      <Modal onClose={() => {
        setIsOpen(false);
        setStep(1);
      }} isOpen={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="py-6 px-6 sm:px-10">
            <div className="flex justify-between w-full mb-6">
              <h2 className="sm:text-xl text-sm font-bold">Create Supplier</h2>
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((num, i) => (
                  <div
                  className="flex items-center justify-center gap-2"
                  key={i}
                  >
                    <div
                    className={`rounded-full border border-gray-300 w-8 h-8 flex items-center justify-center ${step === num ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}>
                      {num}
                    </div>
                    {num < 3 && <div className="border-t border-gray-300 w-8"></div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-gray-500 mb-6">
                {step === 1 ? "Basic details" : step === 2 ? "Address details" : "Bank details"}
              </p>

              {step === 1 && (
                <div className="sm:grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                    required
                      type="text"
                      label="Supplier Name"
                      className="mt-1 w-full"
                      placeholder="Input Supplier name"
                      {...register("full_name")}
                    />
                    {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
                  </div>

                  <div>
                    <Input
                    required
                      type="email"
                      label="Email"
                      className="mt-1 w-full"
                      placeholder="Input email address"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>

                  <div>
  <label className="text-[12px] text-[#424242] font-bold">Phone Number</label>
              <PhoneInput
                country={"ng"}
                value={v}
                onChange={(value) => {
                  setV(value);
                  const digitsOnly = value ? value.replace(/\D/g, '') : '';
                  setValue("phone", digitsOnly);
                }}
                placeholder="Enter phone number"
                inputStyle={{
                  width: '100%',
                  height: '100%',
                  padding: '0.6rem',
                  paddingLeft: '45px',
                  border: '1px solid #dddada',
                  fontWeight: '400',
                  borderRadius: '12px',
                  fontSize: '17px',
                  backgroundColor: 'transparent',
                  color: '#424242',
                }}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

                  <div className='relative'>
                    <Select
                      label="Categories"
                      options={categories}
                      {...register("category")}
                      onChange={(selectedCat) => setValue("category", selectedCat)}
                      required
                      value={category}
                      error={errors.category?.message}
                      loading={categoryLoading}
                      component={<CreateCategory add={true} />}
                    />
                  </div>

                  <div className="mt-5 sm:mt-0 col-span-2">
                    <StarRating
                      showLabel={true}
                      maxRating={5}
                      rating={rating}
                      error={errors?.rating}
                      setRating={(rating) => setValue("rating", rating)}
                    />
                  </div>

                  <div className='relative'>
                    <Select
                      label="Payment Terms"
                      options={paymentTermOptions}
                      {...register("payment_term")}
                      onChange={(selectedTerm) => setValue("payment_term", selectedTerm)}
                      required
                      value={watch("payment_term")}
                      error={errors.payment_term?.message}
                    />
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="Lead Time (days)"
                      className="mt-1 w-full"
                      placeholder="Enter lead time in days"
                      {...register("lead_time")}
                    />
                    {errors.lead_time && <p className="text-red-500 text-sm">{errors.lead_time.message}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Input
                      type="text"
                      label="Street Address"
                      className="mt-1 w-full"
                      placeholder="Enter street address"
                      {...register("address.street")}
                    />
                    {errors.address?.street && <p className="text-red-500 text-sm">{errors.address.street.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      onChange={handleCountryChange}
                      value={selectedCountry}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.address?.country && <p className="text-red-500 text-sm">{errors.address.country.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">State/Province</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      onChange={handleStateChange}
                      value={selectedState}
                      disabled={!selectedCountry}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {errors.address?.state && <p className="text-red-500 text-sm">{errors.address.state.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      {...register("address.city")}
                      disabled={!selectedState}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.address?.city && <p className="text-red-500 text-sm">{errors.address.city.message}</p>}
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="ZIP/Postal Code"
                      className="mt-1 w-full"
                      maxLength={5}
                      placeholder="Enter postal code"
                      {...register("address.zip_code")}
                    />
                    {errors.address?.zip_code && <p className="text-red-500 text-sm">{errors.address.zip_code.message}</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="text"
                      label="Account Number"
                      className="mt-1 w-full"
                      placeholder="Input account number"
                      {...register("bank_details.account_number")}
                    />
                    {errors.bank_details?.account_number && <p className="text-red-500 text-sm">{errors.bank_details.account_number.message}</p>}
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="Bank Name"
                      className="mt-1 w-full"
                      placeholder="Input bank name"
                      {...register("bank_details.bank_name")}
                    />
                    {errors.bank_details?.bank_name && <p className="text-red-500 text-sm">{errors.bank_details.bank_name.message}</p>}
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="Account Name"
                      className="mt-1 w-full"
                      placeholder="Input account name"
                      {...register("bank_details.account_name")}
                    />
                    {errors.bank_details?.account_name && <p className="text-red-500 text-sm">{errors.bank_details.account_name.message}</p>}
                  </div>
                </div>
              )}

              <div className="flex justify-end items-center mt-6 space-x-4">
                {step > 1 && (
                  <Button
                    type="button"
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                )}
                {step < 3 && (
                  <Button
                    type="button"
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                    onClick={handleNextStep}
                  >
                    Next
                  </Button>
                )}
                {step === 3 && (
                  <Button
                    type="submit"
                    disabled={!isValid || loading}
                    className="px-5 py-2 text-white rounded-lg"
                  >
                    {loading ? "Creating..." : "Create Supplier"}
                  </Button>
                )}
              </div>
            </div>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            {successCreate && <p className="text-green-500 mt-4">Supplier created successfully</p>}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreateSupplier;