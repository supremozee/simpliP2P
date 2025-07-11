import { motion } from "framer-motion";

const OrganizationCardSkeleton = () => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm drop-shadow-md border border-tertiary h-[320px] flex flex-col animate-pulse">
      {/* Badge Skeleton */}
      <div className="absolute top-4 right-4 bg-gray-200 rounded h-5 w-16"></div>
      
      {/* Content */}
      <div className="flex flex-col items-center h-full justify-center text-center gap-5">
        {/* Logo Skeleton */}
        <div className="relative w-20 h-20 rounded-2xl bg-gray-200 ring-4 ring-gray-100 flex-shrink-0"></div>
        
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      
      {/* Footer Skeleton */}
      <div className="flex flex-col items-end justify-end p-4 gap-2 mt-10 border-t border-gray-100 w-full">
        <div className="flex gap-2 items-center justify-center">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const OrganizationCardsSkeleton = ({ count = 4 }: { count?: number }) => {
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full flex flex-wrap gap-4 justify-center"
    >
      {/* Create Organization Card Skeleton */}
      <motion.div variants={item}>
        <div className="relative p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm border-2 border-dashed border-gray-300 flex flex-col gap-5 items-center justify-center h-[320px] animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-5 bg-gray-200 rounded w-40"></div>
        </div>
      </motion.div>

      {/* Organization Cards Skeletons */}
      {Array.from({ length: count }).map((_, index) => (
        <motion.div key={index} variants={item} aria-label="skeleton-card">
          <OrganizationCardSkeleton />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default OrganizationCardsSkeleton;