"use client";
import React from "react";
import Card from "../atoms/Card";
import useGetOrganizationDashboardById from "@/hooks/useGetOrganizationDashboardById";
import DashboardSkeleton from "../atoms/Skeleton/Dashboard";
import ErrorComponent from "../molecules/ErrorComponent";
import useStore from "@/store";
import CreateSupplier from "../organisms/CreateSupplier";
import CreateProduct from "../organisms/CreateProduct";
import { IoWallet, IoTrendingUp, IoTime } from "react-icons/io5";
import { FaFileInvoice, FaBoxOpen, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";
import { formatNumber } from "@/utils/formatters";
import useUserPermissions from "@/hooks/useUserPermissions";
import { ReactTyped } from "react-typed";

const DashboardPage = () => {
  const { currentOrg, error: deError, orgName } = useStore();
  const { organizationDashboard, isLoading, error } =
    useGetOrganizationDashboardById(currentOrg);
  const { checkPermission } = useUserPermissions();

  const metrics = organizationDashboard?.data?.metrics || {
    totalSuppliers: 0,
    totalProducts: 0,
    pendingPurchaseOrders: 0,
  };

  if (isLoading) return <DashboardSkeleton />;
  if (error)
    return (
      <ErrorComponent
        text={error?.message || "An error occurred. Please try again later."}
        error={deError}
      />
    );

  return (
    <main className="flex flex-col gap-6 overflow-hidden">
      {/* Welcome Section */}
      <section className="mt-5">
        <h1 className="text-3xl font-bold text-primary capitalize">
          <ReactTyped
            strings={[` Welcome to ${orgName}&apos;s dashboard`]}
            typeSpeed={50}
            showCursor={false}
          />
        </h1>
        <p className="text-foreground text-[16px]">
          Manage your organization&apos;s procurement process efficiently.
          <br />
          Monitor inventory, track orders, and streamline approvals.
        </p>
      </section>

      {/* Key Metrics */}
      <section>
        <div className="flex md:flex-row flex-col gap-3 ">
          {checkPermission(["get_suppliers", "manage_suppliers"]) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FaUserTie className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">Total Suppliers</p>
                    <p className="text-2xl font-semibold text-primary">
                      {formatNumber(metrics.totalSuppliers)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {checkPermission(["get_products", "manage_products"]) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <FaBoxOpen className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">Total Products</p>
                    <p className="text-2xl font-semibold text-primary">
                      {formatNumber(metrics.totalProducts)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {checkPermission([
            "manage_purchase_orders",
            "get_purchase_orders",
          ]) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <FaFileInvoice className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">Pending Orders</p>
                    <p className="text-2xl font-semibold text-primary">
                      {formatNumber(metrics.pendingPurchaseOrders)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {checkPermission(["create_products"]) && (
            <CreateProduct custom={true} />
          )}
          {checkPermission(["create_suppliers", "manage_suppliers"]) && (
            <CreateSupplier custom={true} />
          )}
        </div>
      </section>

      {/* Activity Summary */}
      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-primary mb-4">
          Activity Summary
        </h2>
        <div className="space-y-4">
          {checkPermission(["manage_suppliers"]) && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <IoWallet className="w-5 h-5 text-blue-600" />
                <span className="text-sm #181819">Total Suppliers</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(metrics.totalSuppliers)}
              </span>
            </div>
          )}
          {checkPermission(["manage_products"]) && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <IoTrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm #181819">Total Products</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(metrics.totalProducts)}
              </span>
            </div>
          )}
          {checkPermission(["manage_purchase_orders"]) && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <IoTime className="w-5 h-5 text-yellow-600" />
                <span className="text-sm #181819">Pending Orders</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(metrics.pendingPurchaseOrders)}
              </span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
