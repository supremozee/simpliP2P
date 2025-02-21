import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '../atoms/Input'; 
import Button from '../atoms/Button';
import Modal from "../atoms/Modal";
import { ModalProps } from "@/types";
import useCreateSupplier from '@/hooks/useCreateSupplier';
import useStore from '@/store';
import StarRating from "../atoms/StarRating";
import Select from "../atoms/Select";
import useFetchCategories from "@/hooks/useFetchCategories";
import CreateCategory from "./CreateCategory";
import { useState } from "react";

const CreateSupplierSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  phone: z.string().min(10, "Phone is required").regex(/^[0-9]+$/, "Phone number must contain only numbers"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  bank_details: z.object({
    account_number: z.string().min(10, "Account number is required"),
    bank_name: z.string().min(1, "Bank name is required"),
    account_name: z.string().min(1, "Account name is required"),
  })
});

type SupplierFormData = z.infer<typeof CreateSupplierSchema>;

const CreateSupplier: React.FC<ModalProps> = ({ showModal = false, setShowModal }) => {
  const { currentOrg } = useStore();
  const { createSupplier, loading, errorMessage, successCreate } = useCreateSupplier();
  const { data: categoryData, isLoading: categoryLoading, isError: errorCategory } = useFetchCategories(currentOrg);
  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue, watch, trigger } = useForm<SupplierFormData>({
    resolver: zodResolver(CreateSupplierSchema),
    mode:"onChange"
  });

  const [step, setStep] = useState(1);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onSubmit = async (data: SupplierFormData) => {
    try {
      await createSupplier(data, currentOrg);
      reset();
      toggleModal();
    } catch (error) {
      console.error("Error creating supplier:", error);
    }
  };

  const categories = categoryData?.data.categories || [];
  const rating = watch("rating", 0);
  const category = watch("category");

  const handleNextStep = async() => {
    const isStepValid = await trigger(["full_name", "phone", "address", "email", "category", "rating"]);
    if(isStepValid) {
    setStep(step + 1);
  };
}

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <Modal onClose={toggleModal} isOpen={showModal}>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="px-4 py-6 sm:px-10">
          <div className="flex justify-between w-full">
            <h2 className="text-xl font-bold mb-1">Create Supplier</h2>
            <div className="flex items-center space-x-2">
                  <div className={`rounded-full border border-gray-300 w-8 h-8 flex items-center justify-center ${step === 1 ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}>
                    1
                  </div>
                  <div className="border-t border-gray-300 w-8"></div>
                  <div className={`rounded-full border border-gray-300 w-8 h-8 flex items-center justify-center ${step === 2 ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}>
                    2
                  </div>
              </div>
          </div>
          <div className="flex flex-col ">
            <p className="text-gray-500">
              {step === 1 ? "Basic details" : "Bank details"}
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

                <div>
                  <Input
                    type="text"
                    label="Address"
                    className="mt-1 w-full"
                    placeholder="Input address"
                    {...register("address")}
                  />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>

                <div className='relative'>
                  <Select
                    label="Categories"
                    options={categories}
                    {...register("category")}
                    onChange={(e) => setValue("category", e.target.value)}
                    required
                    value={category}
                    display="id"
                    error={errors.category?.message}
                    loading={categoryLoading}
                    isError={errorCategory}
                    component={
                      <CreateCategory add={true} />
                    }
                  />
                </div>

                <div className="mt-5 sm:mt-0">
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

            <div className="flex justify-between items-center mt-6 space-x-4 col-span-1 sm:col-span-2">
              <div className="flex w-full justify-end items-end">
                {step > 1 && (
                  <Button
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                )}
                {step < 2 && (
                  <Button
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                    onClick={handleNextStep}
                    
                  >
                    Next
                  </Button>
                )}
                {step === 2 && (
                  <Button
                    type="submit"
                    disabled={!isValid}
                    className="px-5 py-2 text-white rounded-lg"
                  >
                    {loading ? "Creating..." : "Create Supplier"}
                  </Button>
                )}
              </div>
            </div>
          </div>
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          {successCreate && <p className="text-green-500 mt-4">Supplier created successfully</p>}
        </div>
      </form>
    </Modal>
  );
};

export default CreateSupplier;