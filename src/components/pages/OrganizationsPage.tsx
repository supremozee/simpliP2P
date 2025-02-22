"use client"
import { usePathname, useRouter } from "next/navigation";
import useStore from "@/store";
import Card from "../atoms/Card";
import useGetUser from "@/hooks/useGetUser";
import LoaderSpinner from "../atoms/LoaderSpinner";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoBusinessOutline, IoAddCircle, IoChevronForward } from "react-icons/io5";
import Button from "../atoms/Button";

const OrganizationsPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useGetUser();
  const findUser = pathname.split('/').pop() === user?.data?.id;
  const { organizationByAdmin, organizationByUser, setCurrentOrg, setOrgName } = useStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <LoaderSpinner size="lg" text="Loading organizations..." />
        </div>
      </div>
    );
  }

  if (!findUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <IoBusinessOutline className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">User Not Found</h2>
          <p className="text-gray-500">We couldn&apos;t find the user you&apos;re looking for.</p>
          <Button
            onClick={() => router.push('/login')}
            className="mt-6 bg-gray-100 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!organizationByAdmin && (!organizationByUser || organizationByUser.length === 0)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoBusinessOutline className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Create Your First Organization
            </h2>
            <p className="text-gray-500 mb-8">
              Get started by creating your organization. Set up your procurement workspace and streamline your operations.
            </p>
            <Button
              onClick={() => router.push('/create-organization')}
              className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary/90 transition-all transform hover:scale-[1.02] flex items-center gap-3 justify-center w-full shadow-sm"
            >
              <IoAddCircle className="w-6 h-6" />
              <span className="font-medium">Create Organization</span>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleCardClick = (orgId: string, name: string) => {
    router.push(`/${name}/dashboard`);
    setCurrentOrg(orgId);
    setOrgName(name);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back!</h1>
        <p className="text-lg text-gray-600">
          Select an organization to access its dashboard and resources
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card
            onClick={() => router.push('/create-organization')}
            className="group relative p-8 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 cursor-pointer rounded-2xl shadow-sm hover:shadow-md border-2 border-dashed border-primary/20 hover:border-primary/30 flex flex-col items-center justify-center min-h-[200px]"
          >
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <IoAddCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Create New</h3>
            <p className="text-gray-500 text-center mt-2">
              Set up a new organization
            </p>
          </Card>
        </motion.div>

        {organizationByAdmin && (
          <motion.div variants={item}>
            <Card
              key={organizationByAdmin?.org_id}
              onClick={() => handleCardClick(organizationByAdmin.org_id, organizationByAdmin.name)}
              className="group relative p-8 bg-white hover:bg-gray-50 transition-all duration-300 cursor-pointer rounded-2xl shadow-sm hover:shadow-md border border-gray-100"
            >
              <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Admin
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 ring-4 ring-primary/10 mb-4 group-hover:ring-primary/20 transition-all duration-300">
                  <Image
                    src={organizationByAdmin?.logo || "/placeholder-org.png"}
                    alt={organizationByAdmin?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
                  {organizationByAdmin?.name}
                </h2>
                <p className="text-sm text-gray-500">Administrator Access</p>
                <div className="mt-6 flex items-center gap-2 text-primary">
                  <span className="text-sm font-medium">Open Dashboard</span>
                  <IoChevronForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {organizationByUser?.map((org) => (
          <motion.div key={org.org_id} variants={item}>
            <Card
              onClick={() => handleCardClick(org.org_id, org.name)}
              className="group relative p-8 bg-white hover:bg-gray-50 transition-all duration-300 cursor-pointer rounded-2xl shadow-sm hover:shadow-md border border-gray-100"
            >
              <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                Member
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 ring-4 ring-gray-100 mb-4 group-hover:ring-gray-200 transition-all duration-300">
                  <Image
                    src={org?.logo || "/placeholder-org.png"}
                    alt={org?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
                  {org?.name}
                </h2>
                <p className="text-sm text-gray-500">Member Access</p>
                <div className="mt-6 flex items-center gap-2 text-primary">
                  <span className="text-sm font-medium">Open Dashboard</span>
                  <IoChevronForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
export default OrganizationsPage;