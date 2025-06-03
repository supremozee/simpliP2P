import React from 'react';

interface TableHeadersProps {
  activeTab: string;
}

const TableHeaders: React.FC<TableHeadersProps> = ({ activeTab }) => {
  // Define headers based on active tab
  const getHeaders = () => {
    switch (activeTab) {
      case "Branches":
        return (
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-center w-16">s/n</th>
            <th className="px-4 py-3 text-left flex items-center gap-2">
              <span>Name</span>
            </th>
            {/* <th className="px-4 py-3 text-left">Address</th> */}
            <th className="px-4 py-3 text-center w-32">Actions</th>
          </tr>
        );
      case "Departments":
        return (
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-center w-16">s/n</th>
            <th className="px-4 py-3 text-left flex items-center gap-2">
              <span>Name</span>
            </th>
            <th className="px-4 py-3 text-center w-32">Actions</th>
          </tr>
        );
      case "Categories":
        return (
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-center w-16">s/n</th>
            <th className="px-4 py-3 text-left flex items-center gap-2">
              <span>Name</span>
            </th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center w-32">Actions</th>
          </tr>
        );
      default:
        return (
          <tr className="bg-gray-100">
            <th className="px-4 py-3 text-center">#</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        );
    }
  };

  return <thead>{getHeaders()}</thead>;
};

export default TableHeaders;