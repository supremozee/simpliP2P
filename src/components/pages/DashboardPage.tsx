"use client"
import React from 'react'
import Card from '../atoms/Card'
import useGetOrganizationDashboardById from '@/hooks/useGetOrganizationDashboardById'
import DashboardSkeleton from '../atoms/Skeleton/Dashboard'
import ErrorComponent from '../molecules/ErrorComponent'
import useStore from '@/store'
import CreateSupplier from '../organisms/CreateSupplier'
import CreateProduct from '../organisms/CreateProduct'
import { IoWallet, IoTrendingUp, IoTime } from 'react-icons/io5'
import { FaFileInvoice, FaBoxOpen, FaUserTie } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { formatNumber } from '@/utils/formatters'

const DashboardPage = () => {
  const { currentOrg, error: deError, orgName } = useStore()
  const { organizationDashboard, isLoading, error } = useGetOrganizationDashboardById(currentOrg)

  const metrics = organizationDashboard?.data?.metrics || {
    totalSuppliers: 0,
    totalProducts: 0,
    pendingPurchaseOrders: 0
  }

  if (isLoading) return <DashboardSkeleton />
  if (error) return <ErrorComponent text={error?.message || 'An error occurred. Please try again later.'} error={deError}/>

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome to {orgName}&apos;s Procurement Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your organization&apos;s procurement process efficiently. Monitor inventory, track orders, and streamline approvals.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaUserTie className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Suppliers</p>
                <p className="text-2xl font-semibold text-gray-800">{formatNumber(metrics.totalSuppliers)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <FaBoxOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-800">{formatNumber(metrics.totalProducts)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <FaFileInvoice className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-semibold text-gray-800">{formatNumber(metrics.pendingPurchaseOrders)}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CreateProduct custom={true} />
          <CreateSupplier custom={true} />
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Summary</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <IoWallet className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">Total Suppliers</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{formatNumber(metrics.totalSuppliers)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <IoTrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">Total Products</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{formatNumber(metrics.totalProducts)}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <IoTime className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-gray-700">Pending Orders</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{formatNumber(metrics.pendingPurchaseOrders)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage