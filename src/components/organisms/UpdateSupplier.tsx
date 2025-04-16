import { z } from "zod";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '../atoms/Input'; 
import Button from '../atoms/Button';
import Modal from "../atoms/Modal";
import useStore from '@/store';
import StarRating from "../atoms/StarRating";
import Select from "../atoms/Select";
import useFetchCategories from "@/hooks/useFetchCategories";
import CreateCategory from "./CreateCategory";
import { useState, useMemo, useEffect } from "react";
import { City, Country, State } from 'country-state-city';
import useUpdateSupplier from "@/hooks/useUpdateSupplier";
import useFetchSupplierById from "@/hooks/useFetchSupplierById";
import { cn } from "@/utils/cn";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'

const UpdateSupplierSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  phone: z.string()
  .min(6, "Phone number is too short")
  .regex(/^\d+$/, "Phone number must contain only numbers"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zip_code: z.string().max(5, "ZIP/Postal code must be at most 5 characters").optional()
  }),
  bank_details: z.object({
    account_number: z.string().min(1, "Account number is required"),
    bank_name: z.string().min(1, "Bank name is required"),
    account_name: z.string().min(1, "Account name is required"),
  })
});

type UpdateSupplierFormData = z.infer<typeof UpdateSupplierSchema>;

const UpdateSupplier = () => {
  const { currentOrg, supplierId, isUpdateSupplierOpen, setIsUpdateSupplierOpen } = useStore();
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [v, setV] = useState<string | undefined>(undefined)
  const updateSupplierMutation = useUpdateSupplier(currentOrg);
  const { data: supplierData, isLoading: isSupplierLoading } = useFetchSupplierById(currentOrg, supplierId);
  const { data: categoryData, isLoading: categoryLoading } = useFetchCategories(currentOrg);

  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue, watch, trigger } = useForm<UpdateSupplierFormData>({
    resolver: zodResolver(UpdateSupplierSchema),
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

const categories = categoryData?.data?.categories || [];  
  useEffect(() => {
    if (supplierData?.data) {
      const data = supplierData.data;
      setValue("full_name", data.full_name ?? "");
      setValue("email", data.email ?? "");
      setValue("phone", data.phone ?? "");
      setV(data.phone ?? "");
      setValue("category", data.category.id ?? "");
        setValue("address.street", data.address?.street ?? "");
        setValue("address.city", data.address?.city ?? "");
        setValue("address.state",  data.address?.state ?? "");
        setValue("address.country",  data.address?.country ?? "");
        setValue("address.zip_code",  data.address?.zip_code ?? "");

        const country = countries.find(c => c.name === data.address?.country);
        if (country) {
          setSelectedCountry(country.isoCode);
          const state = State.getStatesOfCountry(country.isoCode)
            .find(s => s.name === data.address.state);
          if (state) {
            setSelectedState(state.isoCode);
          }
        }
      if (data.bank_details) {
        setValue("bank_details.account_number", data.bank_details.account_number ?? "");
        setValue("bank_details.bank_name", data.bank_details.bank_name ?? "");
        setValue("bank_details.account_name", data.bank_details.account_name ?? "");
      }
      
      const ratingValue = data.rating ? Number(data.rating) : 0;
      setValue("rating", ratingValue);
    }
  }, [supplierData, setValue, countries]);
  const rating = watch("rating", 0);
  const category = watch("category");
  const onSubmit = async (data: UpdateSupplierFormData) => {
    try {
      await updateSupplierMutation.mutateAsync({ supplierId, data });
      reset();
      setIsUpdateSupplierOpen(false);
      setStep(1);
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

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

  return (
    <Modal onClose={() => {
      setIsUpdateSupplierOpen(false);
      setStep(1);
    }} isOpen={isUpdateSupplierOpen}>
      <div className="px-4 py-6 sm:px-10">
        <h2 className="text-xl font-bold mb-4">Update Supplier</h2>
        <p className="text-gray-500 mb-6">Update the supplier&apos;s information below</p>

        {isSupplierLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex justify-between w-full mb-6">
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center">
                    <div className={cn(
                      "rounded-full border border-gray-300 w-8 h-8 flex items-center justify-center",
                      step === num ? 'bg-primary text-white' : 'bg-white text-gray-700'
                    )}>
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

              {/* Step 1: Basic Details */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="text"
                      label="Full Name"
                      className="mt-1 w-full"
                      placeholder="Enter full name"
                      {...register("full_name")}
                    />
                    {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
                  </div>

                  <div>
                    <Input
                      type="email"
                      label="Email"
                      className="mt-1 w-full"
                      placeholder="Enter email address"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>

                  <div>
                            <label className="text-[12px] text-[#424242] font-bold">
                              Phone Number  <span className="text-red-500">*</span>
                              </label>
                                  <PhoneInput
                                    value={v}
                                    onChange={(value) => {
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

                  <div className="relative">
                    <Select
                      label="Category"
                      options={categories}
                      onChange={(selectedOption) => setValue("category", selectedOption || "")}
                      value={category}
                      defaultValue={category}
                      error={errors.category?.message}
                      loading={categoryLoading}
                      required
                      placeholder="Select a category"
                      component={<CreateCategory add={true}/>}
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
                      placeholder="Enter postal code"
                      maxLength={5}
                      {...register("address.zip_code")}
                    />
                    {errors.address?.zip_code && <p className="text-red-500 text-sm">{errors.address.zip_code.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Bank Details */}
              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="text"
                      label="Account Number"
                      className="mt-1 w-full"
                      placeholder="Enter account number"
                      {...register("bank_details.account_number")}
                    />
                    {errors.bank_details?.account_number && (
                      <p className="text-red-500 text-sm">{errors.bank_details.account_number.message}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="Bank Name"
                      className="mt-1 w-full"
                      placeholder="Enter bank name"
                      {...register("bank_details.bank_name")}
                    />
                    {errors.bank_details?.bank_name && (
                      <p className="text-red-500 text-sm">{errors.bank_details.bank_name.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      type="text"
                      label="Account Name"
                      className="mt-1 w-full"
                      placeholder="Enter account name"
                      {...register("bank_details.account_name")}
                    />
                    {errors.bank_details?.account_name && (
                      <p className="text-red-500 text-sm">{errors.bank_details.account_name.message}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end items-center mt-6 space-x-4">
                 <Button
                    type="submit"
                    disabled={!isValid || updateSupplierMutation.isPending}
                    className="px-5 py-2 text-white rounded-lg bg-secondary"
                  >
                    {updateSupplierMutation.isPending ? "Updating..." : "Update Supplier"}
                  </Button>
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
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default UpdateSupplier;