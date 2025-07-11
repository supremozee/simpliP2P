/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactTyped } from "react-typed";
import { usePathname, useRouter } from "next/navigation";
import useStore from "@/store";
import Card from "../atoms/Card";
import useGetUser from "@/hooks/useGetUser";
import LoaderSpinner from "../atoms/LoaderSpinner";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  IoBusinessOutline,
  IoAddCircle,
  IoChevronForward,
} from "react-icons/io5";
import Button from "../atoms/Button";
import { sanitize } from "@/utils/helpers";
import NotUser from "../atoms/Icons/NotUser";

const OrganizationsPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useGetUser();
  const { userId } = useStore();
  const findUser = pathname.split("/").pop() === userId;
  const { setCurrentOrg, setOrgName } = useStore();
  const handleCardClick = (orgId: string, name: string) => {
    const sanitizedOrgName = sanitize(name);
    router.push(`/${sanitizedOrgName}/dashboard`);
    setCurrentOrg(orgId);
    setOrgName(sanitizedOrgName);
  };
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <LoaderSpinner size="lg" text="Loading organizations..." />
        </div>
      </div>
    );
  }

  if (user?.data?.user_organisations.length === 0) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-tertiary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-[450px] drop-shadow-md w-full mx-4 flex flex-col gap-4"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <IoBusinessOutline className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-primary text-center">
            Create Your First <br /> Organization
          </h2>
          <p className="text-foreground">
            Get started by creating your organization. Set up your procurement
            workspace and streamline your operations.
          </p>
          <div className="flex justify-center items-center">
            <Button
              onClick={() => router.push("/create-organization")}
              className="bg-primary text-white px-5 py-4 rounded-xl hover:bg-tertiary transition-all transform hover:scale-[1.02] flex items-center gap-3 justify-center mt-4 shadow-sm"
            >
              <IoAddCircle className="w-6 h-6" />
              <span className="font-medium">Create Organization</span>
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }
  if (!findUser) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-tertiary">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-[450px] drop-shadow-md w-full mx-4 flex flex-col gap-4">
          <div className="w-24 h-24 bg-red-300 rounded-full flex items-center justify-center mx-auto">
            <NotUser />
          </div>
          <h2 className="text-2xl font-semibold text-primary">
            User Not Found
          </h2>
          <p className="text-foreground">
            We couldn&apos;t find the user you&apos;re looking for.
          </p>
          <div className="flex justify-center items-center">
            <Button
              onClick={() => router.push("/login")}
              className="bg-tertiary text-foreground px-6 py-2 rounded-xl hover:bg-primary transition-colors"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-8 items-center py-8 px-3 bg-tertiary">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center flex flex-col gap-1 "
      >
        <h1 className="text-4xl font-bold text-primary">
          <ReactTyped
            strings={[`Welcome ${user?.data?.first_name}!`]}
            typeSpeed={50}
            showCursor={false}
          />
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 10 }}
          className="text-lg text-foreground"
        >
          Select an organization to access its dashboard and resources
        </motion.p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full flex flex-wrap gap-4 justify-center"
      >
        <motion.div variants={item}>
          <Card
            onClick={() => router.push(`/create-organization`)}
            className="group  relative p-8 bg-gradient-to-br from-primary/5 to-primary hover:from-primary/10 hover:to-primary/20 transition-all duration-300 cursor-pointer rounded-2xl shadow-sm hover:shadow-md border-2 border-dashed border-primary/90 hover:border-primary flex flex-col gap-5 items-center justify-center h-[320px]"
          >
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
              <IoAddCircle className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground text-center font-semibold text-lg">
              Set up a new organization
            </p>
          </Card>
        </motion.div>

        {user?.data?.user_organisations?.map((org) => (
          <motion.div key={org.org_id} variants={item} aria-label="list-orgs">
            <Card
              onClick={() => handleCardClick(org.org_id, org.name)}
              className="group relative bg-white hover:bg-tertiary transition-all duration-300 cursor-pointer rounded-2xl shadow-sm drop-shadow-md hover:shadow-md border border-tertiary h-[320px] flex flex-col"
            >
              <em className="absolute top-4 right-4 text-primary  text-sm font-medium">
                {org.is_creator === true ? "Admin" : "Member"}
              </em>
              <div className="flex flex-col items-center h-full justify-center text-center gap-5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-tertiary ring-4 ring-primary group-hover:ring-primary/20 transition-all duration-300 flex-shrink-0 flex justify-center items-center">
                  <Image
                    src={org?.logo || "/logo-black.png"}
                    alt={org?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-xl font-semibold text-primary group-hover:text-primary transition-colors line-clamp-2 capitalize">
                  {org?.name}
                </h4>
              </div>
              <div className="flex flex-col items-end justify-end p-4 gap-2 text-primary mt-10 border-t border-tertiary w-full">
                <div className="flex gap-2 items-center justify-center">
                  <em className="text-sm font-medium">Open Dashboard</em>
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
