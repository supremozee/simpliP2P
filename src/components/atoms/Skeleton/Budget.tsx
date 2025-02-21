import React from 'react';
import { motion } from "framer-motion";

const BudgetSummarySkeleton = () => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.2 }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-white shadow-md rounded-xl p-5 border border-gray-200 animate-pulse"
          whileHover={{ scale: 1.05 }}
        >
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
          <div className="w-full mt-2 h-1 rounded bg-gray-300"></div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BudgetSummarySkeleton;