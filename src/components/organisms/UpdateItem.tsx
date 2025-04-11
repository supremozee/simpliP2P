import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '../atoms/Input'; 
import Button from '../atoms/Button';
import Modal from "../atoms/Modal";
import useStore from '@/store';
import { useEffect, useState } from "react";
import useUpdateItem from "@/hooks/useUpdateItem";
import useFetchItemById from "@/hooks/useFetchItemById";
import { MdEdit } from "react-icons/md";

const UpdateItemSchema = z.object({
  item_name: z.string().min(1, "Name of the product is required"),
  unit_price: z.preprocess((val) => parseFloat(val as string), z.number().positive().finite()),
  pr_quantity: z.preprocess((val) => parseInt(val as string, 10), z.number().optional()),
  image_url: z.string().optional(),
  status: z.enum(["APPROVED", "PENDING", "REJECTED", "REQUESTED_MODIFICATION"]).optional(),
});

type UpdateItemFormData = z.infer<typeof UpdateItemSchema>;

const UpdateItem = ({ id, disabled }: { id: string, disabled?:boolean }) => {
  const { currentOrg, loading} = useStore();
  const [isOpen, setIsOpen] = useState(false)
  const {updateItem} = useUpdateItem(currentOrg);
  const itemById = useFetchItemById(id);
 const item = itemById.data?.data?.item
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<UpdateItemFormData>({
    resolver: zodResolver(UpdateItemSchema),
    defaultValues: {
      item_name: "",
      unit_price: 0.00,
      pr_quantity: 0,
      image_url: "",
      status: "PENDING",
    },
  });

  useEffect(() => {
    if (item) {
      setValue("item_name", item.item_name);
      setValue("unit_price", parseFloat(item.unit_price));
      setValue("pr_quantity", item.pr_quantity);
      setValue("image_url", item.image_url || "");
      setValue("status",  item.status || "PENDING");
    }
  }, [item, setValue]);

  const onSubmit =(data: UpdateItemFormData) => {
     updateItem( id, data );
  };

  return (
    <>
      <Button
      type="button"
        disabled={disabled}
      kind="tertiary"
        className="p-2  max-w-8 flex justify-center items-center text-[10px] bg-primary rounded-full font-[500]"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <MdEdit color="white" />
      </Button>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
          <div className="px-4 py-6 sm:px-10">
            <h2 className="text-xl font-bold mb-4">Update Item</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  label="Item Name"
                  className="mt-1 w-full"
                  value={item?.item_name}
                  placeholder="Enter item name"
                  {...register("item_name")}
                />
                {errors.item_name && <p className="text-red-500 text-sm">{errors.item_name.message}</p>}
              </div>

              <div>
                <Input
                  type="text"
                  label="Unit Price"
                  className="mt-1 w-full"
                  placeholder="Enter unit price"
                  {...register("unit_price")}
                />
                {errors.unit_price && <p className="text-red-500 text-sm">{errors.unit_price.message}</p>}
              </div>

              <div>
                <Input
                  type="number"
                  label="Stock Quantity"
                  className="mt-1 w-full"
                  placeholder="Enter stock quantity"
                  {...register("pr_quantity")}
                />
                {errors.pr_quantity && <p className="text-red-500 text-sm">{errors.pr_quantity.message}</p>}
              </div>

              <div>
                <Input
                  type="text"
                  label="Image URL"
                  className="mt-1 w-full"
                  placeholder="Enter image URL"
                  {...register("image_url")}
                />
                {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
              </div>

              <div>
                <Input
                  type="text"
                  label="Status"
                  className="mt-1 w-full"
                  placeholder="Status"
                  {...register("status")}
                  readOnly
                />
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
              </div>

              <div className="flex justify-end mt-6 space-x-4 col-span-1 sm:col-span-2">
                <Button
                  type="submit"
                  className="px-5 py-2 text-white rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UpdateItem;