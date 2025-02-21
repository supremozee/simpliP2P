"use client";

import { usePathname, useRouter } from "next/navigation";
import useStore from "@/store";
import Card from "../atoms/Card";
import useGetUser from "@/hooks/useGetUser";
import LoaderSpinner from "../atoms/LoaderSpinner";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoBusinessOutline, IoAddCircle } from "react-icons/io5";
import Button from "../atoms/Button";

const OrganizationsPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useGetUser();
  const findUser = pathname.split('/').pop() === user?.data?.id;
  const { organizationByAdmin, organizationByUser, setCurrentOrg, setOrgName } = useStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderSpinner size="lg" text="Loading organizations..." />
      </div>
    );
  }

  if (!findUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <IoBusinessOutline className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">User Not Found</h2>
        <p className="text-gray-500 mt-2">We couldn&apos;t find the user you&apos;re looking for.</p>
      </div>
    );
  }

  if (!organizationByAdmin && (!organizationByUser || organizationByUser.length === 0)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoBusinessOutline className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              No Organizations Found
            </h2>
            <p className="text-gray-500 mb-8">
              Get started by creating your first organization. Set up your procurement workspace and invite team members.
            </p>
            <Button
              onClick={() => router.push('/create-organization')}
              className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 justify-center w-full"
            >
              <IoAddCircle className="w-5 h-5" />
              Create Organization
            </Button>
          </div>
        </div>
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
        <h1 className="text-3xl font-bold text-gray-900">Select an Organization</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose an organization to access its dashboard and resources
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-4xl grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card
            onClick={() => router.push('/create-organization')}
            className="group relative p-6 bg-white hover:bg-primary/5 transition-all duration-200 cursor-pointer rounded-xl shadow-sm hover:shadow-md border-2 border-dashed border-gray-200 hover:border-primary flex flex-col items-center justify-center min-h-[160px]"
          >
            <IoAddCircle className="w-10 h-10 text-primary mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Create New</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              Set up a new organization
            </p>
          </Card>
        </motion.div>

        {organizationByAdmin && (
          <motion.div variants={item}>
            <Card
              key={organizationByAdmin?.org_id}
              onClick={() => handleCardClick(organizationByAdmin.org_id, organizationByAdmin.name)}
              className="group relative p-6 bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer rounded-xl shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 ring-2 ring-primary/10">
                  <Image
                    src={organizationByAdmin?.logo || "/placeholder-org.png"}
                    alt={organizationByAdmin?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                    {organizationByAdmin?.name}
                  </h2>
                  <p className="text-sm text-primary font-medium">Administrator</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {organizationByUser?.map((org) => (
          <motion.div key={org.org_id} variants={item}>
            <Card
              onClick={() => handleCardClick(org.org_id, org.name)}
              className="group relative p-6 bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer rounded-xl shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 ring-2 ring-primary/10">
                  <Image
                    src={org?.logo || "/placeholder-org.png"}
                    alt={org?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                    {org?.name}
                  </h2>
                  <p className="text-sm text-gray-500">Member</p>
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