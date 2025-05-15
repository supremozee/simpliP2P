"use client"
import useFetchPurchaseRequisition from '@/hooks/useFetchPurchaseRequisition'
import useStore from '@/store'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IoAlertCircleOutline } from "react-icons/io5"
import { FaArrowRight, FaEdit, FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa"
import { MdHistory } from "react-icons/md"
import LoaderSpinner from '@/components/atoms/LoaderSpinner'
import useFetchRequsitionsSavedForLater from '@/hooks/useFetchRequistionsSavedForLater'

type StatusConfig = {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  actionText: string;
}

const Layout = ({children}:{children:React.ReactNode}) => {
    const {currentOrg, orgName} = useStore()
    const {data, isLoading} = useFetchPurchaseRequisition(currentOrg)
    const {data:savedData, isLoading:isLoadingSaved} = useFetchRequsitionsSavedForLater(currentOrg)
    const router = useRouter()
    const params = useParams()
    const [existingPR, setExistingPR] = useState(false)
    const pr = params.pr as string[]
    let pr_number = ""
    if(pr && pr.length == 1) {
      pr_number = pr[0];
    } 
    const findPr = data?.data?.requisitions.find((pr) => pr.pr_number === pr_number) 
  const savedPr=  savedData?.data.requisitions.find((pr) => pr.pr_number === pr_number)
    
    useEffect(() => {
        if(findPr && savedPr?.status !== "SAVED_FOR_LATER" && findPr.status !== "INITIALIZED") {
            setExistingPR(true)
        }
    }, [findPr, savedPr])

    const statusConfig: Record<string, StatusConfig> = {
        "PENDING": {
            title: "Purchase Requisition is Pending Approval",
            description: `This PR (${pr_number}) has been submitted and is awaiting approval from the relevant authorities.`,
            icon: <IoAlertCircleOutline className="text-3xl" />,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-500",
            actionText: "View PR Status"
        },
        "APPROVED": {
            title: "Purchase Requisition Approved!",
            description: `Congratulations! This PR (${pr_number}) has been approved and is now in processing.`,
            icon: <FaCheckCircle className="text-3xl" />,
            iconBgColor: "bg-green-100",
            iconColor: "text-green-500",
            actionText: "View Approved PR"
        },
        "REJECTED": {
            title: "Purchase Requisition Rejected",
            description: `This PR (${pr_number}) has been rejected. Please check the comments for the reason.`,
            icon: <FaTimesCircle className="text-3xl" />,
            iconBgColor: "bg-red-100",
            iconColor: "text-red-500",
            actionText: "View Rejection Details"
        },
        "REQUEST_MODIFICATION": {
            title: "Modifications Requested",
            description: `This PR (${pr_number}) needs some changes. Please check the comments and update accordingly.`,
            icon: <FaEdit className="text-3xl" />,
            iconBgColor: "bg-amber-100",
            iconColor: "text-amber-500",
            actionText: "View Requested Changes"
        },
        "SAVED_FOR_LATER": {
            title: "Draft Purchase Requisition",
            description: `This PR (${pr_number}) is saved as a draft. You can complete it from the Purchase Requisitions page.`,
            icon: <MdHistory className="text-3xl" />,
            iconBgColor: "bg-gray-100",
            iconColor: "text-gray-500",
            actionText: "Continue Editing"
        }
    }

    if(existingPR && findPr) {
        const status = findPr.status;
        const config = statusConfig[status] || {
            title: "Purchase Requisition Status",
            description: `This PR (${pr_number}) currently has a status of ${status}.`,
            icon: <FaEye className="text-3xl" />,
            iconBgColor: "bg-purple-100",
            iconColor: "text-purple-500",
            actionText: "View PR Details"
        };

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-md max-w-2xl w-full p-6 md:p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className={`${config.iconBgColor} p-3 rounded-full`}>
                            <span className={config.iconColor}>{config.icon}</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
                        {config.title}
                    </h2>
                    <p className="text-gray-600 text-center mb-6">
                        {config.description}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
                        <h3 className="font-medium text-gray-700 mb-2">What can I do next?</h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>View the PR details and status in your Purchase Requisitions page</span>
                            </li>
                            {/* {status === "REQUEST MODIFICATION" && (
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>Make the requested changes to update your requisition</span>
                                </li>
                            )} */}
                            {status === "REJECTED" && (
                                <li className="flex items-start">
                                    <span className="text-primary mr-2">•</span>
                                    <span>Review the rejection reason to understand what went wrong</span>
                                </li>
                            )}
                            <li className="flex items-start">
                                <span className="text-primary mr-2">•</span>
                                <span>Create a new Purchase Requisition if needed</span>
                            </li>
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                            onClick={() => router.push(`/${orgName}/purchase-requisitions`)}
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                            {config.actionText}
                            <FaArrowRight className="ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    if(isLoading || isLoadingSaved) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderSpinner />
            </div>
        )
    }
    return (
        <div id='modal-initialize'>
            {children}
        </div>
    )
}

export default Layout