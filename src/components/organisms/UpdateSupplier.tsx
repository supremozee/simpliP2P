import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '../atoms/Input'; 
import Button from '../atoms/Button';
import Modal from "../atoms/Modal";
import { DeleteSupplierResponse, ModalProps } from "@/types";
import useStore from '@/store';
import useUpdateSupplier from "@/hooks/useUpdateSupplier";
import useFetchSupplierById from "@/hooks/useFetchSupplierById";
import { useEffect, useState, useMemo } from "react";
import useNotify from "@/hooks/useNotify";
import useDeleteSupplier from "@/hooks/useDeleteSupplier";
import Select from "../atoms/Select";
import CreateCategory from "./CreateCategory";
import useFetchCategories from "@/hooks/useFetchCategories";
import LoaderSpinner from "../atoms/LoaderSpinner";
import { City, Country, State } from 'country-state-city';

const UpdateSupplierSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  phone: z.string().min(10, "Phone is required").regex(/^[0-9]+$/, "Phone number must contain only numbers"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zip_code: z.string().optional()
  }),
  bank_details: z.object({
    account_number: z.string().min(10, "Account number must be at least 10 characters"),
    bank_name: z.string().min(1, "Bank name is required"),
    account_name: z.string().min(1, "Account name is required")
  })
});

type UpdateSupplierFormData = z.infer<typeof UpdateSupplierSchema>;

interface UpdateSupplierProps extends ModalProps {
  supplierId?: string;
}

const UpdateSupplier: React.FC<UpdateSupplierProps> = ({ showModal, setShowModal }) => {
  const { currentOrg, supplierId } = useStore();
  const {success} = useNotify();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  
  const updateSupplierMutation = useUpdateSupplier(currentOrg);
  const deleteSupplierMutation = useDeleteSupplier(currentOrg);
  const { isPending, isError } = updateSupplierMutation;
  const { data: supplierData, isLoading: isSupplierLoading } = useFetchSupplierById(currentOrg, supplierId);
  const { data: categoryData, isLoading: categoryLoading, isError: errorCategory } = useFetchCategories(currentOrg);

  const { register, handleSubmit, formState: { errors }, reset, setValue, control, watch, trigger } = useForm<UpdateSupplierFormData>({
    resolver: zodResolver(UpdateSupplierSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zip_code: ""
      },
      category: "",
      rating: 0,
      bank_details: {
        account_number: "",
        bank_name: "",
        account_name: ""
      }
    }
  });

  // Get countries list
  const countries = useMemo(() => Country.getAllCountries(), []);
  
  // Get states based on selected country
  const states = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry);
  }, [selectedCountry]);

  // Get cities based on selected state and country
  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry, selectedState);
  }, [selectedCountry, selectedState]);

  const categories = categoryData?.data?.categories || [];
  const ratings = useWatch({ control, name: 'rating' });

  useEffect(() => {
    if (supplierData?.data) {
      const data = supplierData.data;
      setValue("full_name", data.full_name ?? "");
      setValue("email", data.email ?? "");
      setValue("phone", data.phone ?? "");
      setValue("category", data.category?.id ?? "");
      setSelectedCategory(data.category?.name ?? "");
      
      // Parse address string into components
      if (data.address) {
        setValue("address.street", data.address.street ?? "");
        setValue("address.city", data.address.city ?? "");
        setValue("address.state",  data.address.state ?? "");
        setValue("address.country",  data.address.country ?? "");
        setValue("address.zip_code",  data.address.zip_code ?? "");

        // Find and set country code
        const country = countries.find(c => c.name === data.address.country);
        if (country) {
          setSelectedCountry(country.isoCode);
          // Find and set state code
          const state = State.getStatesOfCountry(country.isoCode)
            .find(s => s.name === data.address.state);
          if (state) {
            setSelectedState(state.isoCode);
          }
        }
      }

      // Set bank details if they exist
      if (data.bank_details) {
        setValue("bank_details.account_number", data.bank_details.account_number ?? "");
        setValue("bank_details.bank_name", data.bank_details.bank_name ?? "");
        setValue("bank_details.account_name", data.bank_details.account_name ?? "");
      }
      
      const ratingValue = data.rating ? Number(data.rating) : 0;
      setValue("rating", ratingValue);
    }
  }, [supplierData, setValue, countries]);

  const toggleModal = () => {
    setShowModal(!showModal);
    setStep(1); 
  };

  const handleDeleteSupplier = async () => {
    if (supplierId) {
      const response: DeleteSupplierResponse = await deleteSupplierMutation.mutateAsync({ supplierId });
      if (response.status === "success") {
        success(response?.message);
      }
      toggleModal();
    }
  };

  const onSubmit = async (data: UpdateSupplierFormData) => {
    try {
      if (supplierId) {
        const response = await updateSupplierMutation.mutateAsync({ supplierId, data });
        if (response.status === "success") {
          success(response?.message);
        }
      } else {
        alert("Supplier ID not defined");
      }
      reset();
      toggleModal();
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
      case 3:
        isStepValid = await trigger(["bank_details"]);
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
    <Modal onClose={toggleModal} isOpen={showModal}>
      <div className="px-4 py-6 sm:px-10">
        <div className="flex justify-between w-full mb-6">
          <div>
            <h2 className="text-xl font-bold">Update Supplier</h2>
            <p className="text-gray-500 mt-1">
              Update the supplier&apos;s information below
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`rounded-full border border-gray-300 w-8 h-8 flex items-center justify-center ${step === num ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}>
                  {num}
                </div>
                {num < 3 && <div className="border-t border-gray-300 w-8"></div>}
              </div>
            ))}
          </div>
        </div>

        {isSupplierLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoaderSpinner size="md" text="Loading supplier data..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col">
              <p className="text-gray-500 mb-6">
                {step === 1 ? "Basic details" : step === 2 ? "Address details" : "Bank details"}
              </p>

              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="text"
                      label="Full Name"
                      className="mt-1 w-full"
                      placeholder="Input full name"
                      {...register("full_name")}
                    />
                    {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
                  </div>

                  <div>
                    <Input
                      type="email"
                      label="Email"
                      className="mt-1 w-full"
                      placeholder="Input email address"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>

                  <div>
                    <Input
                      type="text"
                      label="Phone Number"
                      className="mt-1 w-full"
                      placeholder="Input phone number"
                      {...register("phone")}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                  </div>

                  <div className="relative">
                    <Select
                      label="Category"
                      options={categories}
                      {...register("category")}
                      onChange={(e) => {
                        setValue("category", e.target.value);
                        const selectedCat = categories.find(cat => cat.id === e.target.value);
                        if (selectedCat) {
                          setSelectedCategory(selectedCat.name);
                        }
                      }}
                      value={watch("category")}
                      defaultValue={selectedCategory}
                      error={errors.category?.message}
                      loading={categoryLoading}
                      isError={errorCategory}
                      required
                      placeholder="Select a category"
                      component={<CreateCategory add={true} />}
                    />
                  </div>

                  <div className="mt-5 sm:mt-0 col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`text-2xl ${Number(ratings) >= star ? "text-yellow-400" : "text-gray-300"}`}
                          onClick={() => setValue("rating", star)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
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
                      {...register("address.zip_code")}
                    />
                    {errors.address?.zip_code && <p className="text-red-500 text-sm">{errors.address.zip_code.message}</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
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

                  <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <Button
                      className="px-5 py-2 bg-red-500 text-white rounded-lg flex justify-center items-center hover:bg-red-600 transition-colors"
                      onClick={() => {
                        reset();
                        handleDeleteSupplier();
                        setShowModal(false);
                      }}
                    >
                      <span className="text-[13px]">Delete Supplier</span>
                    </Button>
                    <Button
                      type="submit"
                      className="px-5 py-2 text-white rounded-lg flex justify-center items-center"
                      disabled={isPending}
                    >
                      <span className="text-[13px]">{isPending ? "Updating..." : "Update Supplier"}</span>
                    </Button>
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
              </div>
            </div>
          </form>
        )}
        {isError && <p className="text-red-500 mt-4">Error updating supplier</p>}
      </div>
    </Modal>
  );
};

export default UpdateSupplier;