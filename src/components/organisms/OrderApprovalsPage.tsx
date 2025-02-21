"use client";
import React from "react";
import TableSkeleton from "../atoms/Skeleton/Table";
import Button from "../atoms/Button";
import OrderApprovalModal from "./OrderAppprovalModal";
import useStore from "@/store";
import useFetchAllOrders from "@/hooks/useFetchAllOrders";

const OrdersApprovalPage = () => {
  const { currentOrg, setIsOpen, isOpen, pr, setPr } = useStore();
  const { data: pendingData, isLoading: pendingLoading } = useFetchAllOrders(currentOrg, "PENDING");
  const pendingOrders = pendingData?.data.orders || [];
  const findPendingOrder = pendingOrders.find((order)=> order?.purchase_requisition?.id === pr?.id);
  if (pendingLoading) return <TableSkeleton />;

  return (
    <>
      {isOpen && <OrderApprovalModal order_id={findPendingOrder?.id || ""} />}
      <div className="overflow-x-auto relative z-10">
        <h1 className="text-[#333333] text-sm font-medium">Approve purchase orders for your team</h1>
        {(!pendingLoading&&pendingOrders.length > 0 )? (
          pendingOrders.map((order) => (
            <div key={order.id} className="border-b border-[#808080] py-5 flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <Button
                  className="bg-primary px-4 py-2 w-[100px] flex justify-center items-center"
                  onClick={() => {
                    setPr({
                      pr_number: order.purchase_requisition.pr_number,
                      id: order.purchase_requisition.id,
                    });
                    if (findPendingOrder?.id) {
                      setIsOpen(true);
                    }
                  }}
                >
                  <span className="text-white text-[12px]">#{order?.po_number.split('-').pop()}</span>
                </Button>
                <div className="z-20">
                  <p className="text-[#333333] text-sm">
                    <span className="font-bold text-[15px]">Supplier:</span> {order.supplier?.full_name}
                  </p>
                  <p className="text-[#333333] text-sm">
                    <span className="font-bold text-[15px]">Total Amount:</span> ${order.total_amount}
                  </p>
                  <p className="text-[#333333] text-sm">
                    <span className="font-bold text-[15px]">Created At:</span>{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button className="bg-[#ec6425] bg-opacity-70 px-4 py-2 w-[100px] rounded-full flex justify-center items-center">
                <span className="text-[8px] text-white italic">{order.status}....</span>
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-[#999999] mt-10">No pending orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrdersApprovalPage;