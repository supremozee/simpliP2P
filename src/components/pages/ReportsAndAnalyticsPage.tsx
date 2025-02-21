"use client"
import React, { useState } from 'react';
import useFetchSuppliers from '@/hooks/useFetchSuppliers';
import Card from '../atoms/Card';
import useStore from '@/store';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import SupplierDetails from '../organisms/SupplierDetails';

const ReportsAndAnalyticsPage = () => {
    const {
        currentOrg,
        onToggle,
        setSupplierId, 
      } 
        = useStore();
  const { data:supplierData, isLoading } = useFetchSuppliers(currentOrg);
   const [showSupplierDetails, setShowSupplierDetails] = useState(false);
  const toggleSupplierDetails = ()=> {
    setShowSupplierDetails(true)
  }
  const handleOpenSupplier = (id:string)=> {
    setSupplierId(id)
  }
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={cn("relative transition-transform duration-700 ease-in-out",
       showSupplierDetails && "grid grid-cols-3")
    }> 
      <div className={cn("flex flex-wrap gap-5 w-full ", 
        showSupplierDetails && "col-span-2  "
      )}>
        {supplierData?.data?.map((supplier) => (
          <Card
            key={supplier.id}
            className={cn("p-4 flex items-center justify-between w-[150px] h-[66px] rounded-[10px] transition-all duration-700 ease-in-out cursor-pointer relative z-10", 
              onToggle ? "w-[375px]" : 'w-[310px]'
            )
            }
            onClick={() => {
              handleOpenSupplier(supplier.id)
              toggleSupplierDetails()
            }
        }
          >
            <div className="flex items-center gap-2 w-full">
              <Image
               src={'/testsupplier.png'}
                alt={supplier?.full_name}
                width={48}
                height={48} 
                className="w-12 h-12 rounded-[4px]" />
              <div className='flex flex-col w-full'>
                <h3 className="font-bold text-[18px] text-[#2E3A59] leading-none">{supplier?.full_name}</h3>
                <p className="text-[10px] text-[#8F9BB3]">{supplier.email}</p>
              </div>
            </div>
            <div className="text-right w-full flex flex-col">
              <p className="text-[0.9rem] text-[#2E3A59]">Completed Orders: <strong>{4}</strong></p>
              <div className=' w-full flex items-end justify-end'>
                <div className='border border-t w-[140px] border-[#F0F0F0]'></div>
              </div>
              <p className="text-[0.9rem] text-[#2E3A59]">Total spent: <strong>${50}</strong></p>
            </div>
          </Card>
        ))}
      </div>

      <div className={cn(
        "absolute top-0 right-0 h-full transition-transform duration-700 ease-in-out",
        showSupplierDetails ? "translate-x-0" : "translate-x-full"
      )}>
        {showSupplierDetails && (
          <Card className="p-4 border shadow-md bg-white w-[330px] h-auto rounded-[10px]">
            <SupplierDetails
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReportsAndAnalyticsPage;
