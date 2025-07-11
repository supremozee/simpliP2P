import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col font-roboto">
      <div className="sm:mt-0 mt-10 flex flex-wrap justify-center gap-5 font-roboto">
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className="sm:w-[300px] w-[165px] sm:h-[150px] h-[160px] bg-gray-200 animate-pulse"
          >
            <div className="flex flex-col h-full sm:py-[33px] sm:pl-[32px] py-5 pl-4">
              <div className="sm:w-[100px] w-[60px] h-[20px] bg-gray-300 mb-2"></div>
              <div className="w-[50px] h-[50px] bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <div className="text-[text-primary] font-bold w-[150px] h-[20px] bg-gray-300 mb-2"></div>
        <div className="flex sm:flex-row flex-col sm:gap-10 gap-2">
          <div className="w-full sm:py-7 rounded-[15px] flex gap-5 bg-gray-200 animate-pulse sm:justify-start justify-center items-center">
            <div className="w-[200px] h-[40px] bg-gray-300"></div>
          </div>
          <div className="w-full sm:py-7 rounded-[15px] flex gap-5 bg-gray-200 animate-pulse sm:justify-start justify-center items-center">
            <div className="w-[200px] h-[40px] bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
