"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Modal from "../atoms/Modal";
import useStore from "@/store";
import { FaImage, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/utils/cn";
import useAddItemsToRequistion from "@/hooks/useAddItemsToRequisition";
import LoaderSpinner from "../atoms/LoaderSpinner";
import useFileManager from "@/hooks/useFileManager";

const AddItemSchema = z.object({
  pr_id: z.string().min(1, "PR ID is required"),
  item_name: z.string().min(1, "Item Name is required"),
  pr_quantity: z.number().nonnegative("Quantity must be at least 0"),
  unit_price: z.number().positive("Unit price must be a positive number"),
  image_url: z.instanceof(File).optional(),
});

type AddItemFormData = z.infer<typeof AddItemSchema>;

const AddNewItem = () => {
  const { currentOrg, pr, loading } = useStore();
  const { addItemsToRequisition } = useAddItemsToRequistion();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset} = useForm<AddItemFormData>({
    resolver: zodResolver(AddItemSchema),
  });
  const [isOpen, setIsOpen] = useState(false);
  const {uploadFile, loading:imageLoading} = useFileManager()
  const productRef = useRef<HTMLInputElement>(null)
  const handleFileChange = async () => {
    const file = productRef.current?.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      const response= await uploadFile(file);
      setImagePreview(response?.url);
    }
  }
  const onSubmit = async (data: AddItemFormData) => {
    try {
      const imageUrl = imagePreview ?? "";
      await addItemsToRequisition({ ...data, image_url: imageUrl }, currentOrg);
      reset();
      setImagePreview(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding item:", error);
    } 
  };

  return (
    <>
      <Button
        type="button"
        className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <FaPlus className="w-3 h-3" />
        <span>Add New Item</span>
      </Button>

      <Modal 
        onClose={() => setIsOpen(false)} 
        isOpen={isOpen}
        title="Add New Item"
        contentClassName="max-w-2xl"
      >
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input
              type="hidden"
              {...register("pr_id")}
              value={pr?.id}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  label="Item Name"
                  required
                  placeholder="Enter item name"
                  {...register("item_name")}
                />
                {errors.item_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.item_name.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="number"
                  label="Quantity"
                  required
                  placeholder="Enter quantity"
                  {...register("pr_quantity", { valueAsNumber: true })}
                />
                {errors.pr_quantity && (
                  <p className="mt-1 text-sm text-red-500">{errors.pr_quantity.message}</p>
                )}
              </div>

              <div>
                <Input
                  type="number"
                  label="Unit Price"
                  required
                  placeholder="Enter unit price"
                  {...register("unit_price", { valueAsNumber: true })}
                />
                {errors.unit_price && (
                  <p className="mt-1 text-sm text-red-500">{errors.unit_price.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Item Image
              </label>
              {imageLoading ? <LoaderSpinner/> :<div 
                className={cn(
                  "relative border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  "hover:bg-gray-50 group",
                  imagePreview ? "h-64" : "h-48",
                  errors.image_url ? "border-red-300" : "border-gray-300"
                )}
                onClick={() => document.getElementById("image_url")?.click()}
              >
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Item Preview"
                      fill
                      className="object-contain p-4"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-sm">Click to change image</p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <FaImage className="w-12 h-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Click to upload image</p>
                    <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                  </div>
                )}
                <input
                  id="image_url"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("image_url")}
                  onChange={handleFileChange}
                  ref={productRef}
                />
              </div>}
              {errors.image_url && (
                <p className="text-sm text-red-500">{errors.image_url.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                onClick={() => {
                  reset();
                  setImagePreview(null);
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 text-sm text-white bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-2"
                disabled={loading}
              >
                {(loading) ? (
                  <>
                    <LoaderSpinner size="sm" color="white" />
                    <span>Adding Item...</span>
                  </>
                ) : (
                  <span>Add Item</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default AddNewItem;